import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum TaskStatusEnum {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
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

export class FindAllTasksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: TaskStatusEnum })
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  @IsString()
  status?: string;
}
