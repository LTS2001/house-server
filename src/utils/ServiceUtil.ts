import { House } from '@/entities/House';
import { HouseAddress } from '@/entities/HouseAddress';
import { HouseLease } from '@/entities/HouseLease';
import { Tenant } from '@/entities/Tenant';

interface LeaseMsg {
  house: House;
  address: HouseAddress;
  tenant: Tenant;
  lease: HouseLease;
  landlordId: number;
}
export class Lease {
  /**
   * 格式化租赁信息
   * @param param0
   * @returns
   */
  static formatLeaseMsg({
    house,
    address,
    tenant,
    lease,
    landlordId,
  }: LeaseMsg) {
    return {
      houseId: house.id,
      houseName: house.name,
      houseAddress:
        address.provinceName +
        address.cityName +
        address.areaName +
        address.addressInfo,
      tenantId: tenant.id,
      tenantHeadImg: tenant.headImg,
      tenantName: tenant.name,
      tenantPhone: tenant.phone,
      landlordId,
      leaseDate: lease.updatedAt,
      leaseMonths: lease.leaseMonths,
    };
  }
}
