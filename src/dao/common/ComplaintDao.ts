import { Provide } from '@midwayjs/core';
import { Complaint } from '@/entities/Complaint';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

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
}