import { Body, Controller, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { AddChatSessionReq, LeaveChatSessionReq } from '@/dto/chat/ChatDto';
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

  @Get('/')
  async getChatSession(@Query('senderId') senderId: string) {
    return new ResultUtils().success(await this.chatSessionService.getChatSession(senderId));
  }

  @Put('/leave')
  async leaveChatSession(@Body() chatReq: LeaveChatSessionReq) {
    return new ResultUtils().success(await this.chatSessionService.leaveChatSession(chatReq));
  }


}