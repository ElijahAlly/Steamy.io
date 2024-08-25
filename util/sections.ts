import { SECTION_TYPE_ENUM, SectionType } from "@/types/section";

export const steamySections: SectionType[] = [
    {
        broadcaster_login: 'steamy',
        title: 'Live Chat',
        collapsed: true,
        type: SECTION_TYPE_ENUM.LIVE_CHAT,
        tabs: [
            {
                name: 'Live Steamy Chats',
                selected: true,
            },
            {
                name: 'Live Twitch Chats',
                selected: false,
            },
        ],
        read_permissions: {
            allTwitchUsers: true,
            followers: false,
            subscribers: false,
            mods: false,
        },
        write_permissions: {
            allTwitchUsers: false,
            followers: false,
            subscribers: true,
            mods: false,
        },
        active: true
    },
    {
        broadcaster_login: 'steamy',
        title: 'Discussions',
        collapsed: true,
        type: SECTION_TYPE_ENUM.DISCUSSIONS,
        tabs: [],
        read_permissions: {
            allTwitchUsers: true,
            followers: false,
            subscribers: false,
            mods: false,
        },
        write_permissions: {
            allTwitchUsers: false,
            followers: true,
            subscribers: false,
            mods: false,
        },
        active: true
    },
    {
        broadcaster_login: 'steamy',
        title: 'Video Links',
        collapsed: true,
        type: SECTION_TYPE_ENUM.VIDEO_LINKS,
        tabs: [
            {
                name: 'All',
                selected: true,
                domains: ['*']
            },
            {
                name: 'YouTube',
                selected: false,
                domains: [
                    'youtube.com',
                    'youtu.be'
                ]
            },
            {
                name: 'Twitter/X',
                selected: false,
                domains: ['x.com']
            },
            {
                name: 'Instagram',
                selected: false,
                domains: ['instagram.com']
            },
            {
                name: 'Twitch',
                selected: false,
                domains: ['twitch.tv']
            },
        ],
        read_permissions: {
            allTwitchUsers: true,
            followers: false,
            subscribers: false,
            mods: false,
        },
        write_permissions: {
            allTwitchUsers: false,
            followers: true,
            subscribers: false,
            mods: false,
        },
        active: true
    },
    {
        broadcaster_login: 'steamy',
        title: 'Article Links',
        collapsed: true,
        type: SECTION_TYPE_ENUM.ARTICLE_LINKS,
        tabs: [
            {
                name: 'All',
                selected: true,
                domains: ['*']
            },
            {
                name: 'Twitter/X',
                selected: false,
                domains: ['x.com']
            },
            {
                name: 'Reddit',
                selected: false,
                domains: ['reddit.com']
            },
            {
                name: 'Wikipedia',
                selected: false,
                domains: ['wikipedia.org']
            },
        ],
        read_permissions: {
            allTwitchUsers: true,
            followers: false,
            subscribers: false,
            mods: false,
        },
        write_permissions: {
            allTwitchUsers: false,
            followers: true,
            subscribers: false,
            mods: false,
        },
        active: true
    },
    {
        broadcaster_login: 'steamy',
        title: 'Donate To',
        collapsed: true,
        type: SECTION_TYPE_ENUM.DONATE_TO,
        tabs: [],
        read_permissions: {
            allTwitchUsers: true,
            followers: false,
            subscribers: false,
            mods: false,
        },
        write_permissions: {
            allTwitchUsers: true,
            followers: false,
            subscribers: false,
            mods: false,
        },
        active: true
    },
    {
        broadcaster_login: 'steamy',
        title: 'Custom View',
        collapsed: true,
        type: SECTION_TYPE_ENUM.CUSTOM_VIEW,
        tabs: [],
        // When all are false, it means only the streamer is allowed to read/write to this section type
        read_permissions: {
            allTwitchUsers: false,
            followers: false,
            subscribers: false,
            mods: false,
        },
        write_permissions: {
            allTwitchUsers: false,
            followers: true,
            subscribers: false,
            mods: false,
        },
        active: true
    }
];

export const chunkArray = (arr: SectionType[], chunkSize: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}