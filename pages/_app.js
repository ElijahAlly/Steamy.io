import '~/styles/style.scss'
import React from 'react'
import DefaultLayout from '~/components/DefaultLayout'
import UserProvider from '~/providers/UserProvider'

export default function SupabaseSession({ Component, pageProps }) {
  return (
    <UserProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </UserProvider>
  )
}