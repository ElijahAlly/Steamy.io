import { UserFromSupabase } from "./user";

export interface MessageType {
    id: number;
    channel_id: number;
    user_id: number;
    author: UserFromSupabase;
    message: string;
}