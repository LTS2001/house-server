import { Provide } from '@midwayjs/core';
import { Like, Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';
import { HouseComment } from '@/entities/HouseComment';
import { GetCommentAdminReq } from '@/dto/user/AdminDto';

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

  async getCommentByAdmin(getCommentReq: GetCommentAdminReq) {
    const {current, pageSize} = getCommentReq;
    const obj: any = {};
    const equalArr = ['id', 'houseId', 'landlordId', 'tenantId', 'status', 'houseScore', 'landlordScore'];
    const likeArr = ['comment'];
    Object.keys(getCommentReq).forEach(key => {
      if (equalArr.find(e => e === key)) {
        obj[key] = getCommentReq[key];
      }
      if (likeArr.find(l => l === key)) {
        obj[key] = Like(`%${ getCommentReq[key] }%`);
      }
    });
    const commentList = await this.commentModel.find({
      where: obj,
      order: {id: 'desc'},
      skip: (current - 1) * pageSize,
      take: pageSize
    });
    const total = await this.commentModel.count({
      where: obj
    });
    return {
      commentList,
      total
    };
  }

  async updateCommentStatus(id: number, status: number) {
    const comment = await this.commentModel.findOne({
      where: {id}
    });
    comment.status = status;
    return await this.commentModel.save(comment);
  }
}