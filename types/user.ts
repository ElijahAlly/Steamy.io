import { Session } from "@supabase/supabase-js";
import { UUID } from "crypto";

export interface UserFromSupabase {
    id: UUID;
    username: string;
    status: string;
    twitch_channels: string[];
}

export interface UserTypeForSteamy {
    supabase: UserFromSupabase;
    twitch: Session;
}