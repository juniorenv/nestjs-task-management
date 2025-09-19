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
  UseGuards,
} from '@nestjs/common';
import {
  CreateTaskDto,
  FindAllParams,
  PartialUpdateTaskDto,
  TaskDto,
  UpdateTaskDto,
} from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  public async findAll(@Query() params: FindAllParams): Promise<TaskDto[]> {
    return await this.taskService.findAll(params);
  }

  @Get('/:taskId')
  public async findOne(@Param('taskId') taskId: string): Promise<TaskDto> {
    return await this.taskService.findOne(taskId);
  }

  @Post()
  public async create(@Body() task: CreateTaskDto): Promise<TaskDto> {
    return await this.taskService.create(task);
  }

  @Put('/:taskId')
  public async update(
    @Param('taskId') taskId: string,
    @Body() task: UpdateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.update(taskId, task);
  }

  @Patch('/:taskId')
  public async partialUpdate(
    @Param('taskId') taskId: string,
    @Body() task: PartialUpdateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.partialUpdate(taskId, task);
  }

  @Delete('/:taskId')
  public async delete(@Param('taskId') taskId: string): Promise<TaskDto> {
    return this.taskService.delete(taskId);
  }
}
