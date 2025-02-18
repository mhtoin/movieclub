import ExpandableSidebar from "@/components/common/ExpandableSidebar";
import ShortlistSidebarContent from "@/components/shortlist/ShortlistSidebarContent";

export default function ShortlistLayout({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="pt-16 flex flex-row h-screen overflow-hidden">
			<ExpandableSidebar>
				<ShortlistSidebarContent />
			</ExpandableSidebar>
			{children}
		</div>
	);
}
