import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class AddRBAC1754669177061 implements MigrationInterface {
  name = 'AddRBAC1754669177061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(`
            CREATE TABLE "${schema}"."permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "resource" character varying NOT NULL,
                "action" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_7331684c0c5b063803a425001a0" UNIQUE ("resource", "action"),
                CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "${schema}"."roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "${schema}"."users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "lastName" character varying,
                "email" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "${schema}"."user_roles" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
                "assigned_by" uuid,
                CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "${schema}"."role_permissions" (
                "role_id" uuid NOT NULL,
                "permission_id" uuid NOT NULL,
                CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "${schema}"."role_permissions" ("role_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "${schema}"."role_permissions" ("permission_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles" DROP COLUMN "assigned_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles" DROP COLUMN "assigned_by"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles"
            ADD "assigned_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles"
            ADD "assigned_by" uuid
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "${schema}"."user_roles" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "${schema}"."user_roles" ("role_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles"
            ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "${schema}"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles"
            ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."role_permissions"
            ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."role_permissions"
            ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(`
            ALTER TABLE "${schema}"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"
        `);
    await queryRunner.query(`
            DROP INDEX "${schema}"."IDX_b23c65e50a758245a33ee35fda"
        `);
    await queryRunner.query(`
            DROP INDEX "${schema}"."IDX_87b8888186ca9769c960e92687"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles" DROP COLUMN "assigned_by"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles" DROP COLUMN "assigned_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles"
            ADD "assigned_by" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "${schema}"."user_roles"
            ADD "assigned_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            DROP INDEX "${schema}"."IDX_17022daf3f885f7d35423e9971"
        `);
    await queryRunner.query(`
            DROP INDEX "${schema}"."IDX_178199805b901ccd220ab7740e"
        `);
    await queryRunner.query(`
            DROP TABLE "${schema}"."role_permissions"
        `);
    await queryRunner.query(`
            DROP TABLE "${schema}"."user_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "${schema}"."users"
        `);
    await queryRunner.query(`
            DROP TABLE "${schema}"."roles"
        `);
    await queryRunner.query(`
            DROP TABLE "${schema}"."permissions"
        `);
  }
}
