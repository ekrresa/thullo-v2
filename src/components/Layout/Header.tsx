import * as React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { CiSearch } from 'react-icons/ci'

import { useAuth } from '@/modules/user/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import MobileLogo from '@/public/logo-small.svg'
import Logo from '@/public/logo.svg'
import { Button } from '../Button'
import { Input } from '../Input'

export function Header() {
  const isAuthed = useAuth()

  return (
    <header className="mb-1 bg-white p-4 shadow-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
        <Link href={ROUTES.home}>
          <Logo className="hidden w-28 md:inline-block" />
          <MobileLogo className="w-8 md:hidden" />
        </Link>

        <form className="flex max-w-2xl flex-1 overflow-hidden rounded-md border border-slate-300 transition-all focus-within:ring-1 focus-within:ring-brand-500 focus-within:ring-offset-1 hover:border-slate-400">
          <Input
            label=""
            containerClassName="flex-1 focus:ring-0"
            className="min-w-0 border-0 outline-none placeholder:opacity-60 focus:ring-0"
            placeholder="Search for boards..."
            labelHidden
          />
          <Button className="rounded-none border-l border-inherit px-2" variant="plain">
            <CiSearch className="text-2xl" />
          </Button>
        </form>

        {!isAuthed ? (
          <Link href={ROUTES.auth} className="rounded-md py-1.5 px-4 text-xs uppercase">
            Sign in
          </Link>
        ) : (
          <Button onClick={() => signOut()}>Log out</Button>
        )}
      </div>
    </header>
  )
}
