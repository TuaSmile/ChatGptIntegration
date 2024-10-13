import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [isFocusedTextArea, setIsFocusedTextArea] = React.useState(false);
  const exampleMessages = [
    {
      heading: 'I feel like shit,',
      subheading: 'I ate too much for dinner.',
      message: `Hi!`
    },
    {
      heading: 'I just yelled at my kid',
      subheading: 'because we were running late.',
      message: 'because we were running late.'
    },
    {
      heading: 'That driver just honked at me...',
      subheading: 'and it was thier fault for driving like that.',
      message: `I am so livid that driver just honked at me, and it was thier fault for driving like that.`
    },
    {
      heading: 'My boss gave me extra work?',
      subheading: `and I'm not getting paid for it.`,
      message: `My boss gave me extra work and I'm not getting paid for it.`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-customColor from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="w-full">
        <div className="mx-auto sm:max-w-3xl sm:px-4">
          <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
            {messages.length === 0 &&
              exampleMessages.map((example, index) => (
                <div
                  key={example.heading}
                  className={`cursor-pointer rounded-bl-[40px] rounded-br-[120px] rounded-tl-[120px] rounded-tr-[40px] bg-customColor-light text-white hover:bg-customColor-hover dark:hover:bg-customColor-hover px-[64px] py-[17px] ${index > 1 && 'hidden md:block'
                    }`}
                  onClick={async () => {
                    setMessages(currentMessages => [
                      ...currentMessages,
                      {
                        id: nanoid(),
                        display: <UserMessage>{example.message}</UserMessage>
                      }
                    ]);

                    const responseMessage = await submitUserMessage(example.message);

                    setMessages(currentMessages => [
                      ...currentMessages,
                      responseMessage
                    ]);
                  }}
                >
                  <div className="text-center font-inter font-semibold text-[14px] leading-[20px] text-white">{example.heading}</div>
                  <div className="text-center font-inter font-normal text-[13.5px] leading-[20px] text-white">
                    {example.subheading}
                  </div>
                </div>
              ))}
          </div>

          {messages?.length >= 2 ? (
            <div className="flex h-12 items-center justify-center">
              <div className="flex space-x-2">
                {id && title ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare className="mr-2" />
                      Share
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        messages: aiState.messages
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex">
          <div className={`flex flex-1  ${isFocusedTextArea ? 'bg-[#7F97EE]' : 'bg-customColor-light'}`}>
            <div className="h-[85%] w-full rounded-br-[20px] bg-customColor "></div>
          </div>

          <div className={`sm:w-[736px] sm:px-4 space-y-4 t px-4 py-2  sm:rounded-t-xl md:py-4 ${isFocusedTextArea ? 'bg-[#7F97EE]' : 'bg-customColor-light'}`}>
            <PromptForm input={input} setInput={setInput} isFocusedTextArea={isFocusedTextArea} setIsFocusedTextArea={setIsFocusedTextArea} />
            <FooterText className="flex hidden sm:flex justify-center" isFocusedTextArea={isFocusedTextArea} />
          </div>
          <div className={`flex flex-1  ${isFocusedTextArea ? 'bg-[#7F97EE]' : 'bg-customColor-light'}`}>
            <div className="h-[85%] w-full rounded-bl-[20px] bg-customColor"></div>
          </div>

        </div>
      </div>
    </div>
  )
}
