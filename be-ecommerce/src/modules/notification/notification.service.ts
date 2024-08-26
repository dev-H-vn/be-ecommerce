import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { notificationEntity } from 'modules/notification/entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationType } from 'constant';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(notificationEntity)
    private notificationRepository: Repository<notificationEntity>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    let { notifyContent } = createNotificationDto;

    switch (createNotificationDto.notifyType) {
      case NotificationType.ORDER_FAILED:
        notifyContent =
          'Your order has failed. Please try again or contact support for assistance.';
        break;
      case NotificationType.ORDER_SUCCESS:
        notifyContent =
          'Your order has been successfully placed. Thank you for shopping with us!';
        break;
      case NotificationType.NEW_PRODUCT:
        notifyContent =
          'A new product has been added to our store. Check it out now!';
        break;
      case NotificationType.NEW_DISCOUNT:
        notifyContent =
          "A new discount is available. Don't miss out on great savings!";
        break;
      default:
        'You have a new notification.';
        break;
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      notifyContent: notifyContent,
    });
    // Save the notification to the database
    return await this.notificationRepository.save(notification);
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
