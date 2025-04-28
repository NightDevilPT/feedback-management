"use client"

import { Component } from "lucide-react";
import React from "react";
import { useSidebar } from "../../ui/sidebar";

const FMLogo = () => {
	const { state } = useSidebar();
	return (
		<div
			className={`w-auto h-auto ${
				state === "collapsed"
					? "flex justify-center items-center"
					: "grid grid-cols-[40px,_1fr] place-content-center place-items-center"
			} gap-3`}
		>
			<Component className={`text-primary w-full h-full`} />
			{state === "expanded" && (
				<div className="grid grid-cols-1 gap-0">
					<h1 className="text-xl font-bold">Feedback Management</h1>
				</div>
			)}
		</div>
	);
};

export default FMLogo;
