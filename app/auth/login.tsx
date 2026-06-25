import Head from 'expo-router/head'
import { LoginScreen } from '@/features/auth/screens/LoginScreen'

/** Login route — accessible at /auth/login (T10). */
export default function LoginRoute() {
  return (
    <>
      <Head>
        <title>Sign in | Hestia</title>
      </Head>
      <LoginScreen />
    </>
  )
}
