import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { Complaint } from './Complaint';
import { House } from './House';
import { HouseCollect } from './HouseCollect';
import { HouseComment } from './HouseComment';
import { HouseLease } from './HouseLease';
import { HouseReport } from './HouseReport';

@EntityModel('landlord', {schema: 'house'})
export class Landlord {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('varchar', {name: 'name', comment: '房东名称', length: 255})
  name: string;

  @Column('varchar', {name: 'phone', comment: '房东手机', length: 255})
  phone: string;

  @Column("varchar", {
    name: "password",
    nullable: true,
    comment: "房东密码",
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

  @Column('int', {
    name: 'status',
    comment: '状态->1：正常，2：停用，3：删除',
    default: () => '\'1\'',
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

  @OneToMany(() => Complaint, (complaint) => complaint.landlord)
  complaints: Complaint[];

  @OneToMany(() => House, (house) => house.landlord)
  houses: House[];

  @OneToMany(() => HouseCollect, (houseCollect) => houseCollect.landlord)
  houseCollects: HouseCollect[];

  @OneToMany(() => HouseComment, (houseComment) => houseComment.landlord)
  houseComments: HouseComment[];

  @OneToMany(() => HouseLease, (houseLease) => houseLease.landlord)
  houseLeases: HouseLease[];

  @OneToMany(() => HouseReport, (houseReport) => houseReport.landlord)
  houseReports: HouseReport[];
}
