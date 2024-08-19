export interface CustomClaims {
    broadcaster_type: string;
    description: string;
    offline_image_url: string;
    type: string;
    view_count: number;
}

export interface UserMetadata {
    avatar_url: string;
    custom_claims: CustomClaims;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    nickname: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    slug: string;
    sub: string;
}

export interface IdentityData {
    avatar_url: string;
    custom_claims: CustomClaims;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    nickname: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    slug: string;
    sub: string;
}

export interface Identity {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: IdentityData;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
}

export interface AppMetadata {
    provider: string;
    providers: string[];
}

export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: AppMetadata;
    user_metadata: UserMetadata;
    identities: Identity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
}

export interface UsersTwitchSession {
    provider_token: string;
    provider_refresh_token: string;
    access_token: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
    token_type: string;
    user: User;
    appRole?: string;
}

export interface UserFromSupabase {
    id: number;
    full_name: string;
}