import authReducer, { reset } from './authSlice'

const baseState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

describe('authSlice reducer', () => {
    it('returns the initial state for unknown actions', () => {
        const result = authReducer(undefined, { type: 'unknown' })
        expect(result).toMatchObject(baseState)
    })

    it('reset clears flags and message without touching user', () => {
        const dirty = { ...baseState, isError: true, isSuccess: true, isLoading: true, message: 'oops' }
        const result = authReducer(dirty, reset())
        expect(result.isError).toBe(false)
        expect(result.isSuccess).toBe(false)
        expect(result.isLoading).toBe(false)
        expect(result.message).toBe('')
    })

    it('register/pending sets isLoading', () => {
        const result = authReducer(baseState, { type: 'auth/register/pending' })
        expect(result.isLoading).toBe(true)
    })

    it('register/fulfilled stores the user and sets isSuccess', () => {
        const user = { token: 'abc123', email: 'test@test.com', name: 'Test' }
        const result = authReducer(baseState, { type: 'auth/register/fulfilled', payload: user })
        expect(result.isLoading).toBe(false)
        expect(result.isSuccess).toBe(true)
        expect(result.user).toEqual(user)
    })

    it('register/rejected sets isError and message, clears user', () => {
        const withUser = { ...baseState, user: { _id: 'test', name: 'Test', email: 'test@test.com', token: 'old' } }
        const result = authReducer(withUser, { type: 'auth/register/rejected', payload: 'Email taken' })
        expect(result.isError).toBe(true)
        expect(result.message).toBe('Email taken')
        expect(result.user).toBeNull()
    })

    it('login/pending sets isLoading', () => {
        const result = authReducer(baseState, { type: 'auth/login/pending' })
        expect(result.isLoading).toBe(true)
    })

    it('login/fulfilled stores the user and sets isSuccess', () => {
        const user = { token: 'xyz789', email: 'user@test.com', name: 'User' }
        const result = authReducer(baseState, { type: 'auth/login/fulfilled', payload: user })
        expect(result.isSuccess).toBe(true)
        expect(result.user).toEqual(user)
    })

    it('login/rejected sets isError and clears user', () => {
        const result = authReducer(baseState, { type: 'auth/login/rejected', payload: 'Invalid credentials' })
        expect(result.isError).toBe(true)
        expect(result.message).toBe('Invalid credentials')
        expect(result.user).toBeNull()
    })

    it('logout/fulfilled clears the user', () => {
        const loggedIn = { ...baseState, user: { _id: 'test', name: 'Test', email: 'test@test.com', token: 'sometoken' } }
        const result = authReducer(loggedIn, { type: 'auth/logout/fulfilled' })
        expect(result.user).toBeNull()
    })
})
