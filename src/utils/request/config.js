import qs from "qs";

export const config = {
  baseURL: "http://8.130.187.17/webapi",
  responseType: "json",
  timeout: 120000, // 60s超时
  withCredentials: false, // 是否允许携带cookie
  transformRequest: [
    function transformRequest(data, headers) {
      if (headers) {
        if (headers["Content-Type"] === "application/json") {
          return JSON.stringify(data);
        }
        if (headers["Content-Type"] === "multipart/form-data") {
          return data;
        }
      }
      return qs.stringify(data);
    },
  ],
};

export const getContentType = (type) => {
  switch (type) {
    case "json":
      return "application/json";
    case "form":
      return "application/x-www-form-urlencoded";
    case "file":
      return "multipart/form-data";
    default:
      return "application/json";
  }
};
