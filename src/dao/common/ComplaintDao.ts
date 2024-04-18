import { Provide } from '@midwayjs/core';
import { Complaint } from '@/entities/Complaint';
import { InjectEntityModel } from '@midwayjs/orm';
import { Like, Repository } from 'typeorm';
import { GetComplaintAdminReq } from '@/dto/user/AdminDto';

@Provide()
export class ComplaintDao {
  @InjectEntityModel(Complaint)
  private complaintModel: Repository<Complaint>;

  async addComplaint(complaintObj: Complaint) {
    const complaint = new Complaint();
    Object.keys(complaintObj).forEach(key => {
      complaint[key] = complaintObj[key];
    });
    return await this.complaintModel.save(complaint);
  }

  async getComplaint(complaintId: number, identity: number) {
    return await this.complaintModel.find({
      where: {complaintId, identity},
      order: {createdAt: 'desc'}
    });
  }

  async getComplaintByAdmin(getComplainReq: GetComplaintAdminReq) {
    const {current, pageSize} = getComplainReq;
    const obj: any = {};
    const equalArr = ['id', 'complaintId', 'identity', 'status'];
    const likeArr = ['reason'];
    Object.keys(getComplainReq).forEach(key => {
      if (equalArr.find(e => e === key)) {
        obj[key] = getComplainReq[key];
      }
      if (likeArr.find(l => l === key)) {
        obj[key] = Like(`%${ getComplainReq[key] }%`);
      }
    });
    const complaintList = await this.complaintModel.find({
      where: obj,
      order: {id: 'desc'},
      skip: (current - 1) * pageSize,
      take: pageSize
    });
    const total = await this.complaintModel.count({
      where: obj
    });
    return {
      complaintList,
      total
    };
  }

  async getComplaintById(id: number) {
    return await this.complaintModel.findOne({
      where: {id}
    });
  }

  async updateComplaint(complaint: Complaint) {
    return await this.complaintModel.save(complaint);
  }
}