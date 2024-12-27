import axios from 'axios';

export const wechatAxios = axios.create({
  baseURL: 'https://api.weixin.qq.com',
  timeout: 5000,
});

// wechatAxios.interceptors.request()
wechatAxios.interceptors.response.use(
  // status在2xx的状态走这里
  res => {
    if (res.status === 200) {
      return res.data;
    } else {
      console.warn(res.data);
      // 直接中断promise链
      return new Promise(() => {});
    }
  },
  // status不在2xx的状态走这里
  err => {
    console.error(err);
    // 终端promise链
    return new Promise(() => {});
  }
);
