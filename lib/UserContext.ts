import { createContext } from 'react'
import { UserContextType } from '@/types/userContext';

const defaultContextValue: UserContextType = {
    userLoaded: false,
    user: null,
    signOut: () => { },
    getUsersId: () => '',
    getProviderId: () => '',
    getUsersUsername: () => '',
    getUsersEmail: () => '',
    getUsersProfilePicture: () => '',
};

const UserContext = createContext(defaultContextValue);

export default UserContext
