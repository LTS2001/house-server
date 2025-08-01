/**
 * 颁发给用户的key
 */
export const SESSION_KEY = 'sessionIdentify';

/**
 * admin常量
 */
export enum UserAdminConstant {
  /**
   * 默认角色为admin
   */
  DefaultRole = 0,

  /**
   * 超级管理员角色superAdmin
   */
  SuperAdminRole = 1,
}

/**
 * 房东默认头像
 */
export const LANDLORD_HEAD_IMG = '/common/male.png';

/**
 * 房东默认名称
 */
export const LANDLORD_NAME = '单身房东';

/**
 * 租客默认头像
 */
export const TENANT_HEAD_IMG = '/common/male.png';

/**
 * 租客默认名称
 */
export const TENANT_NAME = '单身租客';

/**
 * 房东身份
 */
export const LANDLORD = 'landlord';

/**
 * 租客身份
 */
export const TENANT = 'tenant';

/**
 * 用户账号正常
 */
export const USER_STATUS_NORMAL = 1;

/**
 * 用户账号停用
 */
export const USER_STATUS_STOP_USING = -1;

/**
 * 用户账号删除
 */
export const USER_STATUS_DELETE = 0;

/**
 * 用户账号未实名
 */
export const USER_STATUS_UN_IDENTITY = 2;
