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
      setSession(session)
      const currentUser = session?.user
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
      }}
    >
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </UserContext.Provider>
  )
}