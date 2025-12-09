'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X as XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type RootProps = React.ComponentProps<typeof SheetPrimitive.Root>
type TriggerProps = React.ComponentProps<typeof SheetPrimitive.Trigger>
type CloseProps = React.ComponentProps<typeof SheetPrimitive.Close>
type PortalProps = React.ComponentProps<typeof SheetPrimitive.Portal>
type OverlayProps = React.ComponentProps<typeof SheetPrimitive.Overlay>
type ContentProps = React.ComponentProps<typeof SheetPrimitive.Content>
type TitleProps = React.ComponentProps<typeof SheetPrimitive.Title>
type DescriptionProps = React.ComponentProps<typeof SheetPrimitive.Description>

export function Sheet(props: RootProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

export function SheetTrigger(props: TriggerProps) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

export function SheetClose(props: CloseProps) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

export function SheetPortal(props: PortalProps) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

export const SheetOverlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <SheetPrimitive.Overlay
        ref={ref}
        data-slot="sheet-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
          className,
        )}
        {...props}
      />
    )
  },
)
SheetOverlay.displayName = 'SheetOverlay'

/**
 * SheetContent
 *
 * - `title` (optional): if provided, will render a visible title.
 * - if `title` is not provided, a visually-hidden title is rendered to satisfy Radix accessibility.
 *
 * Note: if you already render a <SheetTitle> inside children and also pass a `title` prop,
 * you'll end up with two titles (visible + visible). Prefer one approach:
 *  - use the `title` prop for simple cases, or
 *  - include a <SheetTitle> inside children when you need custom markup.
 */
export const SheetContent = React.forwardRef<HTMLDivElement, ContentProps & { title?: React.ReactNode; side?: 'top' | 'right' | 'bottom' | 'left' }>(
  ({ className, children, side = 'right', title, ...props }, ref) => {
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={ref}
          data-slot="sheet-content"
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
            side === 'right' &&
              'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            side === 'left' &&
              'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            side === 'top' &&
              'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
            side === 'bottom' &&
              'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
            className,
          )}
          {...props}
        >
          {/* Accessibility: always render a Title for screen readers.
              If caller provided a `title` prop, render it visibly.
              Otherwise, render a visually-hidden title so SR users still get a label. */}
          {title ? (
            <SheetPrimitive.Title data-slot="sheet-title" className={cn('text-foreground font-semibold')}>
              {title}
            </SheetPrimitive.Title>
          ) : (
            <SheetPrimitive.Title className="sr-only">Dialog</SheetPrimitive.Title>
          )}

          {children}

          <SheetPrimitive.Close
            aria-label="Close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetPortal>
    )
  },
)
SheetContent.displayName = 'SheetContent'

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

export function SheetTitle({ className, ...props }: TitleProps) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

export function SheetDescription({ className, ...props }: DescriptionProps) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}
