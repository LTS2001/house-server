import { Column, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { HouseAddress } from './HouseAddress';
import { Landlord } from './Landlord';
import { HouseCollect } from './HouseCollect';
import { HouseComment } from './HouseComment';
import { HouseLease } from './HouseLease';
import { HouseReport } from './HouseReport';

@Index('house_house_address_id_fk', ['addressId'], {})
@Index('house_landlord_id_fk', ['landlordId'], {})
@EntityModel('house', {schema: 'house'})
export class House {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('int', {name: 'landlord_id', comment: '房东id'})
  landlordId: number;

  @Column('int', {name: 'address_id', comment: '地址id'})
  addressId: number;

  @Column('varchar', {name: 'name', comment: '房屋名称', length: 255})
  name: string;

  @Column('int', {name: 'area', comment: '面积'})
  area: number;

  @Column('int', {name: 'price', comment: '租金'})
  price: number;

  @Column('int', {name: 'deposit_number', comment: '押金月数'})
  depositNumber: number;

  @Column('int', {name: 'price_number', comment: '每次付月数'})
  priceNumber: number;

  @Column('int', {name: 'floor', comment: '楼层'})
  floor: number;

  @Column('int', {
    name: 'toward',
    comment: '朝向：1(东)，2(西)，3(南)，4(北)',
  })
  toward: number;

  @Column('int', {
    name: 'toilet',
    comment: '卫生间：0(没有)，1(独立)，2(公用)',
  })
  toilet: number;

  @Column('int', {
    name: 'kitchen',
    comment: '厨房：0(没有)，1(独立)，2(公用)',
  })
  kitchen: number;

  @Column('int', {name: 'balcony', comment: '阳台 ：1(有)，0(没有)'})
  balcony: number;

  @Column('double', {
    name: 'water_fee',
    comment: '水费',
    precision: 3,
    scale: 2,
  })
  waterFee: number;

  @Column('double', {
    name: 'electricity_fee',
    comment: '电费',
    precision: 3,
    scale: 2,
  })
  electricityFee: number;

  @Column('int', {name: 'internet_fee', comment: '网费'})
  internetFee: number;

  @Column('int', {name: 'fuel_fee', comment: '燃气费'})
  fuelFee: number;

  @Column('varchar', {
    name: 'note',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  note: string | null;

  @Column('varchar', {name: 'house_img', comment: '房屋图片', length: 510})
  houseImg: string;

  @Column('int', {
    name: 'status',
    comment: '状态 ：-1(待租未发布)，0(删除)，1(已租)，2(待租已发布)',
    default: () => '\'-1\'',
  })
  status: number;

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
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  @ManyToOne(() => HouseAddress, (houseAddress) => houseAddress.houses, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{name: 'address_id', referencedColumnName: 'id'}])
  address: HouseAddress;

  @ManyToOne(() => Landlord, (landlord) => landlord.houses, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{name: 'landlord_id', referencedColumnName: 'id'}])
  landlord: Landlord;

  @OneToMany(() => HouseCollect, (houseCollect) => houseCollect.house)
  houseCollects: HouseCollect[];

  @OneToMany(() => HouseComment, (houseComment) => houseComment.house)
  houseComments: HouseComment[];

  @OneToMany(() => HouseLease, (houseLease) => houseLease.house)
  houseLeases: HouseLease[];

  @OneToMany(() => HouseReport, (houseReport) => houseReport.house)
  houseReports: HouseReport[];
}
