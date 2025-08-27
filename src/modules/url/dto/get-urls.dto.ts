import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUrlsDto {
  @IsString()
  @IsOptional()
  filter?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @Min(1)
  page?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @Min(1)
  limit?: number;
}
