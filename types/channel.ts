export interface ChannelFromTwitch {
    broadcaster_language: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    tag_ids: string[];
    tags: string[];
    thumbnail_url: string;
    title: string;
    started_at: string; // Assuming this is a timestamp, it can be a string. If it's nullable, use `string | null`.
}

export interface Channel {
    id: number;
    slug: string;
    created_by: number
    // Add other channel fields as needed
}