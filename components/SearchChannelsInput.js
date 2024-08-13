import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useContext, useState } from "react";
import UserContext from "~/lib/UserContext";

const SearchChannelsInput = () => {
    const { user } = useContext(UserContext);
    const [addChannelText, setAddChannelText] = useState('');
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChannels = async (query) => {
        if (!query) return;
        setIsLoading(true);
        
        try {
            const response = await fetch(`https://api.twitch.tv/helix/search/channels?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`, // Replace with your Twitch API token
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

            {channels.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white dark:bg-slate-950 border border-slate-950 dark:border-white rounded shadow-lg z-10">
                    {channels.map((channel) => (
                        <li key={channel.id} className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                            {channel.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchChannelsInput;