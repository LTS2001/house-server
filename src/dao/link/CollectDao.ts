import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { LinkCollect } from '@/entities/LinkCollect';
import { InjectEntityModel } from '@midwayjs/orm';

@Provide()
export class CollectDao {
  @InjectEntityModel(LinkCollect)
  private linkCollectModel: Repository<LinkCollect>;

  /**
   * 收藏/取消收藏
   * @param houseId 房屋id
   * @param tenantId 租客id
   * @param status 状态
   */
  async addCollect(houseId: number, tenantId: number, status: number) {
    const collect = new LinkCollect();
    collect.houseId = houseId;
    collect.tenantId = tenantId;
    collect.status = status;
    return await this.linkCollectModel.save(collect);
  }

  /**
   * 获取收藏状态
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async getCollectStatus(houseId: number, tenantId: number) {
    return await this.linkCollectModel.findOne({
      where: {houseId, tenantId}
    });
  }

  /**
   * 更新收藏状态
   * @param id 收藏表id
   * @param status 收藏状态
   */
  async updateCollectById(id: number, status: number) {
    const collect = await this.linkCollectModel.findOne({
      where: {id}
    });
    collect.status = status;
    return await this.linkCollectModel.save(collect);
  }

  /**
   * 获取房屋收藏总数
   * @param houseId 房屋id
   */
  async getCollectHouseNum(houseId: number) {
    return await this.linkCollectModel
      .createQueryBuilder('c')
      .select(['c.house_id', 'count(*)'])
      .where('c.house_id = :id', {id: houseId})
      .getRawOne();
  }
}