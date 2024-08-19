import '@/styles/tailwind.css'
import React, { useState, useEffect, ElementType } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/Store'
import UserContext from '@/lib/UserContext'
import { jwtDecode } from 'jwt-decode'
import DefaultLayout from '@/components/DefaultLayout'
import { UsersTwitchSession } from '@/types/user'
import { Session } from '@supabase/supabase-js'
// import { usersTwitchSession } from '@/donotcommit'
// import { usePathname } from 'next/navigation'

interface SectionsProviderProps {
  Component: ElementType;
  pageProps: any;
}

export default function App({ Component, pageProps }: SectionsProviderProps) {
  // const pathname = usePathname();
  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState<UsersTwitchSession | null>(null)
  const [session, setSession] = useState<Session | null>(null);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const router = useRouter()

  // useEffect(() => {
  //   if (!pathname || pathname.includes('channels')) return;
  //   if (!userLoaded) {
  //     setUser(usersTwitchSession); // Set a default user for development
  //     setUserLoaded(true);
  //     router.replace('/channels/1');
  //   }
  // }, [pathname, router, userLoaded])

  useEffect(() => {
    function saveSession(
      session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
    ) {
      if (hasLoggedOut) return;
      setSession(session);
      console.log('session', session)
      const currentUser: any = session;
      if (session) {
        const jwt: any = jwtDecode(session.access_token)
        console.log('jwt', jwt);
        currentUser.appRole = jwt.user_role
        setUser(currentUser);
        setUserLoaded(true);

        if (currentUser && router.pathname === '/') {
          router.push('/channels/[id]', '/channels/1');
        }
      } else {
        setUser(null);
        setUserLoaded(false);
      }
    }

    const userScopes = [
      'user:read:follows',
      'user:write:chat',
      'user:read:blocked_users',
      'user:manage:blocked_users',
      'user:read:chat',
      'user:manage:chat_color',
      'user:read:emotes',
      'user:read:moderated_channels',
      'user:read:subscriptions',
      'user:manage:whispers',
    ];

    const channelScopes = [
      'channel:manage:polls',
      'channel:read:vips',
    ];

    const moderatorsScopes = [
      'moderation:read',
      'moderator:manage:chat_messages',
    ];

    const scopes = userScopes.join(' ') 
      + ' ' + channelScopes.join(' ') 
      + ' ' + moderatorsScopes.join(' ');

    const initializeSession = async () => {
      if (hasLoggedOut) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No session exists, trigger sign in with scopes
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'twitch',
          options: {
            scopes,
          },
        });

        if (error) {
          console.error('Error during sign-in:', error.message);
        }
      } else {
        saveSession(session);
      }
    };

    initializeSession();

    const { data: { subscription: authListener} } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setUserLoaded(false);
          setHasLoggedOut(true);
        } else {
          saveSession(session);
        }
      }
    )

    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, [router])

  const getUsersId = () => {
    if (user?.user?.id) return user?.user?.id;
    if (user?.user?.identities[0]?.user_id) return user?.user?.identities[0]?.user_id;
    return '';
  }

  const getProviderId = () => {
    if (user?.user?.user_metadata?.provider_id) return user?.user?.user_metadata?.provider_id;
    return '';
  }

  const getUsersUsername = () => {
    if (user?.user?.user_metadata?.full_name) return user?.user?.user_metadata?.full_name;
    if (user?.user?.user_metadata?.name) return user?.user?.user_metadata?.name;
    if (user?.user?.user_metadata?.nickname) return user?.user?.user_metadata?.nickname;
    if (user?.user?.user_metadata?.slug) return user?.user?.user_metadata?.slug;
    return 'Username';
  }

  const getUsersEmail = () => {
    if (user?.user?.email) return user?.user?.email;
    if (user?.user?.user_metadata?.email) return user?.user?.user_metadata?.email;
    return 'email';
  }

  const getUsersProfilePicture = () => {
    if (user?.user?.user_metadata?.avatar_url) return user?.user?.user_metadata?.avatar_url;
    if (user?.user?.user_metadata?.picture) return user?.user?.user_metadata?.picture;
    return '/images/user-icon-96-white.png';
  }

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setUserLoaded(false);
    setHasLoggedOut(true);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign-out:', error.message);
    } else {
      router.push('/'); // Navigate back to the homepage after successful sign-out
      setTimeout(() => setHasLoggedOut(false), 1000);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        signOut,
        getUsersId,
        getProviderId,
        getUsersUsername,
        getUsersEmail,
        getUsersProfilePicture,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}