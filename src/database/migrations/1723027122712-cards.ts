import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cards1723027122712 implements MigrationInterface {
  name = 'Cards1723027122712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."cards_card_state_enum" AS ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'PENDING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "card_state" "public"."cards_card_state_enum" NOT NULL DEFAULT 'ACTIVE', "discount_users_used" json NOT NULL DEFAULT '[]', "card_count_products" numeric NOT NULL, "card_user_id" uuid, CONSTRAINT "REL_b7eb4d5aa4a97862c43f60ddde" UNIQUE ("card_user_id"), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT array[]::uuid[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" ADD CONSTRAINT "FK_b7eb4d5aa4a97862c43f60ddde1" FOREIGN KEY ("card_user_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cards" DROP CONSTRAINT "FK_b7eb4d5aa4a97862c43f60ddde1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT ARRAY[]`,
    );
    await queryRunner.query(`DROP TABLE "cards"`);
    await queryRunner.query(`DROP TYPE "public"."cards_card_state_enum"`);
  }
}
