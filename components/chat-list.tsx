import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export interface ChatList {
  messages: UIState
  session?: Session
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className=" sm:w-[736px] justify-center items-center">
      {!isShared && !session ? (
        <>
          <div className="flex justify-center  items-center mb-4  pb-[44px]">
            <div className="flex justify-center items-center bg-gradient-to-r from-[#F4772F] to-[#E71B5B] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)  size-[25px]  rounded-md ">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-4 flex space-y-2 overflow-hidden px-1">
              <p className="flex items-center text-white text-[14px] text-inter leading-[14px] font-bold">
                Please{' '}
                <Link href="/login" className="underline ml-1 mr-1">
                  log in
                </Link>{' '}
                or{' '}
                <Link href="/signup" className="underline ml-1 mr-1">
                  sign up
                </Link>{' '}
                to save and revisit your chat history!
              </p>
            </div>
          </div>
          {/* <Separator className="my-4" /> */}
        </>
      ) : null}
      <div className="bg-[#7F97EE] rounded-2xl px-[8px] py-[10px]">
        {/* Scrollable Content Wrapper */}
        <div className="max-h-[400px]  rounded-2xl overflow-y-auto scrollbar-hide">
          {messages.map((message, index) => (
            <div key={message.id} className="flex flex-col w-full bg-white rounded-2xl">
              {message.display}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
