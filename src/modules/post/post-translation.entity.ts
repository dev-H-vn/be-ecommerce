import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UseDto } from '../../decorators';
import { PostTranslationDto } from './dtos/post-translation.dto';
import { PostEntity } from './post.entity';

@Entity({ name: 'post_translations' })
@UseDto(PostTranslationDto)
export class PostTranslationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'uuid' })
  postId!: Uuid;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.translations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post?: PostEntity;
}
