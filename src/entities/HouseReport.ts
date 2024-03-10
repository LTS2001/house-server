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

@Index("house_report_house_id_fk", ["houseId"], {})
@Index("house_report_landlord_id_fk", ["landlordId"], {})
@Index("house_report_tenant_id_fk", ["tenantId"], {})
@EntityModel("house_report", { schema: "house" })
export class HouseReport {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "house_id", comment: "房屋id" })
  houseId: number;

  @Column("int", { name: "landlord_id", comment: "房东id" })
  landlordId: number;

  @Column("int", { name: "tenant_id", comment: "租客id" })
  tenantId: number;

  @Column("varchar", { name: "reason", comment: "报修原因", length: 255 })
  reason: string;

  @Column("varchar", { name: "image", comment: "图片", length: 255 })
  image: string;

  @Column("varchar", { name: "video", comment: "视频", length: 255 })
  video: string;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "状态：0(未处理)，1(已处理)",
    default: () => "'0'",
  })
  status: number | null;

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

  @ManyToOne(() => House, (house) => house.houseReports, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house: House;

  @ManyToOne(() => Landlord, (landlord) => landlord.houseReports, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "landlord_id", referencedColumnName: "id" }])
  landlord: Landlord;

  @ManyToOne(() => Tenant, (tenant) => tenant.houseReports, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tenant_id", referencedColumnName: "id" }])
  tenant: Tenant;
}
