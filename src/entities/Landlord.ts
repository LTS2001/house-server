import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { House } from './House';
import { HouseCollect } from './HouseCollect';
import { HouseComment } from './HouseComment';
import { HouseLease } from './HouseLease';
import { HouseReport } from './HouseReport';
import { RentBill } from "./RentBill";

@EntityModel('landlord', { schema: 'house' })
export class Landlord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', comment: '房东名称', length: 255 })
  name: string;

  @Column('varchar', {
    name: 'address',
    nullable: true,
    comment: '现住址',
    length: 255,
  })
  address: string | null;

  @Column('varchar', { name: 'phone', comment: '房东手机', length: 255 })
  phone: string;

  @Column('varchar', {
    name: 'password',
    nullable: true,
    comment: '房东密码',
    length: 255,
  })
  password: string | null;

  @Column('varchar', {
    name: 'head_img',
    nullable: true,
    comment: '房东头像',
    length: 255,
  })
  headImg: string | null;

  @Column('varchar', {
    name: 'identity_img',
    nullable: true,
    comment: '身份证照片',
    length: 255,
  })
  identityImg: string | null;

  @Column('varchar', {
    name: 'identity_name',
    nullable: true,
    comment: '身份证名字',
    length: 255,
  })
  identityName: string | null;

  @Column('varchar', {
    name: 'identity_number',
    nullable: true,
    comment: '身份证号码',
    length: 255,
  })
  identityNumber: string | null;

  @Column('varchar', {
    name: 'identity_address',
    nullable: true,
    comment: '身份证地址',
    length: 255,
  })
  identityAddress: string | null;

  @Column('int', {
    name: 'identity_sex',
    nullable: true,
    comment: '身份证性别：0(女)，1(男)',
  })
  identitySex: number | null;

  @Column('varchar', {
    name: 'identity_nation',
    nullable: true,
    comment: '身份证民族',
    length: 255,
  })
  identityNation: string | null;

  @Column('date', {
    name: 'identity_born',
    nullable: true,
    comment: '身份证出生日期',
  })
  identityBorn: Date | null;

  @Column('int', {
    name: 'status',
    comment: '状态：-1(停用)，0(删除)，1(已实名)，2(未实名)',
    default: () => "'2'",
  })
  status: number;

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null;

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

  @OneToMany(() => House, house => house.landlord)
  houses: House[];

  @OneToMany(() => HouseCollect, houseCollect => houseCollect.landlord)
  houseCollects: HouseCollect[];

  @OneToMany(() => HouseComment, houseComment => houseComment.landlord)
  houseComments: HouseComment[];

  @OneToMany(() => HouseLease, houseLease => houseLease.landlord)
  houseLeases: HouseLease[];

  @OneToMany(() => HouseReport, houseReport => houseReport.landlord)
  houseReports: HouseReport[];

  @OneToMany(() => RentBill, (rentBill) => rentBill.landlord)
  rentBills: RentBill[];
}
