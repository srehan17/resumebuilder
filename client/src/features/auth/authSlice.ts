import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService from './authService'

export type User = {
    _id: string
    name: string
    email: string
    token: string
}

type UserRegister = { name: string; email: string; password: string }
type UserLogin = { email: string; password: string }

interface InitialState {
    user: User | null
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
}

const user: User | null = JSON.parse(localStorage.getItem('user')!)

const initialState: InitialState = {
    user: user ?? null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

const extractMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
        const e = err as { response?: { data?: { message?: string } }; message?: string }
        return e.response?.data?.message ?? e.message ?? String(err)
    }
    return String(err)
}

export const register = createAsyncThunk('auth/register',
    async (user: UserRegister, thunkAPI) => {
        try {
            return await authService.register(user)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const login = createAsyncThunk('auth/login',
    async (user: UserLogin, thunkAPI) => {
        try {
            return await authService.login(user)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer
