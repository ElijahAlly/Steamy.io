import { supabase } from 'lib/Store'
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Image from 'next/image';
import { useEffect } from 'react';
import { useContext } from 'react';
import UserContext from 'lib/UserContext';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  const { user, userLoaded } = useContext(UserContext);

  useEffect(() => {
    if (userLoaded && user) {
      router.push('/channels/1');
    }
  }, [user, userLoaded, router]);

  return (
    <div className="w-full h-fit flex justify-center items-center p-4">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <div className="border-teal p-8 border-t-12 mb-6 rounded-lg shadow-lg dark:bg-slate-900">
          <Image 
            className="mb-4 rounded" 
            src='/images/Steamy-Dark-Logo-260px.png' 
            width="72" 
            height="72" 
            alt='Steamy App Logo'
            priority
          />
          <h1 className="h3 mb-3 fw-normal text-cyan-500">Please log in to use the app</h1>
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