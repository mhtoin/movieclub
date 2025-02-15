import { useEffect, useState } from "react";

export default function NotificationProgress() {
	const [value, setValue] = useState(100);

	useEffect(() => {});
	return <progress className="progress w-56" value={value} max="100" />;
}
