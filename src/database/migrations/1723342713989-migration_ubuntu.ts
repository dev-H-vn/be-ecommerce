import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationUbuntu1723342713989 implements MigrationInterface {
    name = 'MigrationUbuntu1723342713989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cards_card_state_enum" AS ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "card_state" "public"."cards_card_state_enum" NOT NULL DEFAULT 'ACTIVE', "card_products" json NOT NULL DEFAULT '[]', "card_count_products" numeric NOT NULL, "card_user_id" uuid, CONSTRAINT "REL_b7eb4d5aa4a97862c43f60ddde" UNIQUE ("card_user_id"), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."discounts_discount_applies_to_enum" AS ENUM('ALL', 'SPECIFIC')`);
        await queryRunner.query(`CREATE TABLE "discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "discount_name" character varying NOT NULL DEFAULT '', "discount_des" character varying NOT NULL DEFAULT '', "discount_type" "public"."discounts_discount_type_enum" NOT NULL DEFAULT 'FIX_AMOUNT', "discount_code" character varying NOT NULL, "discount_start_date" TIMESTAMP NOT NULL DEFAULT now(), "discount_end_date" TIMESTAMP NOT NULL DEFAULT now(), "discount_max_uses" numeric NOT NULL DEFAULT '0', "discount_used_count" numeric NOT NULL DEFAULT '0', "discount_users_used" json NOT NULL DEFAULT '[]', "discount_min_oder" numeric NOT NULL DEFAULT '0', "discount_active" boolean NOT NULL DEFAULT false, "discount_applies_to" "public"."discounts_discount_applies_to_enum" NOT NULL DEFAULT 'ALL', "discount_shop_id" uuid NOT NULL, "discount_applies_to_ids" uuid array NOT NULL DEFAULT array[]::uuid[], CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_b7eb4d5aa4a97862c43f60ddde1" FOREIGN KEY ("card_user_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_b7eb4d5aa4a97862c43f60ddde1"`);
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_discount_applies_to_enum"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TYPE "public"."cards_card_state_enum"`);
    }

}
