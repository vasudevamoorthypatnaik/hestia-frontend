import { validateLoginForm } from './types'

describe('validateLoginForm', () => {
  it('requires an email', () => {
    expect(validateLoginForm({ email: '', password: 'x' }).email).toBe('Email is required')
  })

  it('rejects a malformed email', () => {
    expect(validateLoginForm({ email: 'not-an-email', password: 'x' }).email).toBe(
      'Enter a valid email address'
    )
  })

  it('requires a password', () => {
    expect(validateLoginForm({ email: 'a@b.com', password: '' }).password).toBe(
      'Password is required'
    )
  })

  it('passes a valid email + password', () => {
    expect(validateLoginForm({ email: 'a@b.com', password: 'secret' })).toEqual({})
  })
})
