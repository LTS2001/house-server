import { Inject, Provide } from '@midwayjs/core';
import { AddCommentReq } from '@/dto/house/CommentDto';
import { CommentDao } from '@/dao/house/CommentDao';
import { HouseComment } from '@/entities/HouseComment';
import { GetCommentAdminReq } from '@/dto/user/AdminDto';
import { HouseDao } from '@/dao/house/HouseDao';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { TenantDao } from '@/dao/user/TenantDao';

@Provide()
export class CommentService {
  @Inject()
  private commentDao: CommentDao;

  @Inject()
  private houseDao: HouseDao;

  @Inject()
  private landlordDao: LandlordDao;

  @Inject()
  private tenantDao: TenantDao;

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

  async getCommentByAdmin(getCommentReq: GetCommentAdminReq) {
    const commentList = await this.commentDao.getCommentByAdmin(getCommentReq);
    // 获取房东信息
    const landlordList = await this.landlordDao.getLandlordByIds(commentList?.map(r => r.landlordId));
    // 获取房屋信息
    const houseList = await this.houseDao.getHouseByHouseIds(commentList?.map(r => r.houseId));
    // 获取租客信息
    const tenantList = await this.tenantDao.getTenantByIds(commentList?.map(r => r.tenantId));
    return commentList?.map((comment, idx) => {
      const landlord = landlordList.find(l => l.id === comment.landlordId);
      const tenant = tenantList.find(t => t.id === comment.tenantId);
      return {
        ...comment,
        landlordName: landlord?.name,
        landlordPhone: landlord?.phone,
        houseName: houseList.find(h => h.id === comment.houseId)?.name,
        tenantName: tenant?.name,
        tenantPhone: tenant?.phone
      };
    });
  }

  async updateCommentStatus(id: number, status: number) {
    return await this.commentDao.updateCommentStatus(id, status);
  }
}