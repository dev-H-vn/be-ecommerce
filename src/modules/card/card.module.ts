import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsEntity } from 'modules/card/entities/card.entity';
import { ProductEntity } from 'modules/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardsEntity, ProductEntity])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
