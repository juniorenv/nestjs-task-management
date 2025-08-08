import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParams, TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  private readonly tasks: TaskDto[] = [];

  public findAll(params: FindAllParams): TaskDto[] {
    return this.tasks.filter((task) => {
      let isMatch: boolean = true;

      if (
        params.title &&
        !task.title.toLowerCase().includes(params.title.toLowerCase())
      ) {
        isMatch = false;
      }

      if (
        params.status &&
        params.status.toLowerCase() !== task.status.toLowerCase()
      ) {
        isMatch = false;
      }

      return isMatch;
    });
  }

  public findOne(taskId: string): TaskDto {
    const foundTask = this.tasks.find((task) => task.id === taskId);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return foundTask;
  }

  public create(task: TaskDto): TaskDto {
    this.tasks.push(task);
    return task;
  }

  public update(taskId: string, updateTaskDto: TaskDto): TaskDto {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const updatedTask = {
      ...updateTaskDto,
      id: this.tasks[taskIndex].id,
    } satisfies TaskDto;

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  public partialUpdate(
    taskId: string,
    partialTaskDto: Partial<TaskDto>,
  ): TaskDto {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...partialTaskDto,
      id: taskId,
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  public delete(taskId: string): TaskDto {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const [deletedTask] = this.tasks.splice(taskIndex, 1);

    return deletedTask;
  }
}
