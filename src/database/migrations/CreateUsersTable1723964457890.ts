import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1723964457890 implements MigrationInterface {
    name = 'CreateUsersTable1723964457890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`first_name\` varchar(255) NULL,
                \`last_name\` varchar(255) NULL,
                \`role\` enum ('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
                \`email\` varchar(255) NULL UNIQUE,
                \`password\` varchar(255) NULL,
                \`phone\` varchar(255) NULL,
                \`avatar\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB;
        `);

        await queryRunner.query(`
            CREATE TABLE \`user_settings\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`theme\` varchar(255) NULL,
                \`language\` varchar(255) NULL,
                \`user_id\` int NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`REL_user_settings_user_id\` (\`user_id\`)
            ) ENGINE=InnoDB;
        `);

        await queryRunner.query(`
            ALTER TABLE \`user_settings\`
            ADD CONSTRAINT \`FK_user_settings_user\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            CREATE TABLE \`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                \`content\` text NOT NULL,
                \`user_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB;
        `);

        await queryRunner.query(`
            ALTER TABLE \`posts\`
            ADD CONSTRAINT \`FK_posts_user\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_posts_user\``);
        await queryRunner.query(`DROP TABLE \`posts\``);

        await queryRunner.query(`ALTER TABLE \`user_settings\` DROP FOREIGN KEY \`FK_user_settings_user\``);
        await queryRunner.query(`DROP INDEX \`REL_user_settings_user_id\` ON \`user_settings\``);
        await queryRunner.query(`DROP TABLE \`user_settings\``);

        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
