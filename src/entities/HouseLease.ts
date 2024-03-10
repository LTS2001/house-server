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

@Index("house_lease_house_id_fk", ["houseId"], {})
@Index("house_lease_landlord_id_fk", ["landlordId"], {})
@Index("house_lease_tenant_id_fk", ["tenantId"], {})
@EntityModel("house_lease", { schema: "house" })
export class HouseLease {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "house_id", comment: "房屋id" })
  houseId: number;

  @Column("int", { name: "landlord_id", comment: "房东id" })
  landlordId: number;

  @Column("int", { name: "tenant_id", comment: "租客id" })
  tenantId: number;

  @Column("int", {
    name: "status",
    comment: "状态：-1(未处理)，0(已驳回)，1(已通过->已租赁)，2(已退租)",
    default: () => "'-1'",
  })
  status: number;

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

  @ManyToOne(() => House, (house) => house.houseLeases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house: House;

  @ManyToOne(() => Landlord, (landlord) => landlord.houseLeases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "landlord_id", referencedColumnName: "id" }])
  landlord: Landlord;

  @ManyToOne(() => Tenant, (tenant) => tenant.houseLeases, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tenant_id", referencedColumnName: "id" }])
  tenant: Tenant;
}
