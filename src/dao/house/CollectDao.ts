import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { HouseCollect } from '@/entities/HouseCollect';
import { InjectEntityModel } from '@midwayjs/orm';

@Provide()
export class CollectDao {
  @InjectEntityModel(HouseCollect)
  private houseCollectModel: Repository<HouseCollect>;

  /**
   * 添加收藏记录
   * @param collectObj 收藏信息
   */
  async addCollect(collectObj: HouseCollect) {
    const collect = new HouseCollect();
    Object.keys(collectObj).forEach(key => {
      collect[key] = collectObj[key];
    });
    return await this.houseCollectModel.save(collect);
  }

  /**
   * 获取收藏
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async getCollect(houseId: number, tenantId: number) {
    return await this.houseCollectModel.findOne({
      where: {houseId, tenantId}
    });
  }

  /**
   * 更新收藏状态
   * @param id 收藏表id
   * @param status 收藏状态
   */
  async updateCollectById(id: number, status: number) {
    const collect = await this.houseCollectModel.findOne({
      where: {id}
    });
    collect.status = status;
    return await this.houseCollectModel.save(collect);
  }

  /**
   * 获取房屋收藏总数
   * @param houseId 房屋id
   */
  async getCollectHouseNum(houseId: number) {
    return await this.houseCollectModel
      .createQueryBuilder('c')
      .select(['count(*)'])
      .where('c.house_id = :id', {id: houseId})
      .andWhere('c.status = 1')
      .getRawOne();
  }

  /**
   * 通过租客id获取收藏记录
   * @param tenantId
   */
  async getCollectHouseByTenantId(tenantId: number) {
    return await this.houseCollectModel.find({
      where: {tenantId}
    });
  }
}