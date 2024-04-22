import { getPropertyMetadata, Guard, IGuard } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ROLE_META_KEY } from '../decorator/role';
import { BusinessException } from '../exception/BusinessException';
import { ResponseCode } from '../common/ResponseFormat';

@Guard()
export class UserAdminGuard implements IGuard<Context> {
  async canActivate(context: Context, supplierClz: any, methodName: string): Promise<boolean> {
    // 从类元数据上获取角色信息
    const roleNameList = getPropertyMetadata<string[]>(ROLE_META_KEY, supplierClz, methodName);
    if (roleNameList && roleNameList.length && context.user.role) {
      if (roleNameList.includes(context.user.role)) {
        return true;
      } else {
        throw new BusinessException(ResponseCode.FORBIDDEN_ERROR);
      }
    }
    throw new BusinessException(ResponseCode.FORBIDDEN_ERROR);
  }
}
