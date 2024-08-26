import { IsObject } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { CartStatus, NotificationType, RoleType } from 'constant';
import { UUID } from 'crypto';
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
  notifyOptions!: {
    [key: string]: any;
  };
}
