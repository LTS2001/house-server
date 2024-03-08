import { Column, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { Comment } from './Comment';

@Index('house_info_house_address_id_fk', ['addressId'], {})
@EntityModel('house_info', {schema: 'house'})
export class HouseInfo {
  @PrimaryGeneratedColumn({type: 'int', name: 'id', comment: '房子id'})
  id: number;

  @Column('varchar', {name: 'name', comment: '房子名称', length: 255})
  name: string;

  @Column('int', {name: 'landlord_id', comment: '房东id'})
  landlordId: number;

  @Column('int', {name: 'parent_id', nullable: true, comment: '上级房间id'})
  parentId: number | null;

  @Column('int', {name: 'address_id', comment: '地址id'})
  addressId: number;

  @Column('double', {name: 'price', comment: '租金', precision: 10, scale: 2})
  price: number;

  @Column('int', {
    name: 'deposit_number',
    nullable: true,
    comment: '押金月数',
  })
  depositNumber: number | null;

  @Column('int', {
    name: 'price_number',
    nullable: true,
    comment: '每次付月数',
  })
  priceNumber: number | null;

  @Column('int', {name: 'floor', comment: '楼层'})
  floor: number;

  @Column('int', {
    name: 'toward',
    nullable: true,
    comment: '朝向 -> 1：东，2：西，3：南，4：北',
  })
  toward: number | null;

  @Column('int', {
    name: 'toilet',
    nullable: true,
    comment: '卫生间 -> 0：没有，1：独立，2：公用',
  })
  toilet: number | null;

  @Column('int', {
    name: 'kitchen',
    nullable: true,
    comment: '厨房 -> 0：没有，1：独立，2：公用',
  })
  kitchen: number | null;

  @Column('int', {
    name: 'balcony',
    nullable: true,
    comment: '阳台 -> 1：有，0：没有',
  })
  balcony: number | null;

  @Column('double', {
    name: 'water_fee',
    nullable: true,
    comment: '水费',
    precision: 10,
    scale: 2,
  })
  waterFee: number | null;

  @Column('double', {
    name: 'electricity_fee',
    nullable: true,
    comment: '电费',
    precision: 10,
    scale: 2,
  })
  electricityFee: number | null;

  @Column('double', {
    name: 'internet_fee',
    nullable: true,
    comment: '网费',
    precision: 10,
    scale: 2,
  })
  internetFee: number | null;

  @Column('double', {
    name: 'fuel_fee',
    nullable: true,
    comment: '燃气费',
    precision: 10,
    scale: 2,
  })
  fuelFee: number | null;

  @Column('varchar', {
    name: 'note',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  note: string | null;

  @Column('varchar', {
    name: 'head_img',
    nullable: true,
    comment: '图片',
    length: 5100,
  })
  headImg: string | null;

  @Column('int', {
    name: 'status',
    nullable: true,
    comment: '状态 ->1：待租，2：已租，3：删除',
    default: () => '\'1\'',
  })
  status: number | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '最近更新时间',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column('int', {name: 'area', comment: '面积'})
  area: number;

  @OneToMany(() => Comment, (comment) => comment.house_)
  comments: Comment[];
}
