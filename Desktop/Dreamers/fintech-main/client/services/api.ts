import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear auth and redirect to login
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }

        const message =
          error.response?.data instanceof Object
            ? (error.response.data as any).error || (error.response.data as any).message
            : error.message;

        const errorObj = new Error(message || "An error occurred");
        (errorObj as any).status = error.response?.status;
        (errorObj as any).data = error.response?.data;
        
        return Promise.reject(errorObj);
      },
    );
  }

  get<T>(url: string, config?: any) {
    return this.instance.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.instance.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: any) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.instance.delete<T>(url, config);
  }
}

export const apiClient = new ApiService();
