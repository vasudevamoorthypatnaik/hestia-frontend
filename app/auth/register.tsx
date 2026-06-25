import Head from 'expo-router/head'
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen'

/** Register route — /auth/register (stub). */
export default function RegisterRoute() {
  return (
    <>
      <Head>
        <title>Create a household | Hestia</title>
      </Head>
      <RegisterScreen />
    </>
  )
}
