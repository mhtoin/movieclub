"use client";

import { Button } from "components/ui/Button";
import { useValidateSession } from "lib/hooks";
import { publishMessage } from "lib/utils";
import { useState } from "react";

export default function Chat() {
	const { data: user, status } = useValidateSession();
	const [message, setMessage] = useState("");

	if (status === "pending") {
		return <div>Loading...</div>;
	}

	return (
		<div className="fixed bottom-10 right-10 w-96 h-36 bg-background border rounded-md z-50 flex flex-col items-center justify-center">
			<div className="flex items-center justify-between">
				<div className="flex items-center flex-col justify-center gap-5">
					<input
						type="text"
						placeholder="Type your message"
						className="bg-card p-3 text-foreground rounded-md"
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button
						size="lg"
						variant="outline"
						onClick={() => publishMessage(message, "shortlist", user?.id ?? "")}
					>
						Send
					</Button>
				</div>
			</div>
		</div>
	);
}
