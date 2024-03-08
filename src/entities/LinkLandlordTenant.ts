import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';

@Index('link_landlord_tenant_user_landlord_id_fk', ['landlordId'], {})
@Index('link_landlord_tenant_user_tenant_id_fk', ['tenantId'], {})
@EntityModel('link_landlord_tenant', {schema: 'house'})
export class LinkLandlordTenant {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('int', {
    name: 'status',
    comment: '状态 -> 0：取消关联，1：正常关联',
    default: () => '\'1\'',
  })
  status: number;

  @Column('int', {name: 'landlord_id', comment: '房东id'})
  landlordId: number;

  @Column('int', {name: 'tenant_id', comment: '租客id'})
  tenantId: number;

  @Column('datetime', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    comment: '最近更新时间',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
