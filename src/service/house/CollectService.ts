import { Inject, Provide } from '@midwayjs/core';
import { CollectDao } from '@/dao/house/CollectDao';
import { ChangeCollectReq, GetCollectReq } from '@/dto/house/CollectDto';
import { HouseCollect } from '@/entities/HouseCollect';
import { HouseService } from '@/service/house/HouseService';

@Provide()
export class CollectService {
  @Inject()
  private collectDao: CollectDao;
  @Inject()
  private houseService: HouseService;

  /**
   * 更改收藏状态（收藏/取消收藏）
   * @param collect 收藏信息
   */
  async changeCollectStatus(collect: ChangeCollectReq) {
    const {houseId, tenantId, status, landlordId} = collect;
    // 查找之前是否有收藏记录
    const linkCollect = await this.collectDao.getCollect(houseId, tenantId);
    if (linkCollect?.id) { // 进行更新操作
      return await this.collectDao.updateCollectById(linkCollect.id, Number(status));
    } else { // 进行插入操作
      const collect = new HouseCollect();
      collect.houseId = houseId;
      collect.landlordId = landlordId;
      collect.tenantId = tenantId;
      collect.status = status;
      return await this.collectDao.addCollect(collect);
    }
  }

  /**
   * 获取收藏状态
   * @param collect
   */
  async getCollectStatus(collect: GetCollectReq) {
    const {houseId, tenantId} = collect;
    return await this.collectDao.getCollect(houseId, tenantId);
  }

  /**
   * 获取房屋收藏总数
   * @param houseIds 房屋id列表
   */
  async getCollectHouseNum(houseIds: number[]) {
    const promises = houseIds.map(async (houseId: number) => {
      return new Promise(async (resolve) => {
        const res = await this.collectDao.getCollectHouseNum(houseId);
        resolve({
          houseId,
          count: Number(res['count(*)'])
        });
      });
    });
    return Promise.all(promises);
  }

  /**
   * 获取租客的收藏房屋
   * @param tenantId
   */
  async getCollectHouseByTenantId(tenantId: number) {
    const collectList = await this.collectDao.getCollectHouseByTenantId(tenantId);
    const twoIdList = collectList.map(c => {
      const {houseId, landlordId} = c;
      return {
        houseId,
        landlordId,
      };
    });
    const houseInfoList = await this.houseService.getHouseByTwoIdList(twoIdList);
    return twoIdList.map(t => {
      const houseInfo = houseInfoList.find(h => h.landlordId === t.landlordId && h.houseId === t.houseId);
      const collect = collectList.find(c => c.landlordId === t.landlordId && c.houseId === t.houseId);
      const collectId = collect.id;
      delete collect.id;
      return {
        ...houseInfo, ...collect, collectId
      };
    });
  }
}