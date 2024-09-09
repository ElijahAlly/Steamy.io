import { removeChannelFromUserSupabase } from "@/queries/channels";
import { ChannelFromSupabase, ChannelInformationFromTwitch } from "@/types/channel";
import { UserTypeForSteamy } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import TrashIcon from "./TrashIcon";
import { formatDescription } from "@/util/text";

interface SidebarChannelProps {
  channels: (ChannelFromSupabase | ChannelInformationFromTwitch)[];
  channel: ChannelFromSupabase & ChannelInformationFromTwitch | null;
  steamyChannel: ChannelFromSupabase | null;
  isActiveChannel: boolean;
  user: UserTypeForSteamy | null;
  getUsersId: Function;
}

const SidebarChannel = ({ steamyChannel, channel, channels, isActiveChannel, user, getUsersId }: SidebarChannelProps) => {
    if (!channel && !steamyChannel) return <></>;
    // console.log('SidebarItem', channel)

    const handleChannelDelete = async () => {
        try {
            user?.supabase?.id && await removeChannelFromUserSupabase(user, channel?.broadcaster_login || '')
            if (isActiveChannel) { 
                if (channels[0]?.broadcaster_login) {
                    window.location.href = '/channels/' + channels[0].broadcaster_login; 
                } else if (steamyChannel) { // should always be a steamy channel, it should not be deleted (it is where the updates and new releases are located)
                    window.location.href = '/channels/' + steamyChannel.broadcaster_login; 
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {!steamyChannel && <hr className='my-2 opacity-30' />}
            <Link
                href="/channels/[broadcasterLogin]" 
                as={`/channels/${channel?.broadcaster_login || steamyChannel?.broadcaster_login}`} 
                passHref
                className='hover:border-cyan-500 border border-transparent rounded-md select-none'
            >
                <li className="flex justify-between items-center p-2">
                    <div className='flex items-center'>
                        <Image
                            className="rounded-full border mr-2"
                            src={channel?.thumbnail_url || steamyChannel?.thumbnail_url || ''}
                            width="36"
                            height="36"
                            alt={(channel?.broadcaster_login || steamyChannel?.broadcaster_login) + ' profile picture'}
                            priority
                        />
                        <p
                            className={`text-slate-950 dark:text-white ${isActiveChannel ? 'font-semibold dark:text-cyan-500' : ''}`}
                        >
                            {formatDescription(channel?.broadcaster_login || steamyChannel?.broadcaster_login || '', 15)}
                        </p>
                    </div>
                    {isActiveChannel && !steamyChannel && (
                        <button
                            className='hover:text-red-500'
                            onClick={handleChannelDelete}
                        >
                            <TrashIcon />
                        </button>
                    )}
                </li>
            </Link>
        </>
    )
}

export default SidebarChannel;