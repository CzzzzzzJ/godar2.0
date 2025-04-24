import * as axios from "axios";

import { RequestConfig, config, getContentType } from "./config";

// 创建请求实例
const http = axios.default.create(config);

// 请求错误的业务场景
// const errorScenes = [LOGIN_EXPIRED, NOT_LOGGED_IN, INVALID_TOKEN, NO_TOKEN];

// 请求拦截器
http.interceptors.request.use(
  function request(config) {
    if (config.headers) {
      // const userToken = localStorage.get("userToken");
      // config.headers["Content-Type"] = getContentType(config.contentType);
      // if (userToken != null) {
      //   config.headers["Authorization"] = `Bearer ${userToken}`;
      // }
    }

    // 文件类型请求需要将文件内容拼接到form表单里
    if (config.contentType === "file") {
      const formData = new FormData();

      formData.append("file", config.data);
      config.data = formData;
    }

    return config;
  },
  function response(err) {
    return Promise.reject(err);
  }
);

// 响应拦截器
http.interceptors.response.use(
  async function request(res) {
    console.warn("[res]", res);
    const { status } = res;
    const { code, msg, success, type, data } = res.data;
    const { responseType } = res.config;
    const isBlob = responseType === "blob";
    const isJson = type === "application/json";
    // console.log("【http】", status, res.data, data, msg);

    // 请求错误，如 rpc 调用异常等
    if (isBlob) {
      // if (res.status !== 200 && isJson) {
      //   return Promise.reject('导出失败');
      // }
      // const header = res.headers['content-disposition'];
      // const filename = header.slice(28);
      // const url = window.URL.createObjectURL(new Blob([res.data]));
      // const link = document.createElement('a');
      // link.style.display = 'none';
      // link.href = url;
      // link.setAttribute('download', decodeURIComponent(filename));
      // document.body.appendChild(link);
      // link.click();
      // return;
    }

    // console.log(res.data, msg);

    // success
    if (status === 200) {
      return res.data;
    }

    if (status === 401) {
      window.location.href = "/signin";
      return;
    }

    return Promise.reject(msg);
  },
  function respHander(err) {
    const { status, data } = err.response || {};
    console.warn("err =>", err, status);

    // let { msg } = data;
    const isTimeout = err.code === "ECONNABORTED";

    let msg;
    switch (status) {
      case 401:
        window.location.href = "/signin";
      case 500:
        msg = "服务器错误";
        break;
      case 404:
        msg = "请求地址不存在";
        break;
      default:
        msg = err.message;
        break;
    }

    // toast.error(msg);

    // if (err.message === 'Network Error') {
    //   msg = '网络错误，请稍候重试';
    // }
    // if (isTimeout) {
    //   msg = '请求超时，请稍候重试';
    // }

    // // message.error(msg);
    // throw Error(msg);
  }
);

export const request = (config) => {
  return http
    .request(config)
    .then((res) => res)
    .catch((msg) => {
      // toast.error(msg);
      return Promise.reject(msg);
    });
};

// post 请求函数
export const post = (options) => {
  const { url, data, contentType, responseType, params } = options;
  // console.log(options);

  return request({
    contentType: contentType || "json",
    method: "POST",
    responseType,
    url,
    data,
  });
};

// get 请求函数
export const get = (options) => {
  const { url, data, contentType, responseType } = options;
  const _contentType = contentType || "json";

  return request({
    ...(_contentType === "json" && { params: data }),
    ...(_contentType === "form" && { data }),
    // contentType: _contentType,
    method: "GET",
    responseType,
    url,
  });
};

// put 请求函数
export const put = (options) => {
  const { url, data } = options;

  return request({
    method: "PUT",
    data,
    url,
  });
};

// delete 请求函数
export const _delete = (options) => {
  const { url, data } = options;

  return request({
    method: "DELETE",
    data,
    url,
  });
};

export default request;
