import React from "react";
import { UserFeedbackPage } from "./_components/user-feedbackpage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return <UserFeedbackPage id={id} />;
};

export default page;
