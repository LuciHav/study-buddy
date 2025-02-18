import axios from "./axios";

export const getRequest = async ({ url, params = {} }) => {
  const res = await axios.get(url, { params });
  return res;
};

export const postRequest = async ({ url, data = {}, params = {} }) => {
  const res = await axios.post(url, data, { params });
  return res;
};

export const postFormDataRequest = async ({ url, data = {}, params = {} }) => {
  const res = await axios.post(url, data, {
    params,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const patchRequest = async ({ url, data = {}, params = {} }) => {
  const res = await axios.patch(url, data, { params });
  return res;
};

export const patchFormDataRequest = async ({ url, data = {}, params = {} }) => {
  const res = await axios.patch(url, data, {
    params,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const putRequest = async ({ url, data = {}, params = {} }) => {
  const res = await axios.put(url, data, { params });
  return res;
};

export const deleteRequest = async ({ url, params = {} }) => {
  const res = await axios.delete(url, { params });
  return res;
};
