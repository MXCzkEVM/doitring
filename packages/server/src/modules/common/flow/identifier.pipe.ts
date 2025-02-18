import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class IdentifierPipe implements PipeTransform<unknown, string> {
  public transform(value: unknown, _metadata: ArgumentMetadata): string {
    if (typeof value !== 'string')
      throw new HttpException('Identifier validation failed', HttpStatus.BAD_REQUEST)

    if (/^\d{1,64}$/.test(value))
      return value

    throw new HttpException('Identifier validation failed', HttpStatus.BAD_REQUEST)
  }
}
