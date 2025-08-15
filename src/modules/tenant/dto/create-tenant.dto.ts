import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la empresa es requerido' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El subdominio es requerido' })
  subdomain: string;
}
