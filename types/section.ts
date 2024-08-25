export enum SECTION_TYPE_ENUM {
    LIVE_CHAT = 'LIVE_CHAT',
    DISCUSSIONS = 'DISCUSSIONS',
    VIDEO_LINKS = 'VIDEO_LINKS',
    ARTICLE_LINKS = 'ARTICLE_LINKS',
    DONATE_TO = 'DONATE_TO',
    CUSTOM_VIEW = 'CUSTOM_VIEW',
}

export interface Tab {
    name: string;
    selected: boolean;
    domains?: string[]; // Optional because not all tabs have domains
}

export interface Permissions {
    allTwitchUsers: boolean;
    followers: boolean;
    subscribers: boolean;
    mods: boolean;
}

export interface SectionType {
    id?: string;
    broadcaster_login: string;
    title: string;
    collapsed: boolean;
    type: SECTION_TYPE_ENUM;
    tabs: Tab[];
    read_permissions?: Permissions;
    write_permissions?: Permissions;
    active: boolean;
}