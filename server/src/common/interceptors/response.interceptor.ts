import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponseWrapper<T> {
  success: true;
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponseWrapper<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          typeof (data as { success?: unknown }).success === 'boolean'
        ) {
          return data as ApiResponseWrapper<T>;
        }

        return {
          success: true,
          message: 'Operation completed successfully',
          data: data === undefined ? null : (data as T),
        };
      })
    );
  }
}
