import { PartialType } from '@nestjs/mapped-types';
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
  @IsString()
  @MinLength(4)
  @MaxLength(256)
  title: string;

  @IsString()
  @MinLength(6)
  @MaxLength(512)
  description: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: string;

  @IsDateString()
  expirationDate: Date;
}

export class TaskDto extends CreateTaskDto {
  @IsUUID()
  id: string;

  @IsDateString()
  createdAt: Date;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(4)
  @MaxLength(256)
  title: string;

  @IsString()
  @MinLength(6)
  @MaxLength(512)
  description: string;

  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;

  @IsDateString()
  expirationDate: Date;
}

export class PartialUpdateTaskDto extends PartialType(UpdateTaskDto) {}

export interface FindAllParams {
  title?: string;
  status?: string;
}
