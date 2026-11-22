import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPasswordUniqueAndCommentAuthor1795307348466 implements MigrationInterface {
    name = 'FixPasswordUniqueAndCommentAuthor1795307348466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_52378a74ae3724bcab44036645b"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_638bac731294171648258260ff2"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_52378a74ae3724bcab44036645b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password")`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
