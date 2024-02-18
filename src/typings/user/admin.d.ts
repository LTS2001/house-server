export declare namespace IUserAdmin {
  /**
   * 添加用户对象
   */
  interface AddUserObj {
    phone: string;
    password: string;
    name: string;
    remark: string;
    headImg: string;
  }

  /**
   * 更新用户对象
   */
  interface UpdateUserObj {
    phone: string;
    newPassword?: string;
    name?: string;
    remark?: string;
    headImg?: string;
  }

}
