import axios from "axios";

export const loadInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("machine_token");
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
};
