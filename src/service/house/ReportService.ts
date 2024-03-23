import { Inject, Provide } from '@midwayjs/core';
import { HouseReport } from '@/entities/HouseReport';
import { ReportDao } from '@/dao/house/ReportDao';
import { AddReportReq } from '@/dto/house/ReportDto';

@Provide()
export class ReportService {
  @Inject()
  private reportDao: ReportDao;

  /**
   * 添加维修记录
   * @param reportObj 维修信息
   * @param tenantId 租客id
   */
  async addReport(reportObj: AddReportReq, tenantId: number) {
    const {houseId, reason, image, video, landlordId} = reportObj;
    const houseReport = new HouseReport();
    houseReport.houseId = houseId;
    houseReport.landlordId = landlordId;
    houseReport.tenantId = tenantId;
    houseReport.reason = reason;
    houseReport.image = image;
    houseReport.video = video;
    return await this.reportDao.addReport(houseReport);
  }

  /**
   * 通过租客id查询房屋维修记录
   * @param tenantId
   */
  async getReportByTenantId(tenantId: number) {
    return await this.reportDao.getReportByTenantId(tenantId);
  }

  /**
   * 通过房东id查询房屋维修记录
   * @param landlordId
   */
  async getReportByLandlordId(landlordId: number) {
    return await this.reportDao.getReportByLandlordId(landlordId);
  }

  /**
   * 更新维修状态
   * @param reportId 维修id
   * @param status 状态
   */
  async updateReportStatus(reportId: number, status: number) {
    return await this.reportDao.updateReportStatus(reportId, status);
  }
}