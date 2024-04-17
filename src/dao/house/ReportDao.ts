import { Provide } from '@midwayjs/core';
import { HouseReport } from '@/entities/HouseReport';
import { InjectEntityModel } from '@midwayjs/orm';
import { Like, Repository } from 'typeorm';
import { GetReportReq } from '@/dto/user/AdminDto';

@Provide()
export class ReportDao {

  @InjectEntityModel(HouseReport)
  private reportModel: Repository<HouseReport>;

  /**
   * 添加维修记录
   * @param reportObj 维修信息
   */
  async addReport(reportObj: HouseReport) {
    const houseReport = new HouseReport();
    Object.keys(reportObj).forEach(key => {
      houseReport[key] = reportObj[key];
    });
    return await this.reportModel.save(houseReport);
  }

  /**
   * 通过租客id查询房屋维修记录
   * @param tenantId
   */
  async getReportByTenantId(tenantId: number) {
    return await this.reportModel.find({
      where: {tenantId},
      order: {id: 'desc'}
    });
  }

  /**
   * 通过房东id查询房屋维修记录
   * @param landlordId
   */
  async getReportByLandlordId(landlordId: number) {
    return await this.reportModel.find({
      where: {landlordId},
      order: {id: 'desc'}
    });
  }

  /**
   * 更新维修状态
   * @param id 维修id
   * @param status 状态
   */
  async updateReportStatus(id: number, status: number) {
    const report = await this.reportModel.findOne({
      where: {id}
    });
    report.status = status;
    return await this.reportModel.save(report);
  }

  async getReportByAdmin(getReportReq: GetReportReq) {
    const {current, pageSize} = getReportReq;
    const obj: any = {};
    const equalArr = ['id', 'houseId', 'landlordId', 'tenantId', 'status'];
    const likeArr = ['reason'];
    Object.keys(getReportReq).forEach(key => {
      if (equalArr.find(e => e === key)) {
        obj[key] = getReportReq[key];
      }
      if (likeArr.find(l => l === key)) {
        obj[key] = Like(`%${ getReportReq[key] }%`);
      }
    });
    return await this.reportModel.find({
      where: obj,
      order: {id: 'desc'},
      skip: current - 1,
      take: pageSize
    });
  }
}