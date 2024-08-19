import React, { useContext } from 'react'
import UserContext from '@/lib/UserContext'
import { deleteMessage } from '@/lib/Store'
import TrashIcon from './TrashIcon'
import { MessageType } from '@/types/message';

interface MessageProps {
  message: MessageType;
}

const MessageComponent = ({ message }: MessageProps) => {
  const { user, getUsersId } = useContext(UserContext)

  return (
    <div className="py-1 flex items-center space-x-2">
      <div className="text-gray-100 w-4">
        {(getUsersId() === `${message.user_id}` || ['admin', 'moderator'].includes(user?.appRole || '')) && (
          <button onClick={() => deleteMessage(message.id)}>
            <TrashIcon />
          </button>
        )}
      </div>
      <div>
        <p className="text-blue-700 font-bold">{message?.author?.full_name}</p>
        <p className="text-white">{message.message}</p>
      </div>
    </div>
  )
}

export default MessageComponent;