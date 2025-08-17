import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { isPreTransformedResponse } from 'src/common/utils/type-guards';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Before the route handler

    return (
      next
        .handle()
        // After the route handler
        .pipe(
          map(
            (
              response:
                | string
                | number
                | Record<string, any>
                | undefined
                | null,
            ) => {
              if (!response) {
                return {
                  data: null,
                };
              }
              if (
                isPreTransformedResponse<string | number | Record<string, any>>(
                  response,
                )
              ) {
                return {
                  data: response.data,
                  meta: response.meta,
                };
              }
              return { data: response };
            },
          ),
        )
    );
  }
}
