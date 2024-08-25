import React, { ReactNode, useContext, useEffect } from "react";
import ThemeToggler from "./ThemeToggler";
import Image from "next/image";
import UserContext from "@/lib/UserContext";
import { useRouter } from "next/navigation";

interface DefaultLayout {
    children: ReactNode
}

const DefaultLayout = ({ children }: DefaultLayout) => {
    const router = useRouter();
    const { getUsersEmail } = useContext(UserContext);

    useEffect(() => {
        if (!document.documentElement.classList.contains('dark')) document.documentElement.classList.add('dark');
    }, []);

    return (
        <div className='relative p-px md:p-1 flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-cyan-200 to-cyan-950'>
            <nav className='h-24 flex items-center justify-between sticky top-0 left-0 dark:bg-slate-950 rounded-t-md border-b border-slate-950 dark:border-white py-2 px-3 md:px-9'>
                <Image
                    className="select-none rounded cursor-pointer hover:shadow-sm hover:shadow-cyan-500"
                    src='/images/Steamy-Dark-Logo-260px.png'
                    width="51"
                    height="51"
                    alt='Steamy App Logo'
                    onClick={() => router.push('/channels/steamy')}
                    priority
                />
                <a href={'https://donate.stripe.com/' + process.env.NEXT_PUBLIC_STRIPE_DONATION_URL + getUsersEmail()} className='select-none bg-cyan-500 text-white rounded-md p-2 hidden md:block' target='_blank'>donate any amount :)</a>
                <a href={'https://donate.stripe.com/' + process.env.NEXT_PUBLIC_STRIPE_DONATION_URL + getUsersEmail()} className='select-none bg-cyan-500 text-white rounded-md p-2 block md:hidden' target='_blank'>donate :)</a>
                {/* // TODO: add theme toggler */}
                {/* <ThemeToggler /> */}
            </nav>
            <div className='h-full w-full flex flex-col overflow-y-auto dark:bg-slate-950 rounded-b-md'>
                <main className='w-full h-full'>
                    { children }
                </main>
                <footer className='select-none h-fit flex py-12 px-9 dark:bg-slate-950 border-t border-slate-950 dark:border-white text-slate-950 dark:text-white'>
                    Steamy.io
                </footer>
            </div>
        </div>
    )
}

export default DefaultLayout;