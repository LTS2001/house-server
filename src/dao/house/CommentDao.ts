import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';
import { HouseComment } from '@/entities/HouseComment';

@Provide()
export class CommentDao {
  @InjectEntityModel(HouseComment)
  private commentModel: Repository<HouseComment>;

  async addComment(houseComment: HouseComment) {
    const comment = new HouseComment();
    Object.keys(houseComment).forEach(key => {
      comment[key] = houseComment[key];
    });
    return await this.commentModel.save(comment);
  }

  /**
   * 根据houseId和tenantId获取评论
   * @param houseId
   * @param tenantId
   */
  async getCommentByHouseAndTenantId(houseId: number, tenantId: number) {
    return await this.commentModel.findOne({
      where: {houseId, tenantId}
    });
  }

  async getCommentByTenantId(tenantId: number) {
    return await this.commentModel.find({
      where: {
        tenantId
      }
    });
  }

  async getCommentByHouseId(houseId: number) {
    return await this.commentModel.find({
      where: {houseId},
      order: {
        updatedAt: 'desc'
      }
    });
  }
}