import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Session } from '@/lib/types'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <div className="flex justify-between w-full">
      <div className="flex rounded-bl-[20px] rounded-br-[20px] bg-customColor-light px-[20px] py-[10px]">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="unblend.me logo" className="w-[13px] h-[20px]" />
          <span className="text-white text-[20px] font-inknut font-medium leading-[20px]">unblend.me</span>
        </Link>
      </div>
      <div className="flex-1">
        <div className="h-[35%] bg-customColor-light"></div>
        <div className="h-[30%] bg-customColor-light">
          <div className="h-full rounded-tl-[20px] rounded-tr-[20px] bg-customColor"></div>
        </div>
        <div className="h-[35%]"></div>
      </div>
      {session?.user ? (
        <div className="rounded-bl-[20px] rounded-br-[20px] bg-customColor-light pl-[20px] pr-[20px]  pt-[10px] pb-[10px]">
          <Button variant="link" asChild className="-ml-2">
            <Link href="/profile">Profile</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-bl-[20px] rounded-br-[20px] bg-customColor-light pl-[20px] pr-[20px]  pt-[10px] pb-[10px]">
          <Button variant="link" asChild className="-ml-2 text-white">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full bg-customColor text-white ">
      <div className="flex items-center justify-between w-full">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  )
}
