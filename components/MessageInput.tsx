import { PaperPlaneIcon } from '@radix-ui/react-icons'
import React, { useEffect, useRef, useState } from 'react'

interface MessageInputProps {
  onSubmit: (message: string) => null;
}

const MessageInput = ({ onSubmit }: MessageInputProps) => {
  const [messageText, setMessageText] = useState('')
  const [isValidMessage, setIsValidMessage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: any) => {
    const lines = e?.target?.value.split('\n').length;

    if (lines <= 3 || e?.nativeEvent?.inputType === "deleteContentBackward") {
      setMessageText(e?.target?.value || '');
    }
  };

  const checkIsValidMessage = () => {
    setIsValidMessage(messageText.length > 0 
      && !messageText.split(' ').every(char => char === ' ' || char === '\n' || char === '\n\n')
    );
  }

  const submitOnEnter = (event: any) => {
    if (!event) return;
    // Check for Shift + Enter to add a new line
    if (event.key === 'Enter' && event.shiftKey) {
      return; // Allow the default behavior for Shift + Enter (new line)
    }
    
    // Watch for Enter key without Shift
    if (event.key === 'Enter' && !event.shiftKey && isValidMessage) {
      event.preventDefault(); // Prevent the default Enter behavior (new line)
      onSubmit(messageText);
      setMessageText('');
    }
  }

  useEffect(() => {
    checkIsValidMessage();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [messageText]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={`h-fit select-none appearance-none border ${isValidMessage ? 'shadow-sm border-cyan-500 shadow-cyan-700 focus:shadow-cyan-700 focus:shadow-md' : 'shadow-sm shadow-slate-600 focus:shadow-slate-600 focus:shadow-md border-slate-500 dark:border-white'} rounded w-full py-2 pl-3 pr-8 dark:text-white dark:bg-slate-950 text-slate-950 bg-white leading-tight resize-none focus:outline-none`}
        placeholder="Send a chat (Shift+Enter for new line)"
        value={messageText}
        onChange={handleInputChange}
        onKeyDown={submitOnEnter}
        maxLength={300}
        rows={1}
      />
      <PaperPlaneIcon className={`absolute right-3 bottom-4 ${isValidMessage ? 'text-cyan-500' : 'text-slate-500 dark:text-white'} -rotate-45`} />
    </div>
  )
}

export default MessageInput
