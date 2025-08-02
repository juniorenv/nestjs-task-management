import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FindAllParams, TaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  public findAll(@Query() params: FindAllParams): TaskDto[] {
    return this.taskService.findAll(params);
  }

  @Get('/:taskId')
  public findOne(@Param('taskId') taskId: string) {
    return this.taskService.findOne(taskId);
  }

  @Post()
  public create(@Body() task: TaskDto): TaskDto {
    return this.taskService.create(task);
  }

  @Put('/:taskId')
  public update(@Param('taskId') taskId: string, @Body() task: TaskDto) {
    return this.taskService.update(taskId, task);
  }

  @Patch('/:taskId')
  public partialUpdate(@Param('taskId') taskId: string, @Body() task: TaskDto) {
    return this.taskService.partialUpdate(taskId, task);
  }

  @Delete('/:taskId')
  public delete(@Param('taskId') taskId: string): TaskDto {
    return this.taskService.delete(taskId);
  }
}
