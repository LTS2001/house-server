import { Inject, Provide } from '@midwayjs/core';
import { AddComplaintReq } from '@/dto/common/ComplaintDto';
import { Complaint } from '@/entities/Complaint';
import { ComplaintDao } from '@/dao/common/ComplaintDao';
import { GetComplaintAdminReq } from '@/dto/user/AdminDto';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { TenantDao } from '@/dao/user/TenantDao';

@Provide()
export class ComplaintService {
  @Inject()
  private complaintDao: ComplaintDao;

  @Inject()
  private landlordDao: LandlordDao;

  @Inject()
  private tenantDao: TenantDao;

  async addComplaint(complaintObj: AddComplaintReq) {
    const {reason, image, video, complaintId, identity} = complaintObj;
    const complaint = new Complaint();
    complaint.complaintId = complaintId;
    complaint.identity = identity;
    complaint.reason = reason;
    complaint.image = image;
    complaint.video = video;
    return await this.complaintDao.addComplaint(complaint);
  }

  async getComplaint(complaintId: number, identity: number) {
    return await this.complaintDao.getComplaint(complaintId, identity);
  }

  async getComplainByAdmin(getComplainReq: GetComplaintAdminReq) {
    const complaintList = await this.complaintDao.getComplaintByAdmin(getComplainReq);
    const landlordIdList: number[] = [];
    const tenantIdList: number[] = [];
    let landlordList: any[];
    let tenantList: any[];
    complaintList?.forEach(complaint => {
      if (complaint.identity === 1) { // 租客
        tenantIdList.push(complaint.complaintId);
      } else if (complaint.identity === 2) { // 房东
        landlordIdList.push(complaint.complaintId);
      }
    });

    if (landlordIdList.length) {
      // 获取房东信息
      landlordList = await this.landlordDao.getLandlordByIds(landlordIdList);
    }
    if (tenantIdList.length) {
      // 获取租客信息
      tenantList = await this.tenantDao.getTenantByIds(tenantIdList);
    }
    return complaintList?.map((complaint, idx) => {
      return {
        ...complaint,
        complaintName: complaint.identity === 1 ? tenantList.find(t => t.id === complaint.complaintId)?.name : landlordList.find(l => l.id === complaint.complaintId)?.name
      };
    });
  }

  async updateComplainByAdmin(id: number, status: number) {
    const complaint = await this.complaintDao.getComplaintById(id);
    complaint.status = status;
    return await this.complaintDao.updateComplaint(complaint);
  }
}