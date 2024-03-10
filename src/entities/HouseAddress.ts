import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";
import { House } from "./House";

@EntityModel("house_address", { schema: "house" })
export class HouseAddress {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "province_name", comment: "省名称", length: 255 })
  provinceName: string;

  @Column("varchar", { name: "city_name", comment: "市名称", length: 255 })
  cityName: string;

  @Column("varchar", { name: "area_name", comment: "区/县名称", length: 255 })
  areaName: string;

  @Column("varchar", { name: "address_name", comment: "地址名称", length: 255 })
  addressName: string;

  @Column("varchar", { name: "address_info", comment: "详细地址", length: 255 })
  addressInfo: string;

  @Column("double", {
    name: "latitude",
    comment: "纬度",
    precision: 20,
    scale: 8,
  })
  latitude: number;

  @Column("double", {
    name: "longitude",
    comment: "经度",
    precision: 20,
    scale: 8,
  })
  longitude: number;

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

  @OneToMany(() => House, (house) => house.address)
  houses: House[];
}
