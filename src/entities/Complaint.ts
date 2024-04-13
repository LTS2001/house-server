import { Column, PrimaryGeneratedColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";

@EntityModel("complaint", { schema: "house" })
export class Complaint {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "complaint_id", comment: "投诉人id" })
  complaintId: number;

  @Column("int", {
    name: "identity",
    nullable: true,
    comment: "投诉人身份：1(租客)，2(房东)",
  })
  identity: number | null;

  @Column("varchar", { name: "reason", comment: "投诉原因", length: 255 })
  reason: string;

  @Column("varchar", { name: "image", comment: "投诉图片地址", length: 255 })
  image: string;

  @Column("varchar", { name: "video", comment: "投诉视频地址", length: 255 })
  video: string;

  @Column("int", {
    name: "status",
    comment: "状态：-1(未处理)，0(删除)，1(已处理)",
    default: () => "'-1'",
  })
  status: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
