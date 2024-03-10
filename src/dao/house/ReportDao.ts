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
}