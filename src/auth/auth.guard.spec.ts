import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let configService: DeepMocked<ConfigService>;

  beforeEach(() => {
    configService = createMock<ConfigService>();
    configService.getOrThrow.mockReturnValue('SECRET');
    authGuard = new AuthGuard(configService);
  });

  it('should return true if api key is valid', () => {
    const mockedExecContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': 'SECRET',
          },
        }),
      }),
    });
    const result = authGuard.canActivate(mockedExecContext);
    expect(result).toBe(true);
  });

  it('should throw unauthorized error if api key is not passed', () => {
    const mockedExecContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });

    // Jest runs this in its own try catch wrapper and it doesnt bubble up
    // the error
    const result = () => authGuard.canActivate(mockedExecContext);
    expect(result).toThrow(UnauthorizedException);
  });

  it('should throw unauthorized error if passed api key is invalid', () => {
    const mockedExecContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': 'INVALID',
          },
        }),
      }),
    });
    const result = () => authGuard.canActivate(mockedExecContext);
    expect(result).toThrow(UnauthorizedException);
  });
});
