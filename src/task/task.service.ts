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

  public async findAll(params: FindAllParams): Promise<TaskDto[]> {
    const searchParams: FindOptionsWhere<TaskDto> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchParams.status = Like(`%${params.status}%`);
    }

    const tasksFound = await this.tasksRepository.find({
      where: searchParams,
    });

    return tasksFound;
  }

  public async findOne(taskId: string): Promise<TaskDto> {
    try {
      const foundTask = await this.tasksRepository.findOneOrFail({
        where: {
          id: taskId,
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

  public async create(task: CreateTaskDto): Promise<TaskDto> {
    const dbTask = this.tasksRepository.create({
      title: task.title,
      description: task.description,
      status: task.status,
      expirationDate: task.expirationDate,
      createdAt: new Date(),
    });

    const savedTask = await this.tasksRepository.save(dbTask);
    return savedTask;
  }

  public async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    const task = await this.findOne(taskId);

    const updatedTask = this.tasksRepository.merge(task, updateTaskDto);

    return this.tasksRepository.save(updatedTask);
  }

  public async partialUpdate(
    taskId: string,
    partialTaskDto: PartialUpdateTaskDto,
  ): Promise<TaskDto> {
    const task = await this.findOne(taskId);

    const updatedTask = this.tasksRepository.merge(task, partialTaskDto);

    return this.tasksRepository.save(updatedTask);
  }

  public async delete(taskId: string): Promise<TaskDto> {
    const taskToDelete = await this.findOne(taskId);

    await this.tasksRepository.remove(taskToDelete);

    return taskToDelete;
  }
}
