/**
 * house_info表的字段
 */
export const houseInfoTableField = ['name', 'landlordId', 'parentId', 'addressId', 'area', 'price', 'depositNumber', 'priceNumber', 'floor', 'toward', 'toilet', 'kitchen', 'balcony', 'waterFee', 'electricityFee', 'internetFee', 'fuelFee', 'note', 'houseImg', 'status'];

/**
 * house_address表的字段
 */
export const houseAddressTableField = ['provinceName', 'cityName', 'areaName', 'addressName', 'addressInfo', 'longitude', 'latitude'];

/**
 * 已租赁
 */
export const HOUSE_LEASED = 1;

/**
 * 房屋待租已发布
 */
export const HOUSE_FORRENT_RELEASED = 2;

/**
 * 房屋已删除
 */
export const HOUSE_DEL = 0;

/**
 * 评论正常
 */
export const COMMENT_NORMAL = 1;

/**
 * 房屋已收藏
 */
export const HOUSE_COLLECTED = 1;
