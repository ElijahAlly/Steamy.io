import { useState, useEffect, SetStateAction } from 'react'
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { Channel } from '@/types/channel';
import { UserFromSupabase } from '@/types/user';
import { MessageType } from '@/types/message';

export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface StoreProps {
  channelId?: string | undefined;
}

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = (props: StoreProps) => {
  const [channels, setChannels] = useState<Channel[]>([])
  const [messages, setMessages] = useState<MessageType[]>([])
  const [users] = useState<Map<number, UserFromSupabase>>(new Map())
  const [newMessage, handleNewMessage] = useState<MessageType | null>(null)
  const [newChannel, handleNewChannel] = useState<Channel | null>(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<UserFromSupabase | null>(null)
  const [deletedChannel, handleDeletedChannel] = useState<Channel | null>(null)
  const [deletedMessage, handleDeletedMessage] = useState<MessageType | null>(null)

  const [channelRefs, setChannelRefs] = useState<RealtimeChannel[]>([]);

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Channels
    fetchChannels(setChannels);
    // Listen for new and deleted messages
    const messageListener = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) =>
        handleNewMessage(payload.new as MessageType)
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) =>
        handleDeletedMessage(payload.old as MessageType)
      )
      .subscribe()
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) =>
        handleNewOrUpdatedUser(payload.new as UserFromSupabase)
      )
      .subscribe()
    // Listen for new and deleted channels
    const channelListener = supabase
      .channel('public:channels')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'channels' }, (payload) =>
        handleNewChannel(payload.new as Channel)
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'channels' }, (payload) =>
        handleDeletedChannel(payload.old as Channel)
      )
      .subscribe()
    // Cleanup on unmount

    // Store channel references for cleanup
    setChannelRefs([messageListener, userListener, channelListener]);

    // Cleanup on unmount
    return () => {
      channelRefs.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [channelRefs])

  // Update when the route changes
  useEffect(() => {
    if (props.channelId && Number(props.channelId) > 0) {
      fetchMessages(props.channelId, (messages: MessageType[]) => {
        messages.forEach((message) => users.set(message.user_id, message.author))
        setMessages(messages)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelId])

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id === Number(props.channelId)) {
      const handleAsync = async () => {
        let authorId = newMessage.user_id
        if (!users.get(authorId)) await fetchUser(authorId, (user: UserFromSupabase) => handleNewOrUpdatedUser(user))
        setMessages(messages.concat(newMessage))
      }
      handleAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage])

  // Deleted message received from postgres
  useEffect(() => {
    if (deletedMessage) setMessages(messages.filter((message) => message.id !== deletedMessage.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedMessage])

  // New channel received from Postgres
  useEffect(() => {
    if (newChannel) setChannels(channels.concat(newChannel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChannel])

  // Deleted channel received from postgres
  useEffect(() => {
    if (deletedChannel) setChannels(channels.filter((channel) => channel.id !== deletedChannel.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedChannel])

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) users.set(newOrUpdatedUser.id, newOrUpdatedUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser])

  return {
    // We can export computed values here to map the authors to each message
    messages: messages.map((message) => ({ ...message, author: users.get(message.user_id) })),
    channels: channels !== null ? channels.sort((a, b) => a.slug.localeCompare(b.slug)) : [],
    users,
  }
}

/**
 * Fetch all channels
 */
export const fetchChannels = async (setState: Function) => {
  try {
    let { data } = await supabase.from('channels').select('*')
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch a single user
 */
export const fetchUser = async (userId: number, setState: Function) => {
  try {
    let { data } = await supabase.from('users').select(`*`).eq('id', userId)
    if (!data) return;
    let user = data[0]
    if (setState) setState(user)
    return user
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all messages and their authors
 */
export const fetchMessages = async (channelId: string, setState: Function) => {
  try {
    let { data } = await supabase
      .from('messages')
      .select(`*, author:user_id(*)`)
      .eq('channel_id', channelId)
      .order('inserted_at', { ascending: true })
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new channel into the DB
 */
export const addChannel = async (slug: string, user_id: number) => {
  try {
    let { data } = await supabase
      .from('channels')
      .insert([{ slug, created_by: user_id }])
      .select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new message into the DB
 */
export const addMessage = async (message: string, channel_id: number, user_id: number) => {
  try {
    let { data } = await supabase
      .from('messages')
      .insert([{ message, channel_id, user_id }])
      .select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a channel from the DB
 */
export const deleteChannel = async (channel_id: number) => {
  try {
    let { data } = await supabase.from('channels').delete().match({ id: channel_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a message from the DB
 */
export const deleteMessage = async (message_id: number) => {
  try {
    let { data } = await supabase.from('messages').delete().match({ id: message_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}