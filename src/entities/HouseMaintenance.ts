import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';

@Index('house_maintenance_user_tenant_id_fk', ['tenantId'], {})
@Index('house_maintenance_house_info_id_fk', ['houseId'], {})
@EntityModel('house_maintenance', {schema: 'house'})
export class HouseMaintenance {
  @PrimaryGeneratedColumn({type: 'int', name: 'id', comment: 'id'})
  id: number;

  @Column('int', {name: 'tenant_id', comment: '租客id'})
  tenantId: number;

  @Column('int', {name: 'house_id', comment: '房间id'})
  houseId: number;

  @Column('varchar', {name: 'title', comment: '标题', length: 255})
  title: string;

  @Column('int', {
    name: 'status',
    comment: '状态 -> 0：未处理，1：已处理',
    default: () => '\'0\'',
  })
  status: number;

  @Column('varchar', {
    name: 'images',
    nullable: true,
    comment: '图片',
    length: 5100,
  })
  images: string | null;

  @Column('varchar', {
    name: 'video',
    nullable: true,
    comment: '视频',
    length: 255,
  })
  video: string | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '创建日期',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '更新日期',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;
}
