"use client";

import React, { useEffect, useState } from "react";
import { LoginSection } from "./_components/LoginSection";
import { useAuth } from "@/src/provider/auth-provider";
import Loader from "@/src/components/ui/loader";
import useApi from "@/src/hooks/use-api";
import {
	PaginatedUsersResponse,
	UserResponse,
} from "@/src/interface/user.interface";
import { DataView } from "@/src/components/view-layout";
import UserTable from "./_components/UserTable";
import { UsersGridView } from "./_components/UserGrid";
import { FeedbackModal } from "./_components/FeedBackForm";
import { Button } from "@/src/components/ui/button";

const Page = () => {
	const { user, isFetchingUser } = useAuth();
	const { get, isLoading, error } = useApi();
	const [users, setUsers] = useState<UserResponse[] | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [limit, setLimit] = useState(10);
	const [open, setOpen] = useState(false);

	const fetchUsers = async () => {
		try {
			const response = await get<PaginatedUsersResponse>(
				`/user/all?page=${page}&limit=${limit}`
			);
			setUsers(response.data);
			setTotalPages(response.meta.totalPages);
			setTotalItems(response.meta.totalItems);
		} catch (err) {
			console.error("Failed to fetch users", err);
		}
	};

	useEffect(() => {
		if (user) {
			fetchUsers();
		}
	}, [limit, page, user, get]);

	if (isFetchingUser) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<Loader /> {/* Replace with your actual loader component */}
			</div>
		);
	}

	if (!user && !isFetchingUser) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<LoginSection />
			</div>
		);
	}

	return (
		user && (
			<div className="w-full h-full p-4">
				<h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
					Users{" "}
					<Button onClick={() => setOpen(true)}>Give Feedback</Button>
					<FeedbackModal
						open={open}
						setOpen={setOpen}
						onSuccess={fetchUsers}
					/>
				</h1>
				{isLoading ? (
					<Loader />
				) : error ? (
					<div className="text-red-500">{error.message}</div>
				) : users && users.length > 0 ? (
					<DataView
						totalPage={totalPages}
						data={users}
						itemsPerPage={limit}
						currentPage={page}
						onPageChange={setPage}
						totalItems={totalItems || 0}
						tableView={<UserTable data={users} />}
						gridView={<UsersGridView data={users} />}
					/>
				) : (
					<div>No users found</div>
				)}
			</div>
		)
	);
};

export default Page;
