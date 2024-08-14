import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "~/lib/UserContext";

export default function DonationSuccess() {
    const { getUsersEmail } = useContext(UserContext);
    const router = useRouter();

    return (
        <div className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-white dark:bg-slate-950 opacity-75'>
            <div className='drop-shadow-xl bg-slate-200 dark:bg-slate-800 rounded-md px-6 py-6 flex flex-col justify-center w-4/5 md:w-1/2 max-w-fit select-none'>
                <h1 className='text-md md:text-xl font-semibold text-slate-950 dark:text-white mb-6'>Success 🎉</h1>
                <h1 className='text-md md:text-xl font-semibold text-slate-950 dark:text-white mb-6'>Thank you for your donation!</h1>
                <div className='flex flex-wrap items-end justify-between'>
                    <button 
                        onClick={() => router.push('/channels/1')} 
                        className='w-fit p-2 mr-6 border border-slate-500 dark:border-white rounded-md text-slate-950 dark:text-white hover:text-slate-700 hover:border-slate-700 hover:dark:text-slate-300 hover:dark:border-slate-300'
                    >Go Back to Steamy</button>
                    <a 
                        href={'https://donate.stripe.com/' + process.env.NEXT_PUBLIC_STRIPE_DONATION_URL + getUsersEmail()} 
                        className='w-fit mt-6 bg-cyan-500 text-white rounded-md p-2 block hover:bg-cyan-400' 
                        target='_blank'
                    >Donate Again? 😜</a>       
                </div>
            </div>
        </div>
    );
}