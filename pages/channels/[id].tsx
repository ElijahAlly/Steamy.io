import React, { useContext, useEffect, useRef } from 'react'
import Layout from '@/components/Layout'
import Message from '@/components/Message'
import MessageInput from '@/components/MessageInput'
import { useRouter } from 'next/router'
import { useStore, addMessage } from '@/lib/Store'
import UserContext from '@/lib/UserContext'
import { MessageType } from '@/types/message'
import Sections from '@/components/Sections'

const ChannelsPage = () => {
  const router = useRouter()
  const { getUsersId } = useContext(UserContext)
  const messagesEndRef = useRef(null)

  // Else load up the page
  const { id } = router.query
  const channelId = (id && id instanceof Array) ? id.join('') : (id || '');
  // const { messages, channels } = useStore({ channelId })

  // redirect to public channel when current channel is deleted
  // useEffect(() => {
  //   if (!channels.some((channel) => channel.id === Number(channelId))) {
  //     router.push('/channels/1')
  //   }
  // }, [channels, channelId])

  // Render the channels and messages
  return (
    <Layout channels={[]} activeChannelId={channelId}>
      <Sections />
      {/* <div className="h-fit pb-16">
        <div className="p-2 overflow-y-auto">
          { messages.map((message) => (
            <Message key={ message.id} message={message as MessageType} />
          ))}
          <div ref={messagesEndRef} style={{ height: 0 }} />
        </div>
      </div>
      <div className="p-2 absolute bottom-0 left-0 w-full">
        <MessageInput onSubmit={async (text: string) => addMessage(text, Number(channelId), Number(getUsersId()))} />
      </div> */}
    </Layout>
  )
}

export default ChannelsPage
