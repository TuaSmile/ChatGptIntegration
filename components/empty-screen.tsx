import { UseChatHelpers } from 'ai/react'


export function EmptyScreen() {
  return (
    <div className="flex mx-auto max-w-4xl px-4">
      <div className="flex items-center w-[36px] ">
        <img src="/circle.png" alt="welcome unblend.me logo" className="w-[10px] h-[10px]" />
      </div>
      <div className="flex w-[36px]">
        <img src="/circle.png" alt="welcome unblend.me logo" className="w-[20px] h-[20px]" />
      </div>
      <div className="flex flex-row gap-6 rounded-bl-[200px] rounded-br-[40px] rounded-tl-[40px] rounded-tr-[200px] bg-white px-[111px] py-[33px] shadow-[0_13px_28px_rgba(0,0,0,0.11) shadow-[0_51px_51px_rgba(0,0,0,0.09)]">
        <img src="/welcome-logo.png" alt="welcome unblend.me logo" className="w-[56px] h-[92px]" />
        <div className="flex flex-col gap-2">
          <h1 className="font-inter font-semibold text-[20px] leading-[28px] text-customTextColor">
            Welcome to unblend.me!
          </h1>
          <p className="font-inter font-normal text-[15.5px] leading-[24px] text-customTextColor">
            This is an AI chatbot specialized in listening to you.
          </p>
          <p className="font-inter font-normal text-[15.5px] leading-[24px] text-customTextColor">
            Enable your browser microphone to speak to us.
          </p>
        </div>

      </div>
      <div className="flex justify-end items-end w-[46px] ">
        <img src="/circle.png" alt="welcome unblend.me logo" className="w-[30px] h-[30px]" />
      </div>
      <div className="flex justify-end items-center w-[36px] ">
        <img src="/circle.png" alt="welcome unblend.me logo" className="w-[20px] h-[20px]" />
      </div>
    </div>

  )
}
