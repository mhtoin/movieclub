import { usePathname } from 'next/navigation'

export default function HamburgerMenu({ open }: { open: boolean }) {
  const pathname = usePathname()
  const isHome = pathname === '/home'
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`w-6 h-1 rounded origin-top-left transition-all ease-in-out duration-200 ${
          isHome ? 'bg-primary-foreground' : 'bg-foreground'
        } ${open ? 'rotate-45 ' : ''}`}
      />
      <div
        className={`w-6 h-1 rounded origin-center transition-transform ease-in-out duration-200 ${
          isHome ? 'bg-primary-foreground' : 'bg-foreground'
        } ${open ? 'max-w-0' : ''}`}
      />
      <div
        className={`w-6 h-1 rounded origin-bottom-left transition-all ease-in-out duration-200 ${
          isHome ? 'bg-primary-foreground' : 'bg-foreground'
        } ${open ? '-rotate-45 ' : ''}`}
      />
    </div>
  )
}
