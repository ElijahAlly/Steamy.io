import Link from 'next/link'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { addChannel, deleteChannel } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import SearchChannelsInput from './SearchChannelsInput'
import Image from 'next/image'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'

export default function Layout(props) {
  const { signOut, user, getUsersProfilePicture, getUsersUsername, getUsersId } = useContext(UserContext);
  const [followedChannels, setFollowedChannels] = useState([]);
  const [isChannelListDropdownSelected, setIsChannelListDropdownSelected] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleViewChannelsClick = (e) => {
    e.stopPropagation();
    setIsChannelListDropdownSelected(prev => !prev);
  };

  const handleClickOutside = (e) => {
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
    const response = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${getUsersId()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user?.provider_token}`,
        'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
      }
    });
    const data = await response.json();
    console.log('followed data', data);
    // setFollowedChannels(data.data)
  }

  useEffect(() => {
    getChannelsFollowed();
  }, [])

  const getChannelsList = () => {
    return (
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-5/6 md:w-full bg-white dark:bg-slate-950 md:bg-inherit py-6 border md:border-none border-slate-950 dark:border-white rounded-md 
          ${isChannelListDropdownSelected
            ? 'absolute top-16 right-3 flex flex-col shadow-lg shadow-slate-800 pt-3 px-3' 
            : 'hidden md:relative md:flex md:flex-col border-t'
          }
        `}
      >
        <SearchChannelsInput user={user} />
        <ul>
          { props.channels.map((channel) => (
            <SidebarItem
              channel={ channel }
              key={ channel.id }
              isActiveChannel={ channel.id === props.activeChannelId }
              user={ user }
              getUsersId={getUsersId}
            />
          )) }
        </ul>
      </div>
    );
  }

  return (
    <main className="relative flex flex-col md:flex-row h-full w-screen overflow-hidden pb-9 md:pb-0">
      <nav
        className={`w-screen md:w-64 h-fit md:h-full bg-white dark:bg-slate-950 text-gray-100 overflow-scroll border-r-0 md:border-b-0 md:border-r dark:border-r-white border-r-slate-950`}
      >
        <div className="p-2 md:p-3">
          <div className="p-1 md:py-2 flex flex-row items-center md:items-start justify-between md:justify-start md:flex-col">
            <button
              className="hidden md:block min-w-fit h-fit select-none bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-2/5 md:w-full transition duration-150"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Logout
            </button>
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
            <div className='px-3'>
              <div
                className={ `w-full flex items-center justify-between py-1 px-3 md:hidden border border-slate-950 dark:border-white ${isChannelListDropdownSelected ? 'rounded-t-md' : 'rounded-md'} bg-inherit hover:bg-slate-100 hover:dark:bg-slate-900` }
                onClick={ handleViewChannelsClick }
                ref={ buttonRef }
              >
                <p className='h-9 flex items-center justify-center text-md text-slate-950 dark:text-white'>
                  View Your Channels
                </p>
                <ArrowDownIcon className={ `${isChannelListDropdownSelected ? 'hidden' : 'block'} text-slate-950 dark:text-white` } />
                <ArrowUpIcon className={ `${isChannelListDropdownSelected ? 'block' : 'hidden'} text-slate-950 dark:text-white` } />
                { getChannelsList() }
              </div>
            </div>
          </div>
          <hr className="my-2 w-full border-slate-950 dark:border-white" />
          {/* Big screen Channels list */}
          <h4 className="hidden md:block font-bold text-slate-950 dark:text-white">Your Channels</h4>
          <div className='hidden md:block'>
            {!props.channels.length && (
              <li className='flex items-center justify-between text-sm mt-3 text-slate-950 dark:text-white'>
                You have no channels
              </li>
            )}
            {getChannelsList()}
          </div>
        </div>
      </nav>
      <div className="flex-1 bg-white dark:bg-slate-950 h-full">{props.children}</div>
    </main>
  )
}

const SidebarItem = ({ channel, isActiveChannel, user, getUsersId }) => (
  <>
    <li className="flex items-center justify-between">
      <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
        <a className={`text-slate-950 dark:text-white ${isActiveChannel ? 'font-bold' : ''}`}>{channel.slug}</a>
      </Link>
      {channel.id !== 1 && (channel.created_by === getUsersId() || user?.appRole === 'admin') && (
        <button onClick={() => deleteChannel(channel.id)}>
          <TrashIcon />
        </button>
      )}
    </li>
  </>
)
