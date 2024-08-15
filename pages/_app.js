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

    const { subscription: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setUserLoaded(false);
          router.push('/');
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

    // const { error } = await supabase.auth.signOut();
    if (!error) {
      // router.push('/'); // Redirect to login page
    } else {
      console.error('Error during sign-out:', error.message);
    }
  };

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