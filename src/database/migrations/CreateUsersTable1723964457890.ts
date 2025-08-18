import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1723964457890 implements MigrationInterface {
    name = 'CreateUsersTable1723964457890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`created_at\` BIGINT(10) NOT NULL,
                \`updated_at\` BIGINT(10) NOT NULL,
                \`first_name\` VARCHAR(255) NULL,
                \`last_name\` VARCHAR(255) NULL,
                \`role\` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
                \`email\` VARCHAR(255) NULL UNIQUE,
                \`password\` VARCHAR(255) NULL,
                \`phone\` VARCHAR(255) NULL,
                \`avatar\` VARCHAR(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB;
        `);

        await queryRunner.query(`
            CREATE TABLE \`user_settings\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`theme\` VARCHAR(255) NULL,
                \`created_at\` BIGINT(10) NOT NULL,
                \`updated_at\` BIGINT(10) NOT NULL,
                \`language\` VARCHAR(255) NULL,
                \`user_id\` INT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`UQ_user_settings_user_id\` (\`user_id\`)
            ) ENGINE=InnoDB;
        `);

        await queryRunner.query(`
            ALTER TABLE \`user_settings\`
            ADD CONSTRAINT \`FK_user_settings_user_id\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await queryRunner.query(`
            CREATE TABLE \`posts\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`title\` VARCHAR(255) NOT NULL,
                \`content\` TEXT NOT NULL,
                \`created_at\` BIGINT(10) NOT NULL,
                \`updated_at\` BIGINT(10) NOT NULL,
                \`user_id\` INT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB;
        `);

        await queryRunner.query(`
            ALTER TABLE \`posts\`
            ADD CONSTRAINT \`FK_posts_user_id\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_posts_user_id\``);
        await queryRunner.query(`DROP TABLE \`posts\``);

        await queryRunner.query(`ALTER TABLE \`user_settings\` DROP FOREIGN KEY \`FK_user_settings_user_id\``);
        await queryRunner.query(`DROP INDEX \`UQ_user_settings_user_id\` ON \`user_settings\``);
        await queryRunner.query(`DROP TABLE \`user_settings\``);

        await queryRunner.query(`DROP TABLE \`users\``);
    }
}