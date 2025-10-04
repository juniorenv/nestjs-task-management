import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskTable1756494848553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            title VARCHAR(256) NOT NULL,
            description VARCHAR(512) NOT NULL,
            status VARCHAR(50) DEFAULT 'TO_DO',
            expiration_date timestamptz NOT NULL,
            created_at timestamptz NOT NULL,
            user_id uuid NOT NULL,
            CONSTRAINT pk_tasks PRIMARY KEY (id),
            CONSTRAINT fk_tasks_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT chk_tasks_status CHECK (status IN ('TO_DO', 'IN_PROGRESS', 'DONE'))
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tasks CASCADE;`);
  }
}
