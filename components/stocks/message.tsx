'use client'

import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (

    <div className="group relative flex flex-col bg-white w-full rounded-2xl ">
      <div className="h-[48] w-full rounded-br-2xl rounded-tl-2xl bg-[#4e426d]"></div>
      <div className="flex bg-[#4e426d] ">
        <div className="w-[15%]"></div>
        <div className="flex items-center mx-auto w-[85%] bg-white rouded-2xl rounded-bl-2xl rounded-tl-2xl pl-[8px]">
          <div className="flex size-[35px] select-none  items-center justify-center rounded-full bg-[#5C4F81]  py-[9px]">
            <IconUser />
          </div>
          <div className="ml-4 flex-1 flex space-y-2 text-black  overflow-hidden pl-2 px-[8px] py-[16px]">
            {children}
          </div>
        </div>

      </div>
      <div className="h-[48] w-full rounded-bl-2xl rounded-tr-2xl bg-[#4e426d]"></div>

    </div>
  )
}

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)

  return (
    <div className={cn('group relative flex flex-col bg-[#7F97EE]', className)}>
      <div className="flex w-full bg-[#4e426d] rounded-3xl">
        {/* Main Content Wrapper */}
        <div className="flex w-[85%] bg-[#7F97EE] rounded-br-2xl rounded-tr-2xl py-[24px]">
          {/* Icon Container */}  
          <div className="flex w-[35px] h-[35px] bg-white select-none items-center justify-center rounded-full px-[9px] py-[9px]">
            <img src="/ai.svg" alt="Custom Icon" className="w-[12px] h-[19px]" />
          </div>
          {/* Text Content Container */}
          <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 text-black">
            <MemoizedReactMarkdown
              className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return (
                    <p className="mb-2 last:mb-0 text-black text-inter text-[15.6px] leading-[26px]">
                      {children}
                    </p>
                  );
                },
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] === '▍') {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">▍</span>
                      );
                    }
                    children[0] = (children[0] as string).replace('`▍`', '▍');
                  }

                  const match = /language-(\w+)/.exec(className || '');

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ''}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  );
                },
              }}
            >
              {text}
            </MemoizedReactMarkdown>
          </div>
        </div>
        {/* Spacer or Extra Content Area */}
        <div className="w-[15%] bg-[#4e426d]"></div>
      </div>

      {/* Bottom Section with Corrected Height and Margins */}
      {/* <div className="bg-[#4e426d] h-[1px] w-full rounded-bl-2xl rounded-br-2xl rounded-tl-2xl mb-[12px]"></div> */}
    </div>

  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center bg-white rounded-full px-[8px] py-[12px]">
        <img src="/ai.svg" alt="Custom Icon" className="w-[12px] h-[19px]" />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
