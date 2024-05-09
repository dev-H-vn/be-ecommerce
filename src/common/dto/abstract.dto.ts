import {
  DateField,
  DYNAMIC_TRANSLATION_DECORATOR_KEY,
  UUIDField,
} from '../../decorators';
import { ContextProvider } from '../../providers';
import { type AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @UUIDField()
  id!: Uuid;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }
  }
}
