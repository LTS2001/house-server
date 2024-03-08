import { OnWSConnection, WSController } from '@midwayjs/core';

// import { Context } from '@midwayjs/socketio';

@WSController('/tenant')
export class TenantController {
  // @Inject()
  // private ctx: Context;

  @OnWSConnection()
  async leaseApplication() {
    console.log('有人发起了租赁申请');
  }
}