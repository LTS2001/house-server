import { Inject, Provide } from '@midwayjs/core';
import { CollectDao } from '@/dao/link/CollectDao';
import { AddCollectReq, GetCollectReq } from '@/dto/LinkCollect';

@Provide()
export default class CollectService {
  @Inject()
  private collectDao: CollectDao;

  /**
   * 收藏/取消收藏
   * @param collect
   */
  async addCollect(collect: AddCollectReq) {
    const {houseId, tenantId, status} = collect;
    // 查找之前是否有收藏记录
    const linkCollect = await this.collectDao.getCollectStatus(houseId, tenantId);
    if (linkCollect?.id) { // 进行更新操作
      return await this.collectDao.updateCollectById(linkCollect.id, status);
    } else { // 进行插入操作
      return await this.collectDao.addCollect(houseId, tenantId, status);
    }
  }

  /**
   * 获取收藏状态
   * @param collect
   */
  async getCollectStatus(collect: GetCollectReq) {
    const {houseId, tenantId} = collect;
    return await this.collectDao.getCollectStatus(houseId, tenantId);
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
          houseId: res['house_id'],
          count: res['count(*)']
        });
      });
    });
    return Promise.all(promises);
  }
}