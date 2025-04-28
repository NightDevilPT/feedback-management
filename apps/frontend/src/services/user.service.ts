import apiService from "./api.service";

export interface UserData {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserData = async (): Promise<UserData> => {
  try {
    const response = await apiService.get<{ status: string; data: UserData }>("/user/me");
    return response.data;
  } catch (error: any) {
    throw error;
  }
}; 