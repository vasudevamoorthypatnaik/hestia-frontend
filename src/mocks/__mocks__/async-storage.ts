/**
 * Jest mock for @react-native-async-storage/async-storage — in-memory, so tests that
 * transitively import AsyncStorage (e.g. via ThemeContext) don't hit native resolution.
 */
const store: Record<string, string> = {}

const AsyncStorage = {
  getItem: jest.fn(async (key: string) => store[key] ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    store[key] = value
  }),
  removeItem: jest.fn(async (key: string) => {
    delete store[key]
  }),
  clear: jest.fn(async () => {
    Object.keys(store).forEach((key) => delete store[key])
  }),
  getAllKeys: jest.fn(async () => Object.keys(store)),
}

export default AsyncStorage
