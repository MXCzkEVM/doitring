import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { LoggerService } from '../services'

@Injectable()
export class LogInterceptor implements NestInterceptor {
  public constructor(
    private readonly logger: LoggerService,
  ) { }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    const startTime = new Date().getTime()
    const request = context.switchToHttp().getRequest()

    return next.handle().pipe(
      map((data) => {
        const responseStatus = (request.method === 'POST') ? HttpStatus.CREATED : HttpStatus.OK
        this.logger.info(`${this.getTimeDelta(startTime)}ms ${request.ip} ${responseStatus} ${request.method} ${this.getUrl(request)}`)
        return data
      }),
      catchError((err) => {
        this.logger.error(`${this.getTimeDelta(startTime)}ms ${request.ip} ${err.status} ${request.method} ${this.getUrl(request)}`)
        return throwError(err)
      }),
    )
  }

  private getTimeDelta(startTime: number): number {
    return new Date().getTime() - startTime
  }

  private getUrl(request: Request): string {
    return `${request.protocol}://${request.get('host')}${request.originalUrl}`
  }
}
