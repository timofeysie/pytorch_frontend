import axios from "axios";

axios.defaults.baseURL = "https://3.26.241.7:8000/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();