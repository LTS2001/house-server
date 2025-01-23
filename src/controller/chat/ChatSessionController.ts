import { Body, Controller, Del, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { AddChatSessionReq, DelChatSessionReq, LeaveChatSessionReq } from '@/dto/chat/ChatDto';
import { ResultUtils } from '@/common/ResultUtils';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { ChatSessionService } from '@/service/chat/ChatSessionService';

@Controller('/chat/session', {middleware: [JwtMiddleware]})
export class ChatSessionController {
  @Inject()
  private chatSessionService: ChatSessionService;

  /**
   * 添加一个会话
   */
  @Post('/')
  async addChatSession(@Body() chatSessionReq: AddChatSessionReq) {
    const {senderId, receiverId} = chatSessionReq;
    return new ResultUtils().success(await this.chatSessionService.addChatSession(senderId, receiverId));
  }

  /**
   * 删除一个会话
   * @param delReq
   */
  @Del('/')
  async delChatSession(@Body() delReq: DelChatSessionReq) {
    const {senderId, receiverId} = delReq;
    return new ResultUtils().success(await this.chatSessionService.delChatSession(senderId, receiverId));
  }

  @Get('/')
  async getChatSession(@Query('senderId') senderId: string) {
    return new ResultUtils().success(await this.chatSessionService.getChatSession(senderId));
  }

  @Put('/leave')
  async leaveChatSession(@Body() chatReq: LeaveChatSessionReq) {
    return new ResultUtils().success(await this.chatSessionService.leaveChatSession(chatReq));
  }

  @Put('/clearSenderCursor')
  async clearSenderSessionCursor(@Body('senderId') senderId: string) {
    return new ResultUtils().success(await this.chatSessionService.clearSenderSessionCursor(senderId))
  }
}