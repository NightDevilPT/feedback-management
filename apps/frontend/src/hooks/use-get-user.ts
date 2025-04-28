"use client";

// hooks/useGetUsers.ts
import { useEffect, useState } from "react";
import apiService from "../services/api.service";
import { PaginatedUsersResponse } from "../interface/user.interface";

interface UseGetUsersParams {
	page: number;
	limit: number;
	search?: string;
}

export const useGetUsers = ({ page, limit, search }: UseGetUsersParams) => {
	const [data, setData] = useState<PaginatedUsersResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await apiService.get<{
				data: PaginatedUsersResponse;
			}>("/users");
			console.log(response.data, "response.data");
			setData(response.data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch users"
			);
		} finally {
			setIsLoading(false);
		}
	};

	// You might want to add useEffect to fetch automatically
	useEffect(() => {
		fetchUsers();
	}, [page, limit, search]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchUsers,
	};
};
