import Head from 'expo-router/head'
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen'

/** Forgot-password route — /auth/forgot-password (stub). */
export default function ForgotPasswordRoute() {
  return (
    <>
      <Head>
        <title>Reset password | Hestia</title>
      </Head>
      <ForgotPasswordScreen />
    </>
  )
}
