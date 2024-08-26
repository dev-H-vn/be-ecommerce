import { NotificationType } from 'constant';
import { BooleanField, EnumField, StringField, UUIDField } from 'decorators';

export class CreateNotificationDto {
  @EnumField(() => NotificationType, { default: NotificationType.NEW_PRODUCT })
  notifyType!: NotificationType;

  @UUIDField()
  notifySenderId!: Uuid;

  @UUIDField()
  notifyReceivedId!: Uuid;

  @StringField()
  notifyContent?: string;

  @BooleanField()
  notifyOptions?: Record<string, any>;
}
