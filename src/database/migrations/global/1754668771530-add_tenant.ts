import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenant1754668771530 implements MigrationInterface {
    name = 'AddTenant1754668771530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "public"."tenants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "subdomain" character varying NOT NULL,
                "schema_name" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"),
                CONSTRAINT "UQ_21bb89e012fa5b58532009c1601" UNIQUE ("subdomain"),
                CONSTRAINT "UQ_c2a961556326eec0e3b19f3ced5" UNIQUE ("schema_name"),
                CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "public"."tenants"
        `);
    }

}
