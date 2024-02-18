import {InjectEntityModel} from "@midwayjs/orm";
import {UserLandlord} from "../../entities/UserLandlord";
import {Repository} from "typeorm";
import {Provide} from "@midwayjs/core";
import {UpdateUserReq} from "../../dto/user/landlord/UpdateUserReq";

@Provide()
export class LandlordDao {
  @InjectEntityModel(UserLandlord)
  private userLandlordModel: Repository<UserLandlord>;

  /**
   * 通过用户手机号获取用户信息
   * @param phone 手机号
   * @return UserLandlord 实体对象
   */
  async getUserByPhone(phone: string): Promise<UserLandlord | null> {
    return await this.userLandlordModel.findOne({
      where: {phone}
    })
  }

  /**
   * 添加用户
   * @param phone 手机号
   * @return UserLandlord 实体对象
   */
  async addUser(phone: string): Promise<UserLandlord> {
    const userLandlord = new UserLandlord();
    userLandlord.phone = phone;
    userLandlord.name = '良心房东';
    return await this.userLandlordModel.save(userLandlord);
  }

  /**
   * 更新用户头像
   * @param phone 用户手机号
   * @param imgUrl 图片url
   * @return UserLandlord 实体对象
   */
  async updateUserHeadImg(phone: string, imgUrl: string) {
    const userLandlord = await this.userLandlordModel.findOne({
      where: {phone}
    })
    userLandlord.headImg = imgUrl;
    return await this.userLandlordModel.save(userLandlord);
  }

  /**
   * 获取用户
   * @param phone 手机号
   * @return UserLandlord 实体对象
   */
  async getUser(phone: string) {
    return await this.userLandlordModel.findOne({
      where: {phone}
    })
  }

  /**
   * 更新用户信息
   * @param phone 手机号
   * @param updateUserInfo 更新的用户信息
   */
  async updateUser(phone: string, updateUserInfo: UpdateUserReq) {
    const userLandlord = await this.userLandlordModel.findOne({
      where: {phone}
    })
    Object.keys(updateUserInfo).forEach(item => {
      userLandlord[item] = updateUserInfo[item];
    })
    return await this.userLandlordModel.save(userLandlord);
  }

}
