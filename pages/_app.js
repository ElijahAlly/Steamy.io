import '~/styles/style.scss'
import React from 'react'
import DefaultLayout from '~/components/DefaultLayout'
import UserProvider from '~/lib/UserProvider'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </UserProvider>
  )
}