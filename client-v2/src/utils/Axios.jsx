import axios from "axios";
import { BASE_URL } from "../config";

const AxiosInstance = axios.create({ baseURL: BASE_URL });

axios.interceptors.response.use(
  (res) => res,
  (err) =>
    Promise.reject(
      (err.response && err.response.data) || "SomeThing Went Wrong"
    )
);

export default AxiosInstance;
