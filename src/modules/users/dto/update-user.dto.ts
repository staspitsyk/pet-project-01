import { PickType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(CreateUserDto, ['name', 'nickname'] as const) {}

export class PatchUserDto extends PartialType(UpdateUserDto) {}
