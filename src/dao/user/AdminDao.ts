import {Provide} from '@midwayjs/core'
import {InjectEntityModel} from "@midwayjs/orm";
import {Repository} from "typeorm";
import {UserAdmin} from "../../entities/UserAdmin";
import {IUserAdmin} from "../../typings/user/admin";

/**
 * user_admin data access object（数据存储对象）
 */
@Provide()
export class AdminDao {
  @InjectEntityModel(UserAdmin)
  userAdminModel: Repository<UserAdmin>;

  /**
   * 添加用户
   * @param addUserObj 用户信息对象
   * @return UserAdminGuard 实体对象
   */
  async addUser(addUserObj: IUserAdmin.AddUserObj): Promise<UserAdmin> {
    const {name, headImg, remark, password, phone} = addUserObj;
    const user = new UserAdmin();
    user.name = name;
    user.remark = remark;
    user.headImg = headImg;
    user.phone = phone;
    user.password = password;
    return await this.userAdminModel.save(user);
  }

  /**
   * 删除用户
   * @param phone 手机号
   */
  async delUser(phone: string) {
    return await this.userAdminModel.delete({phone})
  }

  /**
   * 更新用户
   * @param updateUserObj 更新内容对象
   * @return UserAdminGuard 实体对象
   */
  async updateUser(updateUserObj: Partial<IUserAdmin.AddUserObj>) {
    const user = await this.userAdminModel.findOne({
      where: {
        phone: updateUserObj.phone,
      }
    })
    Object.keys(updateUserObj).forEach((key) => {
      user[key] = updateUserObj[key];
    })
    return await this.userAdminModel.save(user);
  }

  /**
   * 通过用户手机号获取用户信息
   * @param phone 手机号
   * @return UserAdmin 实体对象
   */
  async getUserByPhone(phone: string): Promise<UserAdmin | null> {
    return await this.userAdminModel.findOne({
      where: {phone}
    })
  }
}
