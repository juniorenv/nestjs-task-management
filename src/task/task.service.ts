import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTaskDto,
  FindAllTasksDto,
  PageDto,
  PageMetaDto,
  PartialUpdateTaskDto,
  TaskDto,
  UpdateTaskDto,
} from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/entities/task.entity';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  private mapEntityToDto(entity: TaskEntity): TaskDto {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      expirationDate: entity.expirationDate,
    };
  }

  public async findAll(
    userId: string,
    queryParams: FindAllTasksDto,
  ): Promise<PageDto<TaskDto>> {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (queryParams.title) {
      queryBuilder.andWhere('task.title LIKE :title', {
        title: `%${queryParams.title}%`,
      });
    }

    if (queryParams.status) {
      queryBuilder.andWhere('task.status = :status', {
        status: queryParams.status,
      });
    }

    const itemCount = await queryBuilder.getCount();

    const skip = (queryParams.page - 1) * queryParams.limit;

    if (itemCount === 0 && queryParams.page > 1) {
      throw new BadRequestException(
        `No items found matching the criteria. Cannot access page ${queryParams.page}`,
      );
    }

    if (skip >= itemCount && itemCount > 0) {
      const maxPage = Math.ceil(itemCount / queryParams.limit);
      throw new BadRequestException(
        `Page ${queryParams.page} exceeded maximum page ${maxPage}`,
      );
    }

    const tasksFound = await queryBuilder
      .orderBy('task.createdAt', queryParams.order)
      .skip(skip)
      .take(queryParams.limit)
      .getMany();

    const taskDtos = tasksFound.map((task) => this.mapEntityToDto(task));

    const pageMeta = new PageMetaDto(
      {
        page: queryParams.page,
        limit: queryParams.limit,
        order: queryParams.order,
      },
      itemCount,
    );

    return new PageDto(taskDtos, pageMeta);
  }

  public async findOne(userId: string, taskId: string): Promise<TaskDto> {
    const foundTask = await this.findTaskEntity(userId, taskId);
    return this.mapEntityToDto(foundTask);
  }

  private async findTaskEntity(
    userId: string,
    taskId: string,
  ): Promise<TaskEntity> {
    try {
      const foundTask = await this.tasksRepository.findOneOrFail({
        where: {
          id: taskId,
          userId,
        },
      });

      return foundTask;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }

      if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type uuid')) {
          throw new BadRequestException(`Invalid task ID format: ${taskId}`);
        }
      }

      throw error;
    }
  }

  public async create(userId: string, task: CreateTaskDto): Promise<TaskDto> {
    const dbTask = this.tasksRepository.create({
      title: task.title,
      description: task.description,
      status: task.status,
      expirationDate: task.expirationDate,
      createdAt: new Date(),
      userId,
    });

    try {
      const savedTask = await this.tasksRepository.save(dbTask);
      return this.mapEntityToDto(savedTask);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('Invalid user ID');
        }
      }
      throw error;
    }
  }

  public async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    const task = await this.findTaskEntity(userId, taskId);

    const updatedTask = this.tasksRepository.merge(task, updateTaskDto);

    const savedTask = await this.tasksRepository.save(updatedTask);
    return this.mapEntityToDto(savedTask);
  }

  public async partialUpdate(
    userId: string,
    taskId: string,
    partialTaskDto: PartialUpdateTaskDto,
  ): Promise<TaskDto> {
    const task = await this.findTaskEntity(userId, taskId);

    const updatedTask = this.tasksRepository.merge(task, partialTaskDto);

    const savedTask = await this.tasksRepository.save(updatedTask);
    return this.mapEntityToDto(savedTask);
  }

  public async delete(userId: string, taskId: string): Promise<TaskDto> {
    const taskToDelete = await this.findTaskEntity(userId, taskId);

    await this.tasksRepository.remove(taskToDelete);

    return this.mapEntityToDto(taskToDelete);
  }
}
