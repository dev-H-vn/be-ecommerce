import { IsObject } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { NotificationType } from 'constant';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'notification' })
export class notificationEntity extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.NEW_PRODUCT,
  })
  notifyType!: NotificationType;

  @Column('uuid')
  notifySenderId!: Uuid;

  @Column('uuid')
  notifyReceivedId!: Uuid;

  @Column({ type: 'varchar' })
  notifyContent!: string;

  @IsObject({ each: true })
  notifyOptions!: Record<string, any>;
}
