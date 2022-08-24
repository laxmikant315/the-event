import axios from "axios";
import { useHistory } from "react-router-dom";
const serverUrl = process.env.REACT_APP_SERVER_URL + "/auth";

export const LoadInterceptor = () => {
  const history = useHistory();
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(
        config.url?.includes("/token/refresh")
          ? "machine_refresh_token"
          : "machine_token"
      );
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }

      // config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        originalRequest.url.includes("/auth/login")
      ) {
        history.push("/login");
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        return axios.get(serverUrl + "/token/refresh").then((res) => {
          if (res.status === 200) {
            localStorage.setItem("machine_token", res.data.access);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getItem("machine_token");
            return axios(originalRequest);
          }
        });
      }
      return Promise.reject(error);
    }
  );
  return null;
};
