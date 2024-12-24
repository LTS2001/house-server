import {
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { House } from './House';
import { Landlord } from './Landlord';
import { Tenant } from './Tenant';

@Index('rent_bill_house_id_fk', ['houseId'], {})
@Index('rent_bill_landlord__fk', ['landlordId'], {})
@Index('rent_bill_tenant_id_fk', ['tenantId'], {})
@EntityModel('rent_bill', { schema: 'house' })
export class RentBill {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'landlord_id', comment: '房东id' })
  landlordId: number;

  @Column('int', { name: 'tenant_id', comment: '租客id' })
  tenantId: number;

  @Column('int', { name: 'house_id', comment: '房屋id' })
  houseId: number;

  @Column('int', {
    name: 'last_electricity_meter',
    nullable: true,
    comment: '上个月的电表记录值',
  })
  lastElectricityMeter: number | null;

  @Column('int', { name: 'electricity_meter', comment: '电表记录值' })
  electricityMeter: number;

  @Column('int', {
    name: 'last_water_meter',
    nullable: true,
    comment: '上个月的水表记录值',
  })
  lastWaterMeter: number | null;

  @Column('int', { name: 'water_meter', comment: '水表记录值' })
  waterMeter: number;

  @Column('int', {
    name: 'last_fuel_meter',
    nullable: true,
    comment: '上个月的燃气表记录值',
  })
  lastFuelMeter: number | null;

  @Column('int', { name: 'fuel_meter', comment: '燃气表记录值' })
  fuelMeter: number;

  @Column('date', { name: 'bill_date', comment: '账单年月份' })
  billDate: string;

  @Column('int', { name: 'total_price', comment: '账单总钱数' })
  totalPrice: number;

  @Column('datetime', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => House, house => house.rentBills, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'house_id', referencedColumnName: 'id' }])
  house: House;

  @ManyToOne(() => Landlord, landlord => landlord.rentBills, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'landlord_id', referencedColumnName: 'id' }])
  landlord: Landlord;

  @ManyToOne(() => Tenant, tenant => tenant.rentBills, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tenant_id', referencedColumnName: 'id' }])
  tenant: Tenant;
}
