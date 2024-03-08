import {
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityModel } from "@midwayjs/orm";
import { HouseInfo } from "./HouseInfo";
import { UserTenant } from "./UserTenant";

@Index("link_collect_house_info_id_fk", ["houseId"], {})
@Index("link_collect_user_tenant_id_fk", ["tenantId"], {})
@EntityModel("link_collect", { schema: "house" })
export class LinkCollect {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "house_id", comment: "房子id" })
  houseId: number;

  @Column("int", { name: "tenant_id", comment: "租客id" })
  tenantId: number;

  @Column("int", {
    name: "status",
    comment: "状态：1（收藏），0（未收藏）",
    default: () => "'1'",
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

  @ManyToOne(() => HouseInfo, (house_info) => house_info.id, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house_: HouseInfo;

  @ManyToOne(() => UserTenant, (user_tenant) => user_tenant.id, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tenant_id", referencedColumnName: "id" }])
  tenant_: UserTenant;
}
