import { Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";

@EntityModel("rental_market", { schema: "house" })
export class RentalMarket {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "house_id", comment: "房子id" })
  houseId: number;

  @Column("int", { name: "user_id", comment: "房东id" })
  userId: number;

  @Column("int", { name: "hot_degree", comment: "热度", default: () => "'10'" })
  hotDegree: number;

  @Column("int", {
    name: "status",
    comment: "状态 -> 1：正常，2：下架，3：删除",
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
    comment: "最近更新时间",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"
  })
  updatedAt: Date;
}
