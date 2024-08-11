import { MigrationInterface, QueryRunner } from "typeorm";

export class Aaaa1723375128279 implements MigrationInterface {
    name = 'Aaaa1723375128279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT array[]::uuid[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT ARRAY[]`);
    }

}
