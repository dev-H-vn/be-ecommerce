import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDicountValue1723369338290 implements MigrationInterface {
    name = 'AddDicountValue1723369338290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT array[]::uuid[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT ARRAY[]`);
    }

}
