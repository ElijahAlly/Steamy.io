import '@/styles/tailwind.css'
import React, { useState, useEffect, ElementType } from 'react'
import { useRouter } from 'next/router'
import UserContext from '@/lib/UserContext'
import { jwtDecode } from 'jwt-decode'
import DefaultLayout from '@/components/DefaultLayout'
import { UserTypeForSteamy } from '@/types/user'
import { Session } from '@supabase/supabase-js'
import { scopes } from '@/util/scopes'
import { supabase } from '@/lib/supabase'

interface SectionsProviderProps {
  Component: ElementType;
  pageProps: any;
}

export default function App({ Component, pageProps }: SectionsProviderProps) {
  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState<UserTypeForSteamy | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saveSession = async (session: Session | null) => {
      if (hasLoggedOut) return;
      setSession(session);

      if (session) {
        const jwt: any = jwtDecode(session.access_token)
        // console.log('jwt', jwt);
        // session.appRole = jwt.user_role

        // Fetch or create the user in Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session?.user?.id || '') 
          .single();

        // console.log('fetched userData', userData)

        if (userError && userError.code === 'PGRST116') {
          // If no user is found, create a new one
          const { data: newUser, error: newUserError } = await supabase
            .from('users')
            .insert({
              id: session?.user?.id || '',
              twitch_channels: ["steamy"], // TODO: Add channels user is already following/subscribed-to from Twitch
            })
            .single();
          // console.log('created newUserData', newUser)

          if (newUserError) {
            console.error('Error creating new user:', newUserError);
          } else {
            // User created, set the user data
            setUser({ supabase: newUser, twitch: session });
            setUserLoaded(true);
          }
        } else if (userData) {
          // User exists, set the user data
          setUser({ supabase: userData, twitch: session });
          setUserLoaded(true);
        }

        if (session && router.pathname === '/') {
          router.push('/channels/steamy'); // Use streamers username '/channels/<broadcaster_login>' (all lowercase)
        }
      } else {
        setUser(null);
        setUserLoaded(false);
      }
    }

    const initializeSession = async () => {
      if (hasLoggedOut) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No session exists, trigger sign in with scopes
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'twitch',
          options: {
            scopes: scopes,
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
          setUserLoaded(true);
          setHasLoggedOut(false);
          saveSession(session);
        }
      }
    )

    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, [])

  const getUsersId = () => {
    if (user?.twitch.user?.id) return user.twitch.user.id;
    if (user?.twitch?.user?.identities?.[0]?.user_id) return user.twitch.user.identities[0].user_id;
    return '';
  }

  const getProviderId = () => {
    if (user?.twitch?.user?.user_metadata?.provider_id) return user.twitch.user.user_metadata.provider_id;
    return '';
  }

  const getUsersUsername = () => {
    if (user?.twitch?.user?.user_metadata?.full_name) return user.twitch.user.user_metadata.full_name;
    if (user?.twitch?.user?.user_metadata?.name) return user.twitch.user.user_metadata.name;
    if (user?.twitch?.user?.user_metadata?.nickname) return user.twitch.user.user_metadata.nickname;
    if (user?.twitch?.user?.user_metadata?.slug) return user.twitch.user.user_metadata.slug;
    return 'Username';
  }

  const getUsersEmail = () => {
    if (user?.twitch?.user?.email) return user.twitch.user.email;
    if (user?.twitch?.user?.user_metadata?.email) return user.twitch.user.user_metadata.email;
    return 'email';
  }

  const getUsersProfilePicture = () => {
    if (user?.twitch?.user?.user_metadata?.avatar_url) return user.twitch.user.user_metadata.avatar_url;
    if (user?.twitch?.user?.user_metadata?.picture) return user.twitch.user.user_metadata.picture;
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
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </UserContext.Provider>
  )
}