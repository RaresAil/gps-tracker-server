import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HandleResponseInterceptor implements NestInterceptor {
  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (Array.isArray(value) && value.length) {
      return false;
    }

    if (typeof value === 'object' && Object.keys(value).length) {
      return false;
    }

    return true;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap((value) => {
        if (this.isEmpty(value)) {
          throw new NotFoundException();
        }

        return value;
      }),
    );
  }
}
