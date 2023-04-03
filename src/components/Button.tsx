import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AiOutlineLoading } from 'react-icons/ai'

import { cn } from '@/lib/index'

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonClasses> {
  loading?: boolean
}
export function Button(props: ButtonProps) {
  const {
    children,
    className,
    loading,
    fullWidth,
    variant,
    type = 'button',
    ...buttonProps
  } = props

  return (
    <button
      className={cn(buttonClasses({ variant, fullWidth }), className)}
      disabled={loading}
      type={type}
      {...buttonProps}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin text-xl text-inherit" />
      ) : (
        children
      )}
    </button>
  )
}

const buttonClasses = cva(
  'flex items-center justify-center font-medium rounded-lg transition-all text-sm shadow-sm py-2.5 px-6 disabled:cursor-not-allowed disabled:opacity-60 focus:ring-1 focus:ring-offset-1',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500',
        secondary:
          'text-slate-700 bg-transparent border border-slate-200 focus:ring-slate-700 hover:bg-slate-50 hover:border-slate-400',
        danger: 'bg-roman-500 text-white hover:bg-roman-600',
        transparent:
          'bg-transparent shadow-none border border-slate-300 hover:bg-slate-100',
        plain: 'p-0 shadow-none',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
  }
)
