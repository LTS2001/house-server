import { Rule, RuleType } from '@midwayjs/validate';

const RuleStrRequire = RuleType.string().required();

const RuleNumRequire = RuleType.number().required();

class BaseChatSession {
  @Rule(RuleStrRequire)
  senderId: string;
  @Rule(RuleStrRequire)
  receiverId: string;
}

export class AddChatSessionReq extends BaseChatSession {
}

export class LeaveChatSessionReq extends BaseChatSession {
  @Rule(RuleNumRequire)
  sessionId: number;
}

/**
 * 添加聊天信息
 */
export class AddChatMessageReq {
  @Rule(RuleNumRequire)
  sessionId: number;
  @Rule(RuleStrRequire)
  senderId: string;
  @Rule(RuleStrRequire)
  receiverId: string;
  @Rule(RuleStrRequire)
  content: string;
  @Rule(RuleNumRequire)
  type: number;
}

/**
 * 查询聊天信息
 */
export class GetChatMessageReq extends BaseChatSession {
  /**
   * 返回记录条数
   */
  @Rule(RuleNumRequire)
  limit: number;
}

/**
 * 获取当前 sender 和 receiver 会话的最新消息
 */
export class GetCurrentSessionLastOneMessageReq extends BaseChatSession {
}

/**
 * 删除聊天会话信息
 */
export class DelChatSessionReq extends BaseChatSession {

}