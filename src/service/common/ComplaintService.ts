import { Inject, Provide } from '@midwayjs/core';
import { AddComplaintReq } from '@/dto/common/ComplaintDto';
import { Complaint } from '@/entities/Complaint';
import { ComplaintDao } from '@/dao/common/ComplaintDao';

@Provide()
export class ComplaintService {
  @Inject()
  private complaintDao: ComplaintDao;

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
}