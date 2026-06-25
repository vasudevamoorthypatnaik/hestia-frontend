import { Link, Stack, type Href } from 'expo-router'
import { View, Text } from 'react-native'

/** 404 route. */
export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center bg-surface-light p-8 dark:bg-surface-dark">
        <Text className="mb-4 font-display text-2xl text-ink dark:text-ink-dark">
          This page does not exist.
        </Text>
        <Link href={'/auth/login' as Href}>
          <Text className="font-sans text-sm font-bold text-terracotta">Go to sign in</Text>
        </Link>
      </View>
    </>
  )
}
