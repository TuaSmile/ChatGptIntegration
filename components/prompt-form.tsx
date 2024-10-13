'use client'

import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'

import { useActions, useUIState, useAIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus, IconMicrophone } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { createAudioFileFromText } from '@/lib/text-to-speech'

// Declare SpeechRecognition types globally
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function PromptForm({
  input,
  isFocusedTextArea,
  setInput,
  setIsFocusedTextArea
}: {
  input: string;
  isFocusedTextArea: boolean;
  setInput: (value: string) => void
  setIsFocusedTextArea: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [aiState] = useAIState()

  // Using 'any' as the type for recognitionRef to bypass TypeScript issues
  const recognitionRef = useRef<any>(null)
  const audioElem = useRef<HTMLAudioElement>(null)
  const [isListening, setIsListening] = useState(false) // State to track whether the mic is listening
  const [speakOn, setSpeakOn] = useState<boolean>(false)

  const useOutTextAreaAlerter = (ref: React.RefObject<any>) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsFocusedTextArea(false);
        } else {
          setIsFocusedTextArea(true);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  useOutTextAreaAlerter(inputRef);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Initialize Speech Recognition (Web Speech API)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false) // Stop listening once we get a result
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [setInput])

  useEffect(() => {
    const lastMessage = aiState.messages[aiState.messages.length - 1]
    if (lastMessage?.role === 'assistant') {
      generateAudio(lastMessage.content)
    }
  }, [aiState.messages])

  // Toggle voice input on button press
  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        recognitionRef.current.start()
        setIsListening(true)
      }
    }
  }

  const handleSpeak = () => {
    setSpeakOn(!speakOn)
  }

  const generateAudio = async (text: string) => {
    if (!speakOn) return
    try {
      const audioBase64 = await createAudioFileFromText(text)
      playAudio(audioBase64)
    } catch (error) {
      console.error('Error generating audio:', error)
    }
  }

  const playAudio = (audioBase64: string) => {
    if (audioBase64) {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      )
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioElem.current) {
        audioElem.current.src = audioUrl
        audioElem.current.play()
      }
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-white px-8 sm:rounded-md border border-customBorder sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-customIcon p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white">New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm text-[#9ca4b7]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-gradient-to-b from-[#224158] to-[#0E2A3D] shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]"
                onClick={handleVoiceInput}
              >
                <IconMicrophone />
                <span className="sr-only">Voice Input</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white">Voice Input</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-gradient-to-b from-[#224158] to-[#0E2A3D] shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]"
                onClick={handleSpeak}
              >
                {speakOn ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
                <span className="sr-only">Sound {speakOn ? 'On' : 'Off'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white">Sound {speakOn ? 'On' : 'Off'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" className="bg-[#FAFAFA] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.4)]" disabled={input === ''}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {speakOn && <audio ref={audioElem} />}
    </form>
  )
}
