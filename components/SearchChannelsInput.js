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
                    'Authorization': `Bearer ${user?.provider_token}`
                }
            });
            // {
            //     client_id: "98q4f2hye67zupp3808gi087k0oey9"
            //     expires_in: 15250
            //     login: "mansaelijahmusa"
            //     scopes: ['user:read:email']
            //     user_id: "1061626664"
            // }
            const valRes = await res.json();
            console.log('val Res', valRes);

            console.log('provider_token: ', user?.provider_token)
            const response = await fetch(`https://api.twitch.tv/helix/search/channels?query=${encodeURI(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user?.provider_token}`,
                    'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
                }
            });
            const data = await response.json();
            /*
                [
                    {
                        "broadcaster_language": "en",
                        "broadcaster_login": "mogulmoves",
                        "display_name": "mogulmoves",
                        "game_id": "509663",
                        "game_name": "Special Events",
                        "id": "40934651",
                        "is_live": false,
                        "tag_ids": [],
                        "tags": [
                            "English",
                            "Speedrun",
                            "Charity",
                            "Marathon"
                        ],
                        "thumbnail_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/bde8aaf5-35d4-4503-9797-842401da900f-profile_image-300x300.png",
                        "title": "FAST50🚀CHARITY SPEEDRUNNING EVENT🚀50 HOUR STREAM !DONATE !SCHEDULE",
                        "started_at": ""
                    },
                    {
                        "broadcaster_language": "en",
                        "broadcaster_login": "moonmoon",
                        "display_name": "MOONMOON",
                        "game_id": "489170",
                        "game_name": "DARK SOULS II: Scholar of the First Sin",
                        "id": "121059319",
                        "is_live": false,
                        "tag_ids": [],
                        "tags": [
                            "English"
                        ],
                        "thumbnail_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/3973e918fe7cc8c8-profile_image-300x300.png",
                        "title": "Next stream Thursday 3pm PDT GOONGOON eyebrowser ISH | !vods !archive !discord",
                        "started_at": ""
                    },
                    {
                        "broadcaster_language": "ru",
                        "broadcaster_login": "morphe_ya",
                        "display_name": "morphe_ya",
                        "game_id": "509658",
                        "game_name": "Just Chatting",
                        "id": "194407709",
                        "is_live": false,
                        "tag_ids": [],
                        "tags": [
                            "Русский"
                        ],
                        "thumbnail_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/6a039e94-3fa6-400f-b7fa-7e01909c12d7-profile_image-300x300.png",
                        "title": "hii | !tg !winline",
                        "started_at": ""
                    },
                    {
                        "broadcaster_language": "ja",
                        "broadcaster_login": "mother3rd",
                        "display_name": "MOTHER3rd",
                        "game_id": "498566",
                        "game_name": "Slots",
                        "id": "55734416",
                        "is_live": false,
                        "tag_ids": [],
                        "tags": [
                            "日本語"
                        ],
                        "thumbnail_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/296ec4d2-ec6b-4ae9-aae5-33ed1941e368-profile_image-300x300.png",
                        "title": "れんじろうノリ打ち シンフォギア空いてませんでした",
                        "started_at": ""
                    },
                    {
                        "broadcaster_language": "en",
                        "broadcaster_login": "morgpie",
                        "display_name": "Morgpie",
                        "game_id": "509658",
                        "game_name": "Just Chatting",
                        "id": "591995115",
                        "is_live": true,
                        "tag_ids": [],
                        "tags": [
                            "English",
                            "adhd",
                            "furry",
                            "fitness",
                            "sigma",
                            "sigmafemale",
                            "grindset",
                            "MuscleMommy",
                            "btd6"
                        ],
                        "thumbnail_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/5d774c75-911d-4b54-8a99-b2b5e5d6692b-profile_image-300x300.png",
                        "title": "SUMMERWEEN🎃 !s !drink !merch",
                        "started_at": "2024-08-14T17:53:39Z"
                ]
            */
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