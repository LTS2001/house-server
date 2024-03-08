import {
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { UserTenant } from './UserTenant';
import { UserLandlord } from './UserLandlord';
import { HouseInfo } from './HouseInfo';

@Index('tenant_id_foreign_key', ['tenantId'], {})
@Index('landlord_id_foreign_key', ['landlordId'], {})
@Index('house_id_foreign_key', ['houseId'], {})
@EntityModel('comment', {schema: 'house'})
export class Comment {
  @PrimaryGeneratedColumn({type: 'int', name: 'id', comment: 'id'})
  id: number;

  @Column('int', {name: 'landlord_id', comment: '房东id'})
  landlordId: number;

  @Column('int', {name: 'tenant_id', comment: '租客id'})
  tenantId: number;

  @Column('int', {name: 'house_id', comment: '房间id'})
  houseId: number;

  @Column('int', {name: 'house_score', comment: '房间评分'})
  houseScore: number;

  @Column('int', {name: 'landlord_score', comment: '房东评分'})
  landlordScore: number;

  @Column('varchar', {
    name: 'house_comment',
    comment: '房间评价',
    length: 255,
  })
  houseComment: string;

  @Column('varchar', {
    name: 'landlord_comment',
    comment: '房东评价',
    length: 255,
  })
  landlordComment: string;

  @Column('varchar', {
    name: 'house_comment_img',
    nullable: true,
    comment: '房间评价图片',
    length: 5100,
  })
  houseCommentImg: string | null;

  @Column('varchar', {
    name: 'landlord_comment_img',
    nullable: true,
    comment: '房东评价图片',
    length: 5100,
  })
  landlordCommentImg: string | null;

  @Column('int', {
    name: 'status',
    comment: '状态 -> 1：正常，2：停用，3：删除',
    default: () => '\'1\'',
  })
  status: number;

  @Column('datetime', {
    name: 'created_at',
    comment: '创建日期',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    comment: '最近更新日期',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UserTenant, (user_tenant) => user_tenant.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{name: 'tenant_id', referencedColumnName: 'id'}])
  tenant_: UserTenant;

  @ManyToOne(() => UserLandlord, (user_landlord) => user_landlord.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{name: 'landlord_id', referencedColumnName: 'id'}])
  landlord_: UserLandlord;

  @ManyToOne(() => HouseInfo, (house_info) => house_info.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{name: 'house_id', referencedColumnName: 'id'}])
  house_: HouseInfo;
}
