import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskIndexes1759154081649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
    `);

    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS btree_gin;
    `);

    await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
    `);

    await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_tasks_user_created_at ON tasks(user_id, created_at DESC);
      `);

    await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_tasks_user_id_title_trgm ON tasks USING GIN (user_id, title gin_trgm_ops);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_tasks_user_id_title_trgm;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tasks_user_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tasks_user_created_at;`);
  }
}
