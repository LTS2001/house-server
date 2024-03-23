import { Provide } from '@midwayjs/core';
import { HouseReport } from '@/entities/HouseReport';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

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
}