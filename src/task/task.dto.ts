import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export enum TaskStatusEnum {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    minLength: 4,
    maxLength: 256,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(256)
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive README and API documentation',
    minLength: 6,
    maxLength: 512,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(512)
  description: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatusEnum,
    example: TaskStatusEnum.TO_DO,
    default: TaskStatusEnum.TO_DO,
  })
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: string;

  @ApiProperty({
    description: 'Task expiration date',
    example: '2026-09-18T13:34:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  expirationDate: Date;
}

export class TaskDto extends CreateTaskDto {
  @ApiProperty({
    description: 'Unique identifier for the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Task creation date',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description:
      "Owner user's UUID for this task. Populated by the server from the authenticated JWT; clients must not include this field in requests.",
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    readOnly: true,
  })
  @IsUUID()
  userId: string;
}

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Updated task title',
    minLength: 4,
    maxLength: 256,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(256)
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Updated description',
    minLength: 6,
    maxLength: 512,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(512)
  description: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatusEnum,
    example: TaskStatusEnum.IN_PROGRESS,
  })
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;

  @ApiProperty({
    description: 'Task expiration date',
    example: '2026-09-18T13:34:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  expirationDate: Date;
}

export class PartialUpdateTaskDto extends PartialType(UpdateTaskDto) {}

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Page number (1-indexed)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @ApiPropertyOptional({
    enum: OrderEnum,
    default: OrderEnum.DESC,
  })
  @IsEnum(OrderEnum)
  order: OrderEnum = OrderEnum.DESC;
}

export class FindAllTasksDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter tasks by title (partial match, case-sensitive)',
    example: 'documentation',
    minLength: 1,
    maxLength: 256,
  })
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    enum: TaskStatusEnum,
    description: 'Filter tasks by exact status match',
    example: TaskStatusEnum.TO_DO,
  })
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;
}

export class PageMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  readonly limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 10_000,
  })
  readonly itemCount: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 1000,
  })
  readonly pageCount: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor(pageOptions: PageOptionsDto, itemCount: number) {
    this.page = pageOptions.page;
    this.limit = pageOptions.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

export class TaskPageDto {
  @ApiProperty({
    type: () => [TaskDto],
    description: 'Array of tasks for the current page',
  })
  data: TaskDto[];

  @ApiProperty({ type: () => PageMetaDto, description: 'Pagination metadata' })
  meta: PageMetaDto;
}
