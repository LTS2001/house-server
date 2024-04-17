import { savePropertyMetadata, UseGuard } from '@midwayjs/core';
import { UserAdminGuard } from '../guard/UserAdminGuard';

export const ROLE_META_KEY = 'role:name';

export function Role(roleName: string | string[] | number | number[]): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    roleName = [].concat(roleName);
    // 只保存元数据
    savePropertyMetadata(ROLE_META_KEY, roleName, target, propertyKey);
    UseGuard(UserAdminGuard)(target, propertyKey, descriptor);
  };
}
