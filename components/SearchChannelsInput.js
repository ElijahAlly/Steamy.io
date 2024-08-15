import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { formatDescription } from "~/util/text";

const SearchChannelsInput = ({ user }) => {
    const [addChannelText, setAddChannelText] = useState('');
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const fetchChannels = async (query) => {
        if (!query || !user?.provider_token) return;
        setIsLoading(true);

        try {
            // const res = await fetch('https://id.twitch.tv/oauth2/validate', {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${user?.provider_token}`
            //     }
            // });
            // const valRes = await res.json();
            // {
            //     client_id: "98q4f2hye67zupp3808gi087k0oey9"
            //     expires_in: 15250
            //     login: "mansaelijahmusa"
            //     scopes: ['user:read:email']
            //     user_id: "1061626664"
            // }

            const response = await fetch(`https://api.twitch.tv/helix/search/channels?query=${encodeURI(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user?.provider_token}`,
                    'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
                }
            });
            const data = await response.json();

            setChannels(data.data); 
        } catch (error) {
            console.error('Error fetching Twitch channels:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        if (!e.target.value || e.target.value.split('').every(char => char === ' ')) {
            setAddChannelText('');
            setChannels([]);
        } else {
            setAddChannelText(e.target.value);
            fetchChannels(e.target.value);
        }
    };

    return (
        <div className="relative flex flex-col my-0 md:my-1">
            <div className="relative">
                <input
                    className="shadow-sm appearance-none border border-slate-950 dark:border-white rounded w-full py-2 pl-10 pr-3 dark:text-white dark:bg-slate-950 text-slate-500 bg-white leading-tight focus-shadow-md focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Add Twitch channel"
                    value={addChannelText}
                    onChange={handleInputChange}
                    onKeyDown={() => null}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-white" />
            </div>

            {isFocused && isLoading && <p className="text-center mt-2 text-slate-500 dark:text-white">Loading...</p>}

            {isFocused && channels.length > 0 && (
                <div className='w-full md:w-full h-96 overflow-hidden'>
                    <ul className="absolute top-12 left-0 w-full h-96 overflow-y-scroll bg-white dark:bg-slate-950 border border-slate-950 dark:border-white rounded shadow-lg z-10">
                        {channels.map((channel) => (
                            <li key={channel?.id} className="flex px-2 py-4 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                <Image
                                    className="rounded-full border border-slate-500 p-1 mr-2"
                                    src={channel?.thumbnail_url
                                        || '/public/images/user-icon-96-white.png'
                                        || '/images/user-icon-96-white.png'
                                    }
                                    width="24"
                                    height="24"
                                    alt={channel?.display_name + ' profile picture'}
                                    priority
                                />
                                <p className={`text-nowrap ${channel?.is_live ? 'text-cyan-500' : 'text-slate-950 dark:text-white'}`}>
                                    {channel?.display_name}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SearchChannelsInput;