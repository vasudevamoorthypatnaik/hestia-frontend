// @testing-library/react-native now includes jest-native matchers
// No need to import separately

// MSW server setup for API mocking in tests
const { server } = require('./src/mocks/server')

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that are declared as a part of tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  useFocusEffect: jest.fn((cb) => cb()),
  Stack: {
    Screen: 'Screen',
  },
  Slot: 'Slot',
}))

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    name: 'Hestia',
    version: '1.0.0',
  },
}))

// Mock expo-image (v2 depends on expo-asset which requires native Expo global)
jest.mock('expo-image', () => {
  const { View } = require('react-native')
  return {
    Image: View,
    ImageBackground: View,
  }
})

// Mock @expo/vector-icons (requires native expo-font module)
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
}))

// Mock react-native-view-shot
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn().mockResolvedValue('file:///mock-captured.png'),
}))

// Mock expo-sharing
jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
}))

// Mock expo-print
jest.mock('expo-print', () => ({
  printAsync: jest.fn(),
}))

// Mock react-native-reanimated (required for useSharedValue, useAnimatedStyle, withTiming, etc.)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  Reanimated.useReducedMotion = jest.fn(() => false)
  return Reanimated
})

// Mock @sentry/react-native (native module — not available in Jest/jsdom environment)
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn((callback) => callback({ setTag: jest.fn(), setUser: jest.fn() })),
}))
