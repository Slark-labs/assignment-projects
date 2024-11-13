import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  data?: any;
}
