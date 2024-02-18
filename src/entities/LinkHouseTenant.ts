import { Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";

@EntityModel("link_house_tenant", { schema: "house" })
export class LinkHouseTenant {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "status",
    comment: "状态->0：取消关联，1：正常关联",
    default: () => "'1'",
  })
  status: number;

  @Column("int", { name: "house_id", comment: "房子id" })
  houseId: number;

  @Column("int", { name: "tenant_id", comment: "租客id" })
  tenantId: number;

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
