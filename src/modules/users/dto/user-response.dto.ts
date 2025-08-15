import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [String] })
  roles: {
    id: string;
    name: string;
    description: string;
  }[];

  @ApiProperty({ type: [String] })
  permissions: string[];
}
