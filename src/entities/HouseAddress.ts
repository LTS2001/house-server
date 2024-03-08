import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';

@EntityModel('house_address', {schema: 'house'})
export class HouseAddress {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('varchar', {
    name: 'province_name',
    nullable: true,
    comment: '省名称',
    length: 255,
  })
  provinceName: string | null;

  @Column('varchar', {
    name: 'city_name',
    nullable: true,
    comment: '市名称',
    length: 255,
  })
  cityName: string | null;

  @Column('varchar', {
    name: 'area_name',
    nullable: true,
    comment: '区名称',
    length: 255,
  })
  areaName: string | null;

  @Column('varchar', {
    name: 'address_name',
    nullable: true,
    comment: '地址名称',
    length: 255,
  })
  addressName: string | null;

  @Column('varchar', {
    name: 'address_info',
    nullable: true,
    comment: '详细地址',
    length: 255,
  })
  addressInfo: string | null;

  @Column('double', {
    name: 'longitude',
    nullable: true,
    comment: '经度',
    precision: 20,
    scale: 8,
  })
  longitude: number | null;

  @Column('double', {
    name: 'latitude',
    nullable: true,
    comment: '纬度',
    precision: 20,
    scale: 8,
  })
  latitude: number | null;

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
