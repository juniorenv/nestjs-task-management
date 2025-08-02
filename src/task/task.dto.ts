export class TaskDto {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  expirationDate: Date;
}

export interface FindAllParams {
  title?: string;
  status?: string;
}
