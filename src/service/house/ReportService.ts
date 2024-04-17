import { Inject, Provide } from '@midwayjs/core';
import { HouseReport } from '@/entities/HouseReport';
import { ReportDao } from '@/dao/house/ReportDao';
import { AddReportReq } from '@/dto/house/ReportDto';
import { GetReportReq } from '@/dto/user/AdminDto';
import { HouseDao } from '@/dao/house/HouseDao';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { TenantDao } from '@/dao/user/TenantDao';

@Provide()
export class ReportService {
  @Inject()
  private reportDao: ReportDao;

  @Inject()
  private houseDao: HouseDao;

  @Inject()
  private landlordDao: LandlordDao;

  @Inject()
  private tenantDao: TenantDao;

  /**
   * 添加维修记录
   * @param reportObj 维修信息
   */
  async addReport(reportObj: AddReportReq) {
    const {houseId, reason, image, video, landlordId, tenantId} = reportObj;
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

  async getReportByAdmin(getReportReq: GetReportReq) {
    const reportList = await this.reportDao.getReportByAdmin(getReportReq);
    // 获取房东信息
    const landlordList = await this.landlordDao.getLandlordByIds(reportList?.map(r => r.landlordId));
    // 获取房屋信息
    const houseList = await this.houseDao.getHouseByHouseIds(reportList?.map(r => r.houseId));
    // 获取租客信息
    const tenantList = await this.tenantDao.getTenantByIds(reportList?.map(r => r.tenantId));
    return reportList?.map((report, idx) => {
      const landlord = landlordList.find(l => l.id === report.landlordId);
      const tenant = tenantList.find(t => t.id === report.tenantId);
      return {
        ...report,
        landlordName: landlord?.name,
        landlordPhone: landlord?.phone,
        houseName: houseList.find(h => h.id === report.houseId)?.name,
        tenantName: tenant?.name,
        tenantPhone: tenant?.phone,
      };
    });
  }
}