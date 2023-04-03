import { cx, type CxOptions } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs))
}

export function getInitials(name: string) {
  if (!name) return

  const initials = name
    .split(' ')
    .map(name => name[0])
    .join('')

  return initials.length > 1 ? initials.substring(0, 2) : initials
}
