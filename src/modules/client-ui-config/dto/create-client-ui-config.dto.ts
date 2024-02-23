import { IsNotEmpty, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { CreateClientUiConfigInput } from '../../../graphql/graphql.schema';
import { Type } from 'class-transformer';

export class CreateClientUiConfigDto implements CreateClientUiConfigInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsBoolean()
  isFolder: boolean;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateClientUiConfigDto)
  items: CreateClientUiConfigDto[];
}
