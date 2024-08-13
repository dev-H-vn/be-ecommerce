import { MigrationInterface, QueryRunner } from "typeorm";

export class Macos1723539418403 implements MigrationInterface {
    name = 'Macos1723539418403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."carts_card_state_enum" AS ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "card_state" "public"."carts_card_state_enum" NOT NULL DEFAULT 'ACTIVE', "card_products" json NOT NULL DEFAULT '[]', "card_count_products" numeric NOT NULL DEFAULT '0', "card_user_id" uuid NOT NULL, CONSTRAINT "REL_b3f0538ccd4517d57cf123d768" UNIQUE ("card_user_id"), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_card_state_enum" AS ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "card_state" "public"."orders_card_state_enum" NOT NULL DEFAULT 'ACTIVE', "card_products" json NOT NULL DEFAULT '[]', "card_count_products" numeric NOT NULL DEFAULT '0', "card_user_id" uuid NOT NULL, CONSTRAINT "REL_110e6928fc122d86a702220bec" UNIQUE ("card_user_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "discounts" ADD "discount_value" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_shop_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT array[]::uuid[]`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_b3f0538ccd4517d57cf123d7689" FOREIGN KEY ("card_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_110e6928fc122d86a702220bec6" FOREIGN KEY ("card_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_110e6928fc122d86a702220bec6"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_b3f0538ccd4517d57cf123d7689"`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_shop_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "discount_value"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_card_state_enum"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TYPE "public"."carts_card_state_enum"`);
    }

}
