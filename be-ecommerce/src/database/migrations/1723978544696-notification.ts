import { MigrationInterface, QueryRunner } from "typeorm";

export class Notification1723978544696 implements MigrationInterface {
    name = 'Notification1723978544696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_notify_type_enum" AS ENUM('ORDER_FAILED', 'ORDER_SUCCESS', 'NEW_PRODUCT', 'NEW_DISCOUNT')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "notify_type" "public"."notification_notify_type_enum" NOT NULL DEFAULT 'NEW_PRODUCT', "notify_sender_id" uuid NOT NULL, "notify_received_id" uuid NOT NULL, "notify_content" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT array[]::uuid[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "discount_applies_to_ids" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_notify_type_enum"`);
    }

}
