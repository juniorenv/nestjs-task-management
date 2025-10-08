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
  FindAllTasksDto,
  PageDto,
  PartialUpdateTaskDto,
  TaskDto,
  TaskPageDto,
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
    summary: 'Get all tasks with pagination',
    description: 'Retrieve a paginated list of tasks with optional filtering',
  })
  @ApiOkResponse({
    description: 'Tasks retrieved successfully',
    type: TaskPageDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination parameters or page number out of bounds',
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
          pageOutOfBounds: {
            summary: 'Page Out of Bounds',
            description:
              'When the requested page number exceeds the maximum available pages',
            value: {
              message: 'Page 10 exceeds maximum page 3',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          paginationValidationErrors: {
            summary: 'Pagination Validation Errors',
            description: 'When pagination parameters fail validation rules',
            value: {
              message: [
                'page must not be less than 1',
                'page must be an integer number',
                'limit must not be greater than 50',
                'limit must not be less than 1',
                'limit must be an integer number',
              ],
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
  public async findAll(
    @Request() req: AuthenticatedRequest,
    @Query() queryParams: FindAllTasksDto,
  ): Promise<PageDto<TaskDto>> {
    const userId = req.user.sub;

    return await this.taskService.findAll(userId, queryParams);
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
                'status must be one of the following values: TO_DO, IN_PROGRESS, DONE',
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
