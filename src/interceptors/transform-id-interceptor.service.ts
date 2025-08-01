import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformIdInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.transformIds(data))
    );
  }

  private transformIds(data: any): any {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.transformIds(item));
    }

    if (this.isBufferObject(data?._id)) {
      return {
        ...data,
        _id: this.bufferToHex(data._id),
      };
    }

    for (const key of Object.keys(data)) {
      if (this.isBufferObject(data[key])) {
        data[key] = this.bufferToHex(data[key]);
      } else if (typeof data[key] === 'object') {
        data[key] = this.transformIds(data[key]);
      }
    }

    return data;
  }

  private isBufferObject(obj: any): boolean {
    return obj && typeof obj === 'object' && Buffer.isBuffer(obj.buffer);
  }

  private bufferToHex(obj: any): string {
    return obj.buffer.toString('hex');
  }
}
