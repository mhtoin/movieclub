import { MenuItem as AriaMenuItem, MenuStore } from "@ariakit/react";

export default function MenuItem({
  children,
  className,
  store,
}: {
  children: React.ReactNode;
  className?: string;
  store: MenuStore;
}) {
  return (
    <AriaMenuItem
      render={<li className={className} />}
      hideOnClick
      onClick={() => store.hide()}
      store={store}
    >
      {children}
    </AriaMenuItem>
  );
}
