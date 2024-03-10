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
}