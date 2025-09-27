import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTaskDto,
  FindAllParams,
  PartialUpdateTaskDto,
  TaskDto,
  UpdateTaskDto,
} from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/database/entities/task.entity';
import {
  EntityNotFoundError,
  FindOptionsWhere,
  Like,
  QueryFailedError,
  Repository,
} from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  public async findAll(
    userId: string,
    params: FindAllParams,
  ): Promise<TaskEntity[]> {
    const searchParams: FindOptionsWhere<TaskDto> = {
      userId,
    };

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchParams.status = params.status;
    }

    const tasksFound = await this.tasksRepository.find({
      where: searchParams,
    });

    return tasksFound;
  }

  public async findOne(userId: string, taskId: string): Promise<TaskEntity> {
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

  public async create(
    userId: string,
    task: CreateTaskDto,
  ): Promise<TaskEntity> {
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
      return savedTask;
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
  ): Promise<TaskEntity> {
    const task = await this.findOne(userId, taskId);

    const updatedTask = this.tasksRepository.merge(task, updateTaskDto);

    return this.tasksRepository.save(updatedTask);
  }

  public async partialUpdate(
    userId: string,
    taskId: string,
    partialTaskDto: PartialUpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.findOne(userId, taskId);

    const updatedTask = this.tasksRepository.merge(task, partialTaskDto);

    return this.tasksRepository.save(updatedTask);
  }

  public async delete(userId: string, taskId: string): Promise<TaskEntity> {
    const taskToDelete = await this.findOne(userId, taskId);

    await this.tasksRepository.remove(taskToDelete);

    return taskToDelete;
  }
}
