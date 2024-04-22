import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { HouseCollect } from './HouseCollect';
import { HouseComment } from './HouseComment';
import { HouseLease } from './HouseLease';
import { HouseReport } from './HouseReport';

@EntityModel('tenant', {schema: 'house'})
export class Tenant {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('varchar', {name: 'name', comment: '租客名称', length: 255})
  name: string;

  @Column('varchar', {name: 'phone', comment: '租客手机', length: 255})
  phone: string;

  @Column('varchar', {
    name: 'password',
    nullable: true,
    comment: '租客密码',
    length: 255,
  })
  password: string | null;

  @Column('varchar', {
    name: 'head_img',
    nullable: true,
    comment: '租客头像',
    length: 255,
  })
  headImg: string | null;

  @Column('int', {
    name: 'status',
    comment: '状态：-1(停用)，0(删除)，1(正常)',
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

  @OneToMany(() => HouseCollect, (houseCollect) => houseCollect.tenant)
  houseCollects: HouseCollect[];

  @OneToMany(() => HouseComment, (houseComment) => houseComment.tenant)
  houseComments: HouseComment[];

  @OneToMany(() => HouseLease, (houseLease) => houseLease.tenant)
  houseLeases: HouseLease[];

  @OneToMany(() => HouseReport, (houseReport) => houseReport.tenant)
  houseReports: HouseReport[];
}
