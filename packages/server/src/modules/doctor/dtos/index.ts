import { ApiProperty } from '@nestjs/swagger'

export class DiagnosisBody {
  @ApiProperty()
  method: string

  @ApiProperty()
  date: 'd' | 'w' | 'M'

  @ApiProperty()
  from: string

  @ApiProperty()
  lang: string

  @ApiProperty()
  signature: string

  @ApiProperty()
  prompt?: number
}

export class DiagnosisResponse {
  @ApiProperty()
  data: string
}
