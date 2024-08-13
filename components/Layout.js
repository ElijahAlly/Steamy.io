import Link from 'next/link'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { addChannel, deleteChannel } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import SearchChannelsInput from './SearchChannelsInput'
import Image from 'next/image'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'

export default function Layout(props) {
  const { signOut, user } = useContext(UserContext);
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

  const getChannelsList = () => {
    return (
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-inherit py-6 px-3 border md:border-none border-slate-950 dark:border-white rounded-md 
          ${isChannelListDropdownSelected 
            ? 'absolute top-16 right-0 flex flex-col shadow-lg shadow-slate-800 pt-3' 
            : 'hidden md:relative md:flex md:flex-col border-t'
          }
        `}
      >
        <SearchChannelsInput />
        <ul>
          { props.channels.map((channel) => (
            <SidebarItem
              channel={ channel }
              key={ channel.id }
              isActiveChannel={ x.id === props.activeChannelId }
              user={ user }
            />
          )) }
          { !props.channels.length && (
            <li className='flex items-center justify-between text-sm mt-3 text-slate-950 dark:text-white'>
              You have no channels, please add some channels to interact with
            </li>
          ) }
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
              onClick={ () => signOut() }
            >
              Log out
            </button>
            <div className='flex flex-col mt-0 md:mt-6'>
              <Image
                className="rounded-full border border-slate-500 p-1 mb-2"
                src={user?.user_metadata?.avatar_url 
                  || user?.user_metadata?.picture 
                  || '/images/user-icon-96-white.png'
                }
                width="36"
                height="36"
                alt={user?.username + ' profile picture'}
                priority
              />
              <h6 className="text-xs text-slate-950 dark:text-white">{user?.username || 'UserName'}</h6>
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
            {getChannelsList()}
          </div>
        </div>
      </nav>
      <div className="flex-1 bg-white dark:bg-slate-950 h-full">{props.children}</div>
    </main>
  )
}

const SidebarItem = ({ channel, isActiveChannel, user }) => (
  <>
    <li className="flex items-center justify-between">
      <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
        <a className={isActiveChannel ? 'font-bold' : ''}>{channel.slug}</a>
      </Link>
      {channel.id !== 1 && (channel.created_by === user?.id || user?.appRole === 'admin') && (
        <button onClick={() => deleteChannel(channel.id)}>
          <TrashIcon />
        </button>
      )}
    </li>
  </>
)
