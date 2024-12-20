import { Controller, File, Post } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { ResultUtils } from '@/common/ResultUtils';

@Controller('/medium')
export class MediumController {
  /**
   * 上传图片/视频
   * @param file
   */
  @Post('/', { middleware: [JwtMiddleware] })
  async uploadMedium(@File() file: any) {
    const imgUrlArr = file.data?.split('/');
    return new ResultUtils().success('/' + imgUrlArr[imgUrlArr.length - 1]);
  }
  /**
   * 聊天上传图片/视频
   */
  @Post('/chat', { middleware: [JwtMiddleware] })
  async uploadChatMedium(@File() file: any) {
    const imgUrlArr = file.data?.split('/');
    const data = '/' + imgUrlArr[imgUrlArr.length - 1];
    return new ResultUtils().success({
      data,
      mimeType: file.mimeType,
    });
  }
}
