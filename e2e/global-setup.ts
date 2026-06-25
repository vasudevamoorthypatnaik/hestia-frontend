import fs from 'fs'
import path from 'path'

const API = process.env.E2E_API_URL ?? 'http://localhost:8080/graphql'
const AUTH_DIR = path.resolve(__dirname, '.auth')
const EMPTY_STATE = { cookies: [], origins: [] }

const TEST_USER = { email: 'pallavi@hestia.app', password: 'password123' }

async function ensureTestUser() {
  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query:
          'mutation($i:RegisterUserInput!){registerUser(input:$i){userId}}',
        variables: {
          i: { ...TEST_USER, firstName: 'Pallavi', lastName: 'P' },
        },
      }),
    })
    // Ignore "Email already registered" — user persists across runs.
  } catch (err) {
    console.warn('[e2e global-setup] could not seed test user (backend down?):', err)
  }
}

export default async function globalSetup() {
  fs.mkdirSync(AUTH_DIR, { recursive: true })
  for (const f of ['host.json', 'cohost.json', 'guest.json']) {
    fs.writeFileSync(path.join(AUTH_DIR, f), JSON.stringify(EMPTY_STATE))
  }
  await ensureTestUser()
}
