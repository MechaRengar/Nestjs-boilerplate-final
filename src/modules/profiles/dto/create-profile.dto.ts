import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  readonly firstName!: string;

  @IsString()
  readonly lastName!: string;

  @IsEmail()
  readonly email!: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsDateString()
  readonly dateOfBirth?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;
}