import { UsersTwitchSession } from "./user";

export interface UserContextType {
    userLoaded: boolean;
    user: UsersTwitchSession | null;
    signOut: () => void;
    getUsersId: () => string;
    getProviderId: () => string;
    getUsersUsername: () => string;
    getUsersEmail: () => string;
    getUsersProfilePicture: () => string;
}