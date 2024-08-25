import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import UserContext from '@/lib/UserContext'
import TrashIcon from './TrashIcon'
import SearchChannelsInput from './SearchChannelsInput'
import Image from 'next/image'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { ChannelFromSupabase, ChannelInformationFromTwitch } from '@/types/channel'
import { UserTypeForSteamy } from '@/types/user'
import { useRouter } from 'next/navigation'
import { removeChannelFromUserSupabase } from '@/queries/channels'
import SidebarChannel from './SidebarChannel'

interface LayoutProps {
  children: ReactNode;
  channels: (ChannelFromSupabase & ChannelInformationFromTwitch)[];
  steamyChannel: ChannelFromSupabase | null;
  activeChannelBroadcasterLogin: string;
}

export default function Layout(props: LayoutProps) {
  const [channels, setChannels] = useState<(ChannelFromSupabase & ChannelInformationFromTwitch)[]>([]);
  const { signOut, user, getUsersProfilePicture, getUsersUsername, getUsersId, getProviderId } = useContext(UserContext);
  // const [followedChannels, setFollowedChannels] = useState([]);
  const [isChannelListDropdownSelected, setIsChannelListDropdownSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleViewChannelsClick = (e: any) => {
    e.stopPropagation();
    setIsChannelListDropdownSelected(prev => !prev);
  };

  const handleClickOutside = (e: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsChannelListDropdownSelected(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) setIsChannelListDropdownSelected(false);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const getChannelsFollowed = async () => {
    // const response = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${getProviderId()}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${user?.twitch?.provider_token}`,
    //     'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
    //   }
    // });
    // const data = await response.json();
    // console.log('followed data', data);
    // setFollowedChannels(data.data)
  }

  useEffect(() => {
    getChannelsFollowed();
  }, [])

  useEffect(() => {
    setChannels(props.channels)
  }, [props.channels])

  const getChannelsSearch = () => {
    return (
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative h-fit w-full bg-white dark:bg-slate-950 md:bg-inherit py-6 border md:border-none border-slate-950 dark:border-white rounded-md 
          ${isChannelListDropdownSelected
            ? 'flex flex-col pt-3 px-3' 
            : 'hidden md:relative md:flex md:flex-col border-t'
          }
        `}
      >
        <SearchChannelsInput user={user} />
      </div>
    );
  }

  const getChannels = () => {
    return (
      <ul className={`${isChannelListDropdownSelected ? 'flex flex-col bg-slate-950 border border-white rounded-md max-h-72 overflow-y-auto' : 'hidden md:flex md:flex-col'}`}>
        {props.steamyChannel && (
          <SidebarChannel
            channel={null}
            steamyChannel={props.steamyChannel}
            channels={ channels }
            isActiveChannel={props.steamyChannel.broadcaster_login === props.activeChannelBroadcasterLogin}
            user={ user }
            getUsersId={getUsersId}
          />
        )}
        { channels.map((channel, i) => (
          <SidebarChannel
            channels={ channels }
            channel={ channel }
            steamyChannel={null}
            key={i}
            isActiveChannel={channel.broadcaster_login === props.activeChannelBroadcasterLogin}
            user={ user }
            getUsersId={getUsersId}
          />
        )) }
        {!channels.length && (
          <li className='flex items-center justify-between text-sm mt-3 text-slate-950 dark:text-white'>
            You have no channels
          </li>
        )}
      </ul>
    )
  }

  return (
    <main className="relative flex flex-col md:flex-row h-full w-full overflow-hidden pb-9 md:pb-0 md:px-0">
      <nav
        className={`w-screen md:w-64 md:min-w-64 h-fit md:h-full bg-white dark:bg-slate-950 text-gray-100 border-r-0 md:border-b-0 md:border-r dark:border-r-white border-r-slate-950`}
      >
        <div className="p-2 pb-0 md:p-3 md:pb-0">
          <div className="relative p-1 md:py-2 flex flex-row items-center md:items-start justify-between md:justify-start md:flex-col">
            <button
              className="hidden md:block min-w-fit h-fit select-none bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-2/5 md:w-full transition duration-150"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Logout
            </button>

            {/* Current User's Channel */}
            <div className='flex flex-col mt-0 md:mt-6'>
              <Image
                className="rounded-full border mb-2"
                src={getUsersProfilePicture()}
                width="36"
                height="36"
                alt={getUsersUsername() + ' profile picture'}
                priority
              />
              <h6 className="text-xs text-slate-950 dark:text-white">{getUsersUsername()}</h6>
            </div>

            {/* Small screen Channels list */ }
            <div className='px-3 z-30'>
              <div
                className={ `max-w-fit max-h-fit flex flex-col items-center justify-between py-1 px-3 md:hidden border border-slate-950 dark:border-white ${isChannelListDropdownSelected ? 'rounded-t-md' : 'rounded-md'} bg-inherit hover:bg-slate-100 hover:dark:bg-slate-900` }
                onClick={ handleViewChannelsClick }
                ref={ buttonRef }
              >
                <div className='max-h-16 w-fit flex items-center'>
                  <p className='h-full mr-3 flex items-center justify-center text-md text-slate-950 dark:text-white bg-slate-950'>
                    Your Channels
                  </p>
                  <ArrowDownIcon className={ `${isChannelListDropdownSelected ? 'hidden' : 'block'} text-slate-950 dark:text-white` } />
                  <ArrowUpIcon className={ `${isChannelListDropdownSelected ? 'block' : 'hidden'} text-slate-950 dark:text-white` } />
                </div>
                <div className='absolute top-12 right-3 shadow-lg shadow-slate-800'>
                  {getChannelsSearch()}
                  {getChannels()}
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-2 md:mb-2 w-full border-slate-950 dark:border-white" />

          {/* Big screen Channels list */}
          <h4 className="hidden mt-6 md:block font-bold text-slate-950 dark:text-white">Your Channels</h4>
          <div className='h-fit hidden md:block'>
            {getChannelsSearch()}
            {getChannels()}
          </div>
        </div>
      </nav>

      {/* Channel Sections */}
      <div className="flex-1 bg-white dark:bg-slate-950 h-full w-full md:w-3/5 px-3 md:px-2">{props.children}</div>
    </main>
  )
}