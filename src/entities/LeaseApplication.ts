import { Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";

@EntityModel("lease_application", { schema: "house" })
export class LeaseApplication {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "status",
    comment: "状态->0：未处理，1：已通过，2已驳回",
    default: () => "'0'",
  })
  status: number;

  @Column("int", { name: "house_id", comment: "房屋id" })
  houseId: number;

  @Column("int", { name: "tenant_id", nullable: true, comment: "租客id" })
  tenantId: number | null;

  @Column("int", { name: "landlord_id", nullable: true, comment: "房东id" })
  landlordId: number | null;

  @Column("int", {
    name: "rental_market_id",
    nullable: true,
    comment: "房市id",
  })
  rentalMarketId: number | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    comment: "最近更新时间",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"
  })
  updatedAt: Date | null;
}
