import {
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { HouseInfo } from './HouseInfo';
import { UserTenant } from './UserTenant';

@Index('link_lease_application_house_info_id_fk', ['houseId'], {})
@Index('link_lease_application_user_tenant_id_fk', ['tenantId'], {})
@EntityModel('link_lease_application', {schema: 'house'})
export class LinkLease {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('int', {
    name: 'status',
    comment: '状态：-1（未处理），0（已驳回），1（已通过）',
    default: () => '-1',
  })
  status: number;

  @Column('int', {name: 'house_id', comment: '房屋id'})
  houseId: number;

  @Column('int', {name: 'tenant_id', nullable: true, comment: '租客id'})
  tenantId: number | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '最近更新时间',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date | null;

  @ManyToOne(
    () => HouseInfo,
    (house_info) => house_info.id,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{name: 'house_id', referencedColumnName: 'id'}])
  house_: HouseInfo;

  @ManyToOne(
    () => UserTenant,
    (user_tenant) => user_tenant.id,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{name: 'tenant_id', referencedColumnName: 'id'}])
  tenant_: UserTenant;
}
