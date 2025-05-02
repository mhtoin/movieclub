'use client'
import * as Ariakit from '@ariakit/react'

export interface AriaDialogProps {
  children?: React.ReactNode
  title: string
  onClose: () => void
  open: boolean
}

export default function AriaDialog({
  onClose,
  children,
  open,
}: AriaDialogProps) {
  return (
    <Ariakit.Dialog
      open={open}
      onClose={onClose}
      backdrop={
        <div className="bg-black/5 opacity-0 backdrop-blur-none transition-all duration-300 data-enter:opacity-100 data-enter:backdrop-blur-xs" />
      }
      className="bg-background fixed inset-3 z-50 m-auto flex max-w-fit min-w-96 origin-bottom-right scale-95 flex-col gap-1 overflow-auto rounded-md border opacity-0 transition-all duration-300 data-enter:scale-100 data-enter:opacity-100 lg:min-w-[1000px]"
    >
      {children}
    </Ariakit.Dialog>
  )
}
