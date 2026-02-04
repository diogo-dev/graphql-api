import { IsEmail, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateUserDTO  {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  age?: number;

  @IsOptional()
  @IsPositive()
  height?: number;

  @IsOptional()
  @IsPositive()
  weight?: number;
}