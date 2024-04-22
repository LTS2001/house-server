import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddChatMessageReq, GetChatMessageReq, GetCurrentSessionLastOneMessageReq } from '@/dto/chat/ChatDto';
import { ResultUtils } from '@/common/ResultUtils';
import { ChatMessageService } from '@/service/chat/ChatMessageService';


@Controller('/chat/message', {middleware: [JwtMiddleware]})
export class ChatMessageController {
  @Inject()
  private chatListService: ChatMessageService;

  @Post('/')
  async addChatMessage(@Body() chatMessageReq: AddChatMessageReq) {
    return new ResultUtils().success(await this.chatListService.addChatMessage(chatMessageReq));
  }

  @Get('/')
  async getChatMessage(@Query() chatMessageReq: GetChatMessageReq) {
    return new ResultUtils().success(await this.chatListService.getChatMessage(chatMessageReq));
  }

  @Get('/lastOne')
  async getChatSessionLastOneMessageList(@Query('senderId') senderId: string) {
    return new ResultUtils().success(await this.chatListService.getChatSessionLastOneMessageList(senderId));
  }

  /**
   * 获取当前 sender 和 receiver 会话的最新消息
   */
  @Get('/session/lastOne')
  async getCurrentChatSessionLastOneMessage(@Query() request: GetCurrentSessionLastOneMessageReq) {
    const {senderId, receiverId} = request;
    return new ResultUtils().success(await this.chatListService.getCurrentChatSessionLastOneMessage(senderId, receiverId));
  }
}