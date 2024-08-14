import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";

const SearchChannelsInput = ({ user }) => {
    const [addChannelText, setAddChannelText] = useState('');
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChannels = async (query) => {
        if (!query) return;
        setIsLoading(true);

        if (!user?.provider_token) return;
        try {
            const res = await fetch('https://id.twitch.tv/oauth2/validate', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.provider_token}`
                }
            });
            const valRes = await res.json();
            console.log('val Res', valRes);

            const response = await fetch(`https://api.twitch.tv/helix/search/channels?query=${encodeURI(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.provider_token}`, // Replace with your Twitch API token
                    'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`, // Replace with your Twitch Client ID
                }
            });
            const data = await response.json();
            console.log('twitch channel data', data);
            setChannels(data.data); // Assuming Twitch returns an array of channels under `data.data`
        } catch (error) {
            console.error('Error fetching Twitch channels:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setAddChannelText(e.target.value);
        fetchChannels(e.target.value);
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
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-white" />
            </div>

            {isLoading && <p className="text-center mt-2 text-slate-500 dark:text-white">Loading...</p>}

            {channels?.length && channels.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white dark:bg-slate-950 border border-slate-950 dark:border-white rounded shadow-lg z-10">
                    {channels.map((channel) => (
                        <li key={channel?.id} className="flex px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                            <Image
                                className="rounded-full border border-slate-500 p-1 mb-2"
                                src={channel?.thumbnail_url
                                    || '/public/images/user-icon-96-white.png'
                                    || '/images/user-icon-96-white.png'
                                }
                                width="24"
                                height="24"
                                alt={channel?.display_name + ' profile picture'}
                                priority
                            />
                            <p className={`${channel?.is_live ? 'text-cyan-500' : 'text-slate-950 dark:text-white'}`}>
                                {channel?.display_name}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchChannelsInput;