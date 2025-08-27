import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  redirect: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
