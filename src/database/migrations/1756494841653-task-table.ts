import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskTable1756494841653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            title VARCHAR(256) NOT NULL,
            description VARCHAR(512) NOT NULL,
            status VARCHAR(50) DEFAULT 'TO_DO',
            expiration_date timestamptz NOT NULL,
            created_at timestamptz NOT NULL,
            CONSTRAINT tasks_pk PRIMARY KEY (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tasks;`);
  }
}
