import {
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityModel } from "@midwayjs/orm";
import { House } from "./House";
import { Landlord } from "./Landlord";
import { Tenant } from "./Tenant";

@Index("house_comment_house_id_fk", ["houseId"], {})
@Index("house_comment_landlord_id_fk", ["landlordId"], {})
@Index("house_comment_tenant_id_fk", ["tenantId"], {})
@EntityModel("house_comment", { schema: "house" })
export class HouseComment {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "house_id", comment: "房屋id" })
  houseId: number;

  @Column("int", { name: "landlord_id", comment: "房东id" })
  landlordId: number;

  @Column("int", { name: "tenant_id", comment: "租客id" })
  tenantId: number;

  @Column("int", { name: "house_score", comment: "房屋评分" })
  houseScore: number;

  @Column("int", { name: "landlord_score", comment: "房东评分" })
  landlordScore: number;

  @Column("varchar", {
    name: "comment",
    nullable: true,
    comment: "文字评价",
    length: 255,
  })
  comment: string | null;

  @Column("varchar", {
    name: "image",
    nullable: true,
    comment: "图片",
    length: 255,
  })
  image: string | null;

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

  @ManyToOne(() => House, (house) => house.houseComments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house: House;

  @ManyToOne(() => Landlord, (landlord) => landlord.houseComments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "landlord_id", referencedColumnName: "id" }])
  landlord: Landlord;

  @ManyToOne(() => Tenant, (tenant) => tenant.houseComments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tenant_id", referencedColumnName: "id" }])
  tenant: Tenant;
}
