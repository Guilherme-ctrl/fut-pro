import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const body =
        typeof res === 'string'
          ? { code: 'HTTP_ERROR', message: res }
          : (res as Record<string, unknown>);
      response.status(status).json({
        code: (body.code as string) ?? 'HTTP_ERROR',
        message:
          (body.message as string) ??
          (Array.isArray(body.message)
            ? (body.message as string[]).join(', ')
            : exception.message),
        details: body.details,
      });
      return;
    }

    // eslint-disable-next-line no-console
    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_ERROR',
      message: 'Erro interno',
    });
  }
}
