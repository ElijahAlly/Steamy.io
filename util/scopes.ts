const userScopes = [
    // 'user:read:follows',
    'user:write:chat',
    'user:read:blocked_users',
    'user:manage:blocked_users',
    'user:read:chat',
    'user:manage:chat_color',
    'user:read:emotes',
    'user:read:moderated_channels',
    'user:read:subscriptions',
    'user:manage:whispers',
];

const channelScopes = [
    'channel:manage:polls',
    'channel:read:vips',
];

const moderatorsScopes = [
    'moderation:read',
    'moderator:manage:chat_messages',
    'moderator:read:followers'
];

export const scopes = userScopes.join(' ')
    + ' ' + channelScopes.join(' ')
    + ' ' + moderatorsScopes.join(' ');