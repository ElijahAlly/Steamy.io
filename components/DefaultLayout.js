import { useEffect } from "react";
import ThemeToggler from "./ThemeToggler";
import Image from "next/image";

const DefaultLayout = ({ children }) => {
    

    useEffect(() => {
        if (!document.documentElement.classList.contains('dark')) document.documentElement.classList.add('dark');
    }, []);

    return (
        <div className='flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-slate-950'>
            <nav className='h-fit flex items-center justify-between sticky top-0 left-0 border-b border-slate-950 dark:border-white py-2 px-3 md:px-9'>
                <Image
                    className="rounded"
                    src='/images/Steamy-Dark-Logo-260px.png'
                    width="51"
                    height="51"
                    alt='Steamy App Logo'
                    priority
                />
                {/* <div className='hidden md:block'>
                    <stripe-buy-button
                        buy-button-id="buy_btn_1PnX2HAhW6C3kbAmN5Q3TVn3"
                        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                    >
                    </stripe-buy-button>
                </div> */}
                <a href={'https://donate.stripe.com/' + process.env.NEXT_APP_STRIPE_DONATION_URL} className='bg-cyan-500 text-white rounded-md p-2 hidden md:block' target='_blank'>Donate Any Amount :)</a>
                <a href={'https://donate.stripe.com/' + process.env.NEXT_APP_STRIPE_DONATION_URL} className='bg-cyan-500 text-white rounded-md p-2 block md:hidden' target='_blank'>Donate :)</a>
                <ThemeToggler />
            </nav>
            <div className='h-full flex flex-col overflow-y-auto'>
                <main className='w-full h-full'>
                    { children }
                </main>
                <footer className='h-fit hidden md:flex py-12 px-9 border-t border-slate-950 dark:border-white text-slate-950 dark:text-white'>
                    Steamy.io
                </footer>
            </div>
        </div>
    )
}

export default DefaultLayout;