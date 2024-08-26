import { PartialType } from '@nestjs/swagger';
import { CreateRabbitDto } from './create-rabbit.dto';

export class UpdateRabbitDto extends PartialType(CreateRabbitDto) {}
