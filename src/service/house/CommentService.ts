import { Inject, Provide } from '@midwayjs/core';
import { AddCommentReq } from '@/dto/house/CommentDto';
import { CommentDao } from '@/dao/house/CommentDao';
import { HouseComment } from '@/entities/HouseComment';

@Provide()
export class CommentService {
  @Inject()
  private commentDao: CommentDao;

  /**
   * 添加评论
   * @param addComment
   */
  async addComment(addComment: AddCommentReq) {
    const houseComment = new HouseComment();
    Object.keys(addComment).forEach(key => {
      houseComment[key] = addComment[key];
    });
    return await this.commentDao.addComment(houseComment);
  }

  /**
   * 根据houseId和tenantId获取评论
   * @param houseId
   * @param tenantId
   */
  async getCommentByHouseAndTenantId(houseId: number, tenantId: number) {
    return await this.commentDao.getCommentByHouseAndTenantId(houseId, tenantId);
  }

  async getCommentByTenantId(tenantId: number) {
    return await this.commentDao.getCommentByTenantId(tenantId);
  }

  async getCommentByHouseId(houseId: number) {
    return await this.commentDao.getCommentByHouseId(houseId);
  }
}