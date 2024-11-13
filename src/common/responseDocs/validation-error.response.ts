import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  errors: any[];
}
