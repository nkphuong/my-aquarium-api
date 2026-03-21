import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MasterResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  MasterResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<MasterResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        status: 'success',
        message: 'Success',
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
