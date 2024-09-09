import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import UserContext from '@/lib/UserContext'
import SearchChannelsInput from './SearchChannelsInput'
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon, DragHandleDots2Icon } from '@radix-ui/react-icons'
import { ChannelFromSupabase, ChannelInformationFromTwitch } from '@/types/channel'
import SidebarChannel from './SidebarChannel'
import PersonalAccountInfoSection from './PersonalAccountInfoSection'
import { useRouter } from 'next/navigation'

interface LayoutProps {
  children: ReactNode;
  channels: (ChannelFromSupabase & ChannelInformationFromTwitch)[];
  steamyChannel: ChannelFromSupabase | null;
  activeChannelBroadcasterLogin: string;
}

export default function Layout(props: LayoutProps) {
  const maxSidebarWidth = 246;
  const minSidebarWidth = 150;
  const router = useRouter();
  const [channels, setChannels] = useState<(ChannelFromSupabase & ChannelInformationFromTwitch)[]>([]);
  const { user, getUsersId } = useContext(UserContext);
  // const [followedChannels, setFollowedChannels] = useState([]);
  const [isChannelListDropdownSelected, setIsChannelListDropdownSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [sidebarIsHidden, setSidebarIsHidden] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [curSidebarWidth, setCurSidebarWidth] = useState('w-64');
  const [startWidth, setStartWidth] = useState(maxSidebarWidth);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
      if (window.innerWidth > 767) {
        setIsChannelListDropdownSelected(false);
        setWindowWidth(window.innerWidth);
      }
      if (window.innerWidth < 768 && windowWidth > 767) {
        handleOpenSidebar();
        setWindowWidth(window.innerWidth);
      }
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, [windowWidth]);

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
  
  const handleMouseMove = (e: MouseEvent) => {
    const sidenav = document.getElementById('sidenav') as HTMLElement;
    if (!isResizing || !sidenav) return;

    const deltaX = e.clientX - startX;
    const newWidth = startWidth + deltaX;
    setStartX(newWidth);

    const maxWidth = window.innerWidth;

    if (newWidth < minSidebarWidth) {
      setSidebarIsHidden(true);
      setIsResizing(false);
      setCurSidebarWidth('max-w-0');
    }

    if (newWidth <= maxWidth) {
      sidenav.style.width = `${newWidth}px`;
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  const handleOpenSidebar = () => {
    /* 
      TODO: This will not open the sidebar completely. 
      It opens but not fully. 
      Unless I do min-w-64, but then I can't drag the sidebar. 
      I tried immediatel setting it back to w-64 but that hasn't work either.
      ! I am refreshing the page to open the sidebar for now... not good :(
    */
    // setSidebarIsHidden(false);
    // setStartX(maxSidebarWidth);
    // setCurSidebarWidth('w-64');
    router.refresh();
  }

  const handleResizeStart = () => {
    const resizeHandle = document.getElementById('resize-handle') as HTMLElement;
    const sidenav = document.getElementById('sidenav') as HTMLElement;
    if (!resizeHandle || !sidenav) return;

    resizeHandle.addEventListener('mousedown', (e) => {
      // console.log(e.clientX);
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(sidenav.offsetWidth);
    });
  }

  useEffect(() => {
    handleResizeStart();
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [sidebarIsHidden, isResizing])

  useEffect(() => {
    getChannelsFollowed();
    const sidenav = document.getElementById('sidenav') as HTMLElement;
    setStartWidth(sidenav?.offsetWidth || maxSidebarWidth)
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
      <ul className={`${isChannelListDropdownSelected ? 'flex flex-col bg-slate-950 border border-white rounded-md max-h-72 overflow-y-auto p-2' : `hidden md:h-96 md:flex md:flex-col md:overflow-y-auto rounded-md ${channels.length > 3 ? 'shadow-slate-800 shadow-lg p-1' : ''}`}`}>
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
        {channels.map((channel, i) => (
          <SidebarChannel
            channels={ channels }
            channel={ channel }
            steamyChannel={null}
            key={i}
            isActiveChannel={channel.broadcaster_login === props.activeChannelBroadcasterLogin}
            user={ user }
            getUsersId={getUsersId}
          />
        ))}
        {!channels.length && (
          <li className='flex items-center justify-between text-sm m-3 text-slate-950 dark:text-white'>
            Add channels
          </li>
        )}
      </ul>
    )
  }

  return (
    <main className="relative flex flex-col md:flex-row h-full w-full overflow-hidden pb-9 md:pb-0 md:px-0">
      <nav
        id='sidenav'
        className={`relative w-screen ${'md:' + curSidebarWidth} md:max-w-64 h-fit md:h-full bg-white dark:bg-slate-950 text-gray-100 border-r-0 md:border-b-0 md:border-r dark:border-r-white border-r-slate-950`}
      >
        {!sidebarIsHidden && (
          <div className="w-full p-2 pb-0 md:p-3 md:pb-0">
            <div className="w-full relative p-1 md:py-2 flex flex-row items-center md:items-start justify-between md:justify-start md:flex-col">
              <PersonalAccountInfoSection />

              {/* Small screen Channels list */ }
              <div className='px-3 z-30'>
                <div
                  className={ `max-w-fit max-h-fit flex flex-col items-center justify-between py-1 px-3 md:hidden border border-slate-950 dark:border-white ${isChannelListDropdownSelected ? 'rounded-t-md' : 'rounded-md'} bg-inherit hover:bg-slate-100 hover:dark:bg-slate-900` }
                  onClick={ handleViewChannelsClick }
                  ref={ buttonRef }
                >
                  <div className='max-h-16 w-fit flex items-center'>
                    <p className='select-none h-full mr-3 py-1 flex items-center justify-center text-md text-slate-950 dark:text-white bg-slate-950'>
                      Your Channels
                    </p>
                    <ArrowDownIcon className={ `${isChannelListDropdownSelected ? 'hidden' : 'block'} text-slate-950 dark:text-white` } />
                    <ArrowUpIcon className={ `${isChannelListDropdownSelected ? 'block' : 'hidden'} text-slate-950 dark:text-white` } />
                  </div>
                  <div className='absolute top-14 right-3 shadow-lg shadow-slate-800'>
                    {getChannelsSearch()}
                    {getChannels()}
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-2 md:mb-2 w-full border-slate-950 dark:border-white" />

            {/* Big screen Channels list */}
            <h4 className="hidden mt-6 md:block font-bold text-slate-950 dark:text-white select-none">Your Channels</h4>
            <div className='h-fit hidden md:block'>
              {getChannelsSearch()}
              {getChannels()}
            </div>
          </div>
        )}
        <div id='resize-handle' className={`hidden md:flex items-center absolute top-1/2 translate-y-1/2 border-r border-b border-t rounded-r-md py-3 border-white ${sidebarIsHidden ? 'cursor-pointer bg-cyan-300 w-4 -right-4 z-50 font-bold' : 'cursor-ew-resize bg-slate-950 w-3 -right-3'}`}>
          {sidebarIsHidden ? (
            <ChevronRightIcon onClick={handleOpenSidebar} className='text-slate-950' />
          ) : (
            <DragHandleDots2Icon />
          )}
        </div>
      </nav>

      {/* Channel Sections */}
      <div className="flex-1 bg-white dark:bg-slate-950 h-full w-full md:w-3/5 px-3 md:px-2">{props.children}</div>
    </main>
  )
}