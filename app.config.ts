import { ExpoConfig, ConfigContext } from 'expo/config'
import { existsSync } from 'fs'

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction = process.env.EXPO_PUBLIC_APP_ENV === 'production'

  // Fail fast: crash the build if required env vars are missing or wrong for production.
  // This prevents a 4-hour EAS build from producing a binary that crashes on launch.
  if (isProduction) {
    if (!existsSync('./google-services.json')) {
      throw new Error(
        'Production build requires google-services.json for Android push notifications. ' +
          'Download from Firebase Console > Project Settings > Android app.'
      )
    }

    const required = ['EXPO_PUBLIC_API_URL', 'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID']
    const missing = required.filter((key) => !process.env[key])
    if (missing.length > 0) {
      throw new Error(
        `Production build missing required env vars: ${missing.join(', ')}. ` +
          `Add them to eas.json production.env or set them in the environment.`
      )
    }

    // Validate exact production values — catch any wrong config before a 4-hour build
    const apiUrl = process.env.EXPO_PUBLIC_API_URL!
    if (apiUrl !== 'https://justhestia.app/graphql') {
      throw new Error(
        `Production API URL must be exactly https://justhestia.app/graphql. Got: ${apiUrl}`
      )
    }

    const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!
    if (!googleIosClientId.endsWith('.apps.googleusercontent.com')) {
      throw new Error(
        `Production Google iOS Client ID must be a valid Google OAuth client ID. Got: ${googleIosClientId}`
      )
    }
  }

  return {
    ...config,
    name: 'JustHestia - Event RSVP',
    slug: 'hestia',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/icon.png',
      backgroundColor: '#111827', // gray-900 — matches dark mode, prevents white flash on cold start
      resizeMode: 'contain',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'app.just.hestia',
      supportsTablet: false,
      buildNumber: '66',
      associatedDomains: ['applinks:justhestia.app'],
      // Enables the "Sign in with Apple" entitlement (com.apple.developer.applesignin).
      // Required by App Store Review Guideline 4.8 for any app offering social sign-in.
      usesAppleSignIn: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSContactsUsageDescription:
          'Just Hestia uses your contacts to help you quickly hestia guests to your events.',
        // Reversed iOS OAuth client ID — required so Google Sign-In's
        // ASWebAuthenticationSession callback can deep-link back into the app.
        // Must match Google Cloud Console > Credentials > Hestia iOS > iOS URL scheme.
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.507420348076-dss463ubq08fukmhu8d2opei8uvv7kib',
            ],
          },
        ],
      },
    },
    android: {
      package: 'app.just.hestia',
      ...(existsSync('./google-services.json') && {
        googleServicesFile: './google-services.json',
      }),
      versionCode: 66,
      adaptiveIcon: {
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: process.env.EXPO_WEB_OUTPUT === 'static' ? 'static' : 'single',
      favicon: './assets/favicon.png',
      name: 'Just Hestia - Just.Simple.Hestias.',
    },
    plugins: [
      ['expo-router', { origin: 'https://justhestia.app', sitemap: false }],
      [
        'expo-build-properties',
        {
          android: {
            targetSdkVersion: 35,
            compileSdkVersion: 35,
          },
          ios: {
            useFrameworks: 'static',
            privacyManifests: {
              NSPrivacyAccessedAPITypes: [
                {
                  NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
                  NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
                },
              ],
              NSPrivacyCollectedDataTypes: [
                {
                  NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeEmailAddress',
                  NSPrivacyCollectedDataTypeLinked: true,
                  NSPrivacyCollectedDataTypeTracking: false,
                  NSPrivacyCollectedDataTypePurposes: [
                    'NSPrivacyCollectedDataTypePurposeAppFunctionality',
                  ],
                },
                {
                  NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePhoneNumber',
                  NSPrivacyCollectedDataTypeLinked: true,
                  NSPrivacyCollectedDataTypeTracking: false,
                  NSPrivacyCollectedDataTypePurposes: [
                    'NSPrivacyCollectedDataTypePurposeAppFunctionality',
                  ],
                },
                {
                  NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeName',
                  NSPrivacyCollectedDataTypeLinked: true,
                  NSPrivacyCollectedDataTypeTracking: false,
                  NSPrivacyCollectedDataTypePurposes: [
                    'NSPrivacyCollectedDataTypePurposeAppFunctionality',
                  ],
                },
                {
                  NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePhotosOrVideos',
                  NSPrivacyCollectedDataTypeLinked: true,
                  NSPrivacyCollectedDataTypeTracking: false,
                  NSPrivacyCollectedDataTypePurposes: [
                    'NSPrivacyCollectedDataTypePurposeAppFunctionality',
                  ],
                },
                {
                  NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeUserID',
                  NSPrivacyCollectedDataTypeLinked: true,
                  NSPrivacyCollectedDataTypeTracking: false,
                  NSPrivacyCollectedDataTypePurposes: [
                    'NSPrivacyCollectedDataTypePurposeAppFunctionality',
                  ],
                },
              ],
            },
          },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app needs access to your photos to upload event images.',
          cameraPermission: 'The app needs access to your camera to take event photos.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#111827',
        },
      ],
      '@react-native-community/datetimepicker',
      'expo-font',
      'expo-secure-store',
      // Generates iOS entitlements + native Apple Sign-In SDK wiring at prebuild time.
      'expo-apple-authentication',
      [
        '@sentry/react-native/expo',
        {
          organization: 'vasupatnaik',
          project: 'justhestia-frontend',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    scheme: 'justhestia',
    extra: {
      eas: {
        projectId: 'ec3dfbde-b3e0-4908-8dde-a2b5d9b5ed84',
      },
    },
  }
}
