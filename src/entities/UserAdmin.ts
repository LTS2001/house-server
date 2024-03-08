import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';

@EntityModel('user_admin', {schema: 'house'})
export class UserAdmin {
  @PrimaryGeneratedColumn({type: 'int', name: 'id', comment: 'id'})
  id: number;

  @Column('varchar', {name: 'name', comment: '用户名称', length: 255})
  name: string;

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null;

  @Column('varchar', {name: 'phone', comment: '手机号', length: 255})
  phone: string;

  @Column('varchar', {name: 'password', comment: '密码', length: 255})
  password: string;

  @Column('int', {
    name: 'status',
    comment: '状态->1：正常，2：停用，3：删除',
    default: () => '\'1\'',
  })
  status: number;

  @Column('varchar', {
    name: 'head_img',
    nullable: true,
    comment: '头像',
    length: 510,
  })
  headImg: string | null;

  @Column('datetime', {
    name: 'created_at',
    comment: '创建日期',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    comment: '最近更新日期',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('varchar', {
    name: 'role',
    comment: '角色',
    length: 255,
    default: () => '\'admin\'',
  })
  role: string;
}
