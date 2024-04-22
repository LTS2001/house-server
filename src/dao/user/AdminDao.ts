import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Like, Repository } from 'typeorm';
import { Admin } from '@/entities/Admin';
import { GetAdminReq } from '@/dto/user/AdminDto';
import { UserAdminConstant } from '@/constant/userConstant';

@Provide()
export class AdminDao {
  @InjectEntityModel(Admin)
  adminModel: Repository<Admin>;

  /**
   * 添加管理员
   * @param adminObj 管理员信息对象
   * @return Admin 实体对象
   */
  async addAdmin(adminObj: Admin) {
    const admin = new Admin();
    Object.keys(adminObj).forEach(key => {
      admin[key] = adminObj[key];
    });
    return await this.adminModel.save(admin);
  }

  /**
   * 删除管理员
   * @param phone 手机号
   */
  async delAdmin(phone: string) {
    const admin = await this.adminModel.findOne({where: {phone}});
    admin.status = 0;
    return await this.adminModel.save(admin);
  }

  /**
   * 更新管理员
   * @param phone 手机号
   * @param adminObj 管理员信息
   * @return Admin 实体对象
   */
  async updateAdmin(id: number, adminObj: Admin) {
    const admin = await this.adminModel.findOne({where: {id}});
    Object.keys(adminObj).forEach((key) => {
      admin[key] = adminObj[key];
    });
    return await this.adminModel.save(admin);
  }

  /**
   * 通过用户手机号获取用户信息
   * @param phone 手机号
   * @return UserAdmin 实体对象
   */
  async getAdminByPhone(phone: string) {
    return await this.adminModel.findOne({where: {phone}});
  }

  async getAdminById(id: number) {
    return await this.adminModel.findOne({where: {id}});
  }

  async getAdminList(getAdminReq: GetAdminReq) {
    const {current, pageSize} = getAdminReq;
    const obj: any = {};
    const equalArr = ['id', 'status'];
    const likeArr = ['name', 'phone', 'remark'];
    Object.keys(getAdminReq).forEach(key => {
      if (equalArr.find(e => e === key)) {
        obj[key] = getAdminReq[key];
      }
      if (likeArr.find(l => l === key)) {
        obj[key] = Like(`%${ getAdminReq[key] }%`);
      }
    });
    obj.role = UserAdminConstant.DefaultRole;

    const list = await this.adminModel.find({
      where: obj,
      order: {id: 'desc'},
      skip: (current - 1) * pageSize,
      take: pageSize
    });
    const total = await this.adminModel.count({
      where: obj
    });
    return {
      list,
      total
    };
  }
}
