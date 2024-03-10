import { Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";

@EntityModel("admin", { schema: "house" })
export class Admin {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", comment: "管理员名字", length: 255 })
  name: string;

  @Column("varchar", { name: "phone", comment: "管理员手机号", length: 255 })
  phone: string;

  @Column("varchar", { name: "password", comment: "密码", length: 255 })
  password: string;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "状态：-1(停用)，0(删除)，1(正常)",
    default: () => "'1'",
  })
  status: number | null;

  @Column("varchar", { name: "head_img", comment: "头像", length: 255 })
  headImg: string;

  @Column("int", {
    name: "role",
    comment: "角色：0(管理员)，1(超级管理员)",
    default: () => "'0'",
  })
  role: number;

  @Column("varchar", {
    name: "remark",
    nullable: true,
    comment: "备注",
    length: 255,
  })
  remark: string | null;

  @Column("datetime", {
    name: "created_at",
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    comment: "更新时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
