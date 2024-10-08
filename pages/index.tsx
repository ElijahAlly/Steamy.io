import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Image from 'next/image';
import { useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '@/lib/UserContext';
import { useRouter } from 'next/router';
import React from 'react';
import { supabase } from '@/lib/supabase';

const Home = () => {
  const router = useRouter();
  const { user, userLoaded } = useContext(UserContext);

  useEffect(() => {
    window.addEventListener('load', () => {
      // Check if the window was opened as a popup (or new tab)
      if (window.opener && window.opener !== window) {
        window.opener.postMessage('authSuccess', '*');
        window.close();
      }
    });
    
    if (userLoaded && user) {
      router.push('/channels/steamy');
    }
  }, [user, userLoaded, router]);

  return (
    <div className="w-full h-fit flex justify-center items-center p-4 mt-36 md:mt-56">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <div className="border-teal p-8 border-t-12 mb-6 rounded-lg shadow-lg dark:bg-slate-900">
          <Image 
            className="select-none mb-4 rounded" 
            src='/images/Steamy-Dark-Logo-260px.png' 
            width="72" 
            height="72" 
            alt='Steamy App Logo'
            priority
          />
          <h1 className="select-none h3 mb-3 fw-normal text-cyan-500">Please log in to use the app</h1>
          <Auth 
            supabaseClient={ supabase } 
            appearance={ { theme: ThemeSupa } }
            providers={['twitch']}
            onlyThirdPartyProviders={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Home;