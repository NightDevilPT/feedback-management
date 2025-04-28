// lib/api.service.ts
import axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosError,
} from "axios";
import { useToast } from "../hooks/use-toast";

class ApiService {
	private instance: AxiosInstance;
	private static apiService: ApiService;

	private constructor() {
		this.instance = axios.create({
			baseURL:
				process.env.NEXT_PUBLIC_API_BASE_URL ||
				"http://localhost:3001/api",
			withCredentials: true, // This enables cookie handling
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		this.initializeInterceptors();
	}

	public static getInstance(): ApiService {
		if (!ApiService.apiService) {
			ApiService.apiService = new ApiService();
		}
		return ApiService.apiService;
	}

	private initializeInterceptors() {
		// Request interceptor
		this.instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// You can add auth tokens here if needed
				// const token = localStorage.getItem('token');
				// if (token) {
				//   config.headers.Authorization = `Bearer ${token}`;
				// }
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		// Response interceptor
		this.instance.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			(error: AxiosError) => {
				// Handle errors globally
				if (error.response) {
					const errorData = error.response.data as { message?: string };
					const errorMessage = errorData?.message || "An error occurred";
					
					switch (error.response.status) {
						case 401:
							return Promise.reject({
								status: 401,
								message: "Unauthorized: Please login to continue",
								originalError: error
							});
						case 403:
							return Promise.reject({
								status: 403,
								message: "Forbidden: You don't have permission to access this resource",
								originalError: error
							});
						case 500:
							return Promise.reject({
								status: 500,
								message: "Server Error: Something went wrong on our end",
								originalError: error
							});
						default:
							return Promise.reject({
								status: error.response.status,
								message: errorMessage,
								originalError: error
							});
					}
				} else if (error.request) {
					return Promise.reject({
						status: 0,
						message: "Network Error: Please check your internet connection",
						originalError: error
					});
				} else {
					return Promise.reject({
						status: -1,
						message: "An unexpected error occurred",
						originalError: error
					});
				}
			}
		);
	}

	// CRUD methods
	public async get<T>(
		url: string,
		config?: InternalAxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.get<T>(url, config);
		return response.data;
	}

	public async post<T>(
		url: string,
		data?: any,
		config?: InternalAxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.post<T>(url, data, config);
		return response.data;
	}

	public async put<T>(
		url: string,
		data?: any,
		config?: InternalAxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.put<T>(url, data, config);
		return response.data;
	}

	public async patch<T>(
		url: string,
		data?: any,
		config?: InternalAxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.patch<T>(url, data, config);
		return response.data;
	}

	public async delete<T>(
		url: string,
		config?: InternalAxiosRequestConfig
	): Promise<T> {
		const response = await this.instance.delete<T>(url, config);
		return response.data;
	}
}

export default ApiService.getInstance();
