import '~/styles/style.scss'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import UserContext from 'lib/UserContext'
import { supabase } from 'lib/Store'
import { jwtDecode } from 'jwt-decode'
import DefaultLayout from '~/components/DefaultLayout'

export default function SupabaseSession({ Component, pageProps }) {
  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null);
  const router = useRouter()

  useEffect(() => {
    function saveSession(
      // /** @type {Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']} */
      session
    ) {
      setSession(session);
      const currentUser = session;
      if (session) {
        const jwt = jwtDecode(session.access_token)
        currentUser.appRole = jwt.user_role
      }
      setUser(currentUser ?? null)
      setUserLoaded(!!currentUser)
      if (currentUser && router.pathname === '/') {
        router.push('/channels/[id]', '/channels/1')
      }
    }

    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      saveSession(session);
    };

    initializeSession();

    const { subscription: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log('session', session)
        saveSession(session)
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
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/');
    }
  }

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        signOut,
        getUsersId,
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