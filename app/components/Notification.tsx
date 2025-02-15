"use client";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useEffect } from "react";
import NotificationProgress from "./NotificationProgress";

export default function Notification() {
	const notification = useNotificationStore((state) => state.notification);
	const type = useNotificationStore((state) => state.type);
	const setNotification = useNotificationStore(
		(state) => state.setNotification,
	);

	useEffect(() => {
		setTimeout(() => {
			setNotification("", "");
		}, 5000);
	});

	return (
		<>
			{notification && (
				<div className="absolute left-0 right-0 grid place-items-center z-50 m-5">
					<div
						className={`alert max-w-lg p-5 ${
							type && type === "success"
								? "alert-success"
								: type && type === "error"
									? "alert-error"
									: "alert-info"
						}`}
					>
						{type && type === "success" ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Success</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						) : type && type === "error" ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Error</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="stroke-current shrink-0 w-6 h-6"
							>
								<title>Info</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
						<span>{notification}</span>
					</div>
					<NotificationProgress />
				</div>
			)}
		</>
	);
}
