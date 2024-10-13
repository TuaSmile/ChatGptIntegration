import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
interface IFooterTextProp {
  className: string;
  isFocusedTextArea: boolean;
}
export function FooterText({ className, isFocusedTextArea }: IFooterTextProp) {
  const handleClick = () => {
    // You can handle click event if needed
    console.log('Arrow clicked!');
  };

  return (
    <p
      className={cn(
        'px-2 text-center text-[11.6px] font-normal leading-[16px] text-white',
        className,
        {
          'text-black': isFocusedTextArea,

        }
      )}
    >
      Open source AI chatbot built with <span className={cn(
        'text-white flex items-center ml-1'
      )}> Next.js<a href="#" target="_blank" rel="noopener noreferrer" className="ml-1">
          <img src="/arrow.png" alt="Next.js Icon" className="w-[7px] h-[7px] mr-1" />
        </a> </span> and <span className={cn('text-white ml-1 flex items-center')}>Vercel AI SDK <a href="https://vercel.com/templates/Next.js/nextjs-ai-chatbot" target="_blank" rel="noopener noreferrer" className="ml-1">
          <img src="/arrow.png" alt="Next.js Icon" className="w-[7px] h-[7px] mr-1" />
        </a></span>
    </p>
  )
}
