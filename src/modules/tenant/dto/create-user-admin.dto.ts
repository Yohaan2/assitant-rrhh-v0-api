import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateTenantDto } from './create-tenant.dto';

export class CreateUserAdminDto
  implements Omit<CreateUserDto, 'roleIds'>, CreateTenantDto
{
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la empresa es requerido' })
  company_name: string;

  @IsString()
  @IsNotEmpty({ message: 'El subdominio es requerido' })
  subdomain: string;

  @IsString()
  @IsNotEmpty({ message: 'El rol es requerido' })
  role: string;
}
