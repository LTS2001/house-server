import { ResultUtils } from '@/common/ResultUtils';
import { SystemConfig } from '@/entities/SystemConfig';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { Controller, Get } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Controller('/system_config', { middleware: [JwtMiddleware] })
export class SystemConfigController {
  @InjectEntityModel(SystemConfig)
  systemConfigModel: Repository<SystemConfig>;

  @Get('/')
  async getVerificationEntry() {
    const systemConfig = await this.systemConfigModel.findOne({
      where: { id: 1 },
    });
    return new ResultUtils().success(systemConfig);
  }
}
