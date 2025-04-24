import { _delete, get, post, put } from ".";

export const getFetcher = (url) => {
  return get({
    url,
  });
};

export const postFetcher = (param, options) => {
  let url;
  let data;

  if (Array.isArray(param)) {
    url = param[0];
    if (param.length === 2) {
      data = param[1];
    }
  }

  if (typeof param === "string") {
    url = param;
    if (options?.arg) {
      data = options.arg;
    }
  }

  // console.log("[postFetcher] ", url, data);
  return post({ url, data });
};

export const putFetcher = (url, options) => {
  return put({
    ...(options?.arg && { data: options?.arg }),
    url,
  });
};

export const deleteFetcher = (url, options) => {
  return _delete({ url, param: options?.arg });
};
