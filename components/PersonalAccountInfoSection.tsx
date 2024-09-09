import UserContext from "@/lib/UserContext";
import Image from "next/image";
import { FunctionComponent, useContext } from "react";

interface PersonalAccountInfoSectionProps {
}

const PersonalAccountInfoSection: FunctionComponent<PersonalAccountInfoSectionProps> = () => {
    const { signOut, getUsersProfilePicture, getUsersUsername } = useContext(UserContext);

    return (
        <>
            <button
                className="hidden md:block min-w-fit h-fit select-none bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-2/5 md:w-full transition duration-150"
                onClick={(e) => {
                    e.preventDefault();
                    signOut();
                }}
            >
                Logout
            </button>

            <div className='select-none flex flex-col mt-0 md:mt-6 cursor-pointer border border-transparent hover:border-white hover:bg-slate-800 rounded-md p-2'>
                <Image
                    className="flex items-center rounded-full border"
                    src={getUsersProfilePicture()}
                    width="36"
                    height="36"
                    alt={getUsersUsername() + ' profile picture'}
                    priority
                />
                <h6 className="text-xs text-slate-950 dark:text-white">{getUsersUsername()}</h6>
            </div>
        </>
    );
}
 
export default PersonalAccountInfoSection;