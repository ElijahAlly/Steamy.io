import { useState } from "react";

const SearchChannelsInput = () => {
    const [addChannelText, setAddChannelText] = useState('')

    return (
        <div className={`relative flex my-6`}>
            <input
                className={`shadow-sm appearance-none border border-slate-950 dark:border-white rounded w-full py-2 px-3 dark:text-white dark:bg-slate-950 text-slate-500 bg-white leading-tight focus-shadow-md focus:outline-none focus:shadow-outline`}
                type="text"
                placeholder="Add a channel from Twitch"
                value={ addChannelText }
                onChange={(e) => setAddChannelText(e.target.value)}
                onKeyDown={() => null}
            />
        </div>
    )
}

export default SearchChannelsInput;