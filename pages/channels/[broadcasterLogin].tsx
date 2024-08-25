import React, { useContext, useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import UserContext from '@/lib/UserContext'
import Sections from '@/components/Sections'
import { ParsedUrlQuery } from 'querystring'
import { ChannelFromSupabase, ChannelInformationFromTwitch } from '@/types/channel'
import { getChannelSectionsFromSupabase, getUserChannelsFromSupabase } from '@/queries/channels'
import { SectionType } from '@/types/section'

const ChannelsPage = () => {
  const router = useRouter();
  const { broadcasterLogin }: ParsedUrlQuery = router.query;
  const { user } = useContext(UserContext);
  // const messagesEndRef = useRef(null);
  const [steamyChannel, setSteamyChannel] = useState<ChannelFromSupabase | null>(null);
  const [channels, setChannels] = useState<(ChannelFromSupabase & ChannelInformationFromTwitch)[]>([]);
  const [channelSections, setChannelSections] = useState<SectionType[]>([]);

  const getChannels = async () => {
    if (!user?.supabase) return;

    const res = await getUserChannelsFromSupabase(user.supabase);
    if (!res) return;

    setSteamyChannel(res[0]);

    if (res.length === 1) {
      setChannels([]);
      router.push('/channels/' + res[0].broadcaster_login)
    } else {
      const response = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${res.slice(1).map(channel => channel.channel_id).join('&broadcaster_id=')}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.twitch.provider_token}`,
          'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
        }
      });
      const data: {[key: string]: any, data: (ChannelFromSupabase & ChannelInformationFromTwitch)[]} = await response.json();
      // console.log('channelsInfoFromTwitch', data);
      // console.log('channelsInfoFromSupabase', res);
      const channelsCombined: (ChannelFromSupabase & ChannelInformationFromTwitch)[] = data?.data?.map((channel: ChannelInformationFromTwitch, i: number) => {
        return ({
          ...channel, // channelsInfoFromSupabase
          ...res[i + 1] // channelsInfoFromTwitch
        })
      })


      setChannels(channelsCombined || []);
    }

    typeof broadcasterLogin === 'string' && await getSectionsForChannel(broadcasterLogin);
  }

  const getSectionsForChannel = async (broadcasterLogin: string) => {
    const res = await getChannelSectionsFromSupabase(broadcasterLogin);
    // console.log('getSectionsForChannel res', res);
    if (!res) return;
    setChannelSections(res);
  }

  useEffect(() => {
    getChannels();
  }, [user, broadcasterLogin])
  
  // console.log('in channel view', channels)
  // console.log('in channel view', channelSections)
  if (typeof broadcasterLogin !== 'string') return;

  // console.log(channels.length);
  return (
    <Layout
      channels={channels} 
      activeChannelBroadcasterLogin={broadcasterLogin} 
      steamyChannel={steamyChannel}
    >
      <Sections 
        channelSections={channelSections} 
        channelsLengthIsZero={channels.length === 0} 
        isOnSteamyChannel={broadcasterLogin === 'steamy'}
        />
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

export default ChannelsPage;