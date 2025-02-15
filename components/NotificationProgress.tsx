import { useEffect, useState } from "react";

export default function NotificationProgress() {
	const [value, _setValue] = useState(100);

	useEffect(() => {});
	return <progress className="progress w-56" value={value} max="100" />;
}
