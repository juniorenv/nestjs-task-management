import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'expiration_date' })
  expirationDate: Date;
}
