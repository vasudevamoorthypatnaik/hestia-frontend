import CalendarScreen from '@/features/calendar/screens/CalendarScreen'

/**
 * Auth-gated landing (HES-CAL). The household calendar is the home surface — Metro resolves the
 * platform variant: CalendarScreen.web.tsx (week dashboard) on web, CalendarScreen.tsx (day
 * agenda) on iOS/Android.
 */
export default function Home() {
  return <CalendarScreen />
}
