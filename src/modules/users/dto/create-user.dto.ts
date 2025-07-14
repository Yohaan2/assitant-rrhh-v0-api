import { IsArray, IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray({ message: 'Los roles deben ser un array' })
  @IsUUID('4', { each: true, message: 'Cada rol debe ser un UUID válido' })
  roleIds: string[];
}
