import { UserTypeForSteamy } from "./user";

export interface UserContextType {
    userLoaded: boolean;
    user: UserTypeForSteamy | null;
    signOut: () => void;
    getUsersId: () => string;
    getProviderId: () => string;
    getUsersUsername: () => string;
    getUsersEmail: () => string;
    getUsersProfilePicture: () => string;
}