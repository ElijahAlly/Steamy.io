import Link from 'next/link'
import { useContext } from 'react'
import UserContext from '~/lib/UserContext'
import { addChannel, deleteChannel } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import SearchChannelsInput from './SearchChannelsInput'
import Image from 'next/image'

export default function Layout(props) {
  const { signOut, user } = useContext(UserContext);

  // const slugify = (text) => {
  //   return text
  //     .toString()
  //     .toLowerCase()
  //     .replace(/\s+/g, '-') // Replace spaces with -
  //     .replace(/[^\w-]+/g, '') // Remove all non-word chars
  //     .replace(/--+/g, '-') // Replace multiple - with single -
  //     .replace(/^-+/, '') // Trim - from start of text
  //     .replace(/-+$/, '') // Trim - from end of text
  // }

  // const newChannel = async () => {
  //   const slug = prompt('Please enter your name')
  //   if (slug) {
  //     addChannel(slugify(slug), user.id)
  //   }
  // }

  return (
    <main className="flex flex-col md:flex-row h-full w-screen overflow-hidden">
      <nav
        className={`w-screen md:w-64 h-32 md:h-full bg-white dark:bg-slate-950 text-gray-100 overflow-scroll border-b dark:border-b-white border-b-slate-950 border-r-0 md:border-b-0 md:border-r dark:border-r-white border-r-slate-950`}
      >
        <div className="p-2 md:p-3">
          <div className="p-1 md:py-2 flex flex-row-reverse items-center md:items-start justify-between md:justify-start md:flex-col">
            <div className='flex items-end my-3'>
              <Image
                className="rounded-full mr-3"
                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/'}
                width="30"
                height="30"
                alt={user?.username + ' profile picture'}
                priority
              />
              <h6 className="text-xs">{user?.username || 'UserName'}</h6>
            </div>
            <button
              className="h-fit select-none bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-2/5 md:w-full transition duration-150"
              onClick={() => signOut()}
            >
              Log out
            </button>
          </div>
          <hr className="my-2 border-slate-950 dark:border-white" />
          <h4 className="font-bold text-slate-950 dark:text-white">Your Channels</h4>
          <ul className="">
            {props.channels.map((channel) => (
              <SidebarItem
                channel={channel}
                key={channel.id}
                isActiveChannel={x.id === props.activeChannelId}
                user={user}
              />
            ))}
            {!props.channels.length && (
              <li className="flex items-center justify-between text-sm mt-3 text-slate-950 dark:text-white">
                You have no channels, please add some channels to interact with
              </li>
            )}
          </ul>
          <SearchChannelsInput />
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
