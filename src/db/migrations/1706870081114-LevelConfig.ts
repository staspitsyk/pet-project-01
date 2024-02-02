import { MigrationInterface, QueryRunner } from "typeorm";

export class LevelConfig1706870081114 implements MigrationInterface {
    name = 'LevelConfig1706870081114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "level_config" ("id" SERIAL NOT NULL, "level" integer NOT NULL, "startXp" bigint NOT NULL, "endXp" bigint NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5d14501631e6c6da887eaa3e24b" UNIQUE ("level"), CONSTRAINT "PK_495826942d0f5f178136cc41173" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d14501631e6c6da887eaa3e24" ON "level_config" ("level") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5d14501631e6c6da887eaa3e24"`);
        await queryRunner.query(`DROP TABLE "level_config"`);
    }

}
