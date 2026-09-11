import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  code?: string;
  details?: unknown[];
}

function statusCodeToCode(status: number): string {
  const map: Record<number, string> = {
    [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
    [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
    [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
    [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
    [HttpStatus.CONFLICT]: 'CONFLICT',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
  };
  return map[status] ?? 'ERROR';
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) {
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: unknown[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();      code = statusCodeToCode(status);

      const res = exception.getResponse() as ExceptionResponse;
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object') {
        if (Array.isArray(res.message)) {
          details = res.message;
          message = 'Validation failed';
          code = 'VALIDATION_ERROR';
        } else if (typeof res.message === 'string') {
          message = res.message;
          details = [];
        } else {
          details = [];
        }
        if (res.error) {
          code = res.error;
        }
      }

      if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          `${request.method} ${request.url} — ${this.stringify(exception)}`
        );
      }
    } else {
      this.logger.error(
        `${request.method} ${request.url} — ${this.stringify(exception)}`
      );
      const err = exception as Error;
      message = err?.message || 'Internal server error';
    }

    response.status(status).json({
      success: false,
      message,
      error: {
        code,
        details,
      },
    });
  }

    private stringify(exception: unknown): string {
      try {
        return JSON.stringify(exception);
      } catch {
        return String(exception);
      }
    }
}
