import { MigrationInterface, QueryRunner } from "typeorm";

export class Run1722922876626 implements MigrationInterface {
    name = 'Run1722922876626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "dis_count_active"`);
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "dis_count_applies_to"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_dis_count_applies_to_enum"`);
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "dis_count_applies_to_ids"`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT array[]::uuid[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "discounts" ADD "dis_count_applies_to_ids" uuid array NOT NULL DEFAULT ARRAY[]`);
        await queryRunner.query(`CREATE TYPE "public"."discounts_dis_count_applies_to_enum" AS ENUM('ALL', 'SPECIFIC')`);
        await queryRunner.query(`ALTER TABLE "discounts" ADD "dis_count_applies_to" "public"."discounts_dis_count_applies_to_enum" NOT NULL DEFAULT 'ALL'`);
        await queryRunner.query(`ALTER TABLE "discounts" ADD "dis_count_active" boolean NOT NULL DEFAULT false`);
    }

}
