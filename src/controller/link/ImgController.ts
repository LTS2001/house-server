import {Controller, Files, Post} from "@midwayjs/core";

@Controller('/common')
export class ImgController {

  @Post('/headImg')
  async headImg(@Files() files) {
    // const imgUrlArr = files[0].data?.split('\\');
    // const imgName = imgUrlArr[imgUrlArr.length - 1];

    return {
      files,
    }
  }
}
