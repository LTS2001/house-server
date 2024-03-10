import {
  Column,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityModel } from "@midwayjs/orm";
import { Landlord } from "./Landlord";
import { Tenant } from "./Tenant";

@Index("complaint_landlord_id_fk", ["landlordId"], {})
@Index("complaint_tenant_id_fk", ["tenantId"], {})
@EntityModel("complaint", { schema: "house" })
export class Complaint {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "landlord_id", nullable: true, comment: "房东id" })
  landlordId: number | null;

  @Column("int", { name: "tenant_id", comment: "租客id" })
  tenantId: number;

  @ManyToOne(() => Landlord, (landlord) => landlord.complaints, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "landlord_id", referencedColumnName: "id" }])
  landlord: Landlord;

  @ManyToOne(() => Tenant, (tenant) => tenant.complaints, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tenant_id", referencedColumnName: "id" }])
  tenant: Tenant;
}
