import { ApiProperty } from "@nestjs/swagger";

export class ConflictResponse {
    @ApiProperty()
  message: string;
  @ApiProperty()
  success: boolean;
}
