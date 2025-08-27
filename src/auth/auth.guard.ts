import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = req.headers[`x-api-key`];
    const apiKey = this.configService.getOrThrow<string>(`apiKey`);

    if (apiKey !== apiKeyHeader) {
      throw new UnauthorizedException(`API key is  missing or invalid`);
    }

    return true;
  }
}
