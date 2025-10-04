import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
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
  TaskStatusEnum,
  UpdateTaskDto,
} from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiUnauthorized,
  ApiBadRequest,
  ApiInternalServerError,
  ApiNotFound,
} from 'src/common/decorators/api-common-responses.decorator';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Retrieve a list of tasks with optional filtering by title and status',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter tasks by title (partial match, case-sensitive)',
    schema: {
      type: 'string',
      minLength: 1,
      maxLength: 256,
    },
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatusEnum,
    description: 'Filter tasks by exact status match',
    schema: {
      type: 'string',
      enum: Object.values(TaskStatusEnum),
    },
  })
  @ApiOkResponse({
    description: 'Tasks retrieved successfully',
    type: [TaskDto],
  })
  @ApiUnauthorized()
  @ApiInternalServerError()
  public async findAll(
    @Request() req: AuthenticatedRequest,
    @Query() params: FindAllParams,
  ): Promise<TaskDto[]> {
    const userId = req.user.sub;

    return await this.taskService.findAll(userId, params);
  }

  @Get('/:taskId')
  @ApiOperation({
    summary: 'Get Task by ID',
    description: 'Retrieve a specific task by its unique identifier.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    format: 'uuid',
    description: 'Unique identifier of the task (UUID format)',
  })
  @ApiOkResponse({
    description: 'Task retrieved successfully',
    type: TaskDto,
  })
  @ApiBadRequest()
  @ApiNotFound()
  @ApiInternalServerError()
  @ApiUnauthorized()
  public async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('taskId') taskId: string,
  ): Promise<TaskDto> {
    const userId = req.user.sub;

    return await this.taskService.findOne(userId, taskId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create New Task',
    description:
      'Create a new task with title, description, status, and expiration date.',
  })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: TaskDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data - validation errors',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            error: { type: 'string', example: 'Bad Request' },
            message: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        examples: {
          bodyValidationErrors: {
            summary: 'Request Body Validation Errors',
            description: 'When request body fields fail validation rules',
            value: {
              message: [
                'title must be shorter than or equal to 256 characters',
                'title must be longer than or equal to 4 characters',
                'title must be a string',
                'description must be shorter than or equal to 512 characters',
                'description must be longer than or equal to 6 characters',
                'description must be a string',
                'expirationDate must be a valid ISO 8601 date string',
              ],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          invalidTaskId: {
            summary: 'Invalid User ID Error',
            description:
              'When the user ID from JWT token violates foreign key constraint',
            value: {
              message: 'Invalid user ID',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiUnauthorized()
  @ApiInternalServerError()
  public async create(
    @Request() req: AuthenticatedRequest,
    @Body() task: CreateTaskDto,
  ): Promise<TaskDto> {
    const userId = req.user.sub;

    return await this.taskService.create(userId, task);
  }

  @Put('/:taskId')
  @ApiOperation({
    summary: 'Update a task completely',
    description: 'Update all fields of an existing task',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    format: 'uuid',
    description: 'Unique identifier of the task to update',
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: TaskDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data - validation errors',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            error: { type: 'string', example: 'Bad Request' },
            message: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        examples: {
          bodyValidationErrors: {
            summary: 'Request Body Validation Errors',
            description: 'When request body fields fail validation rules',
            value: {
              message: [
                'title must be shorter than or equal to 256 characters',
                'title must be longer than or equal to 4 characters',
                'title must be a string',
                'description must be shorter than or equal to 512 characters',
                'description must be longer than or equal to 6 characters',
                'description must be a string',
                'status must be one of the following values: TO_DO, IN_PROGRESS, DONE',
                'expirationDate must be a valid ISO 8601 date string',
              ],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          invalidTaskId: {
            summary: 'Invalid Task ID Parameter',
            description: 'When the taskId parameter is not a valid UUID format',
            value: {
              message: 'Invalid task ID format: invalid-id',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiNotFound()
  @ApiInternalServerError()
  @ApiUnauthorized()
  public async update(
    @Request() req: AuthenticatedRequest,
    @Param('taskId') taskId: string,
    @Body() task: UpdateTaskDto,
  ): Promise<TaskDto> {
    const userId = req.user.sub;

    return await this.taskService.update(userId, taskId, task);
  }

  @Patch('/:taskId')
  @ApiOperation({
    summary: 'Update a task partially',
    description: 'Update specific fields of an existing task',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    format: 'uuid',
    description: 'Unique identifier of the task to update',
  })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: TaskDto,
  })
  @ApiBadRequest()
  @ApiNotFound()
  @ApiInternalServerError()
  @ApiUnauthorized()
  public async partialUpdate(
    @Request() req: AuthenticatedRequest,
    @Param('taskId') taskId: string,
    @Body() task: PartialUpdateTaskDto,
  ): Promise<TaskDto> {
    const userId = req.user.sub;

    return await this.taskService.partialUpdate(userId, taskId, task);
  }

  @ApiOperation({
    summary: 'Delete a task',
    description: 'Remove a task from the system',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    format: 'uuid',
    description: 'Unique identifier of the task to delete',
  })
  @ApiOkResponse({
    description: 'Task deleted successfully - returns deleted task data',
    type: TaskDto,
  })
  @ApiBadRequest()
  @ApiNotFound()
  @ApiInternalServerError()
  @ApiUnauthorized()
  @Delete('/:taskId')
  public async delete(
    @Request() req: AuthenticatedRequest,
    @Param('taskId') taskId: string,
  ): Promise<TaskDto> {
    const userId = req.user.sub;

    return this.taskService.delete(userId, taskId);
  }
}
