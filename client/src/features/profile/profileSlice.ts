import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import profileService from './profileService'

const profile = JSON.parse(localStorage.getItem('profile')!)
// Added exclamation point / bang (!) directly after the parameter to JSON.parse(). 
// It tells the TypeScript compiler not to worry because the parameter will never be null which removes the TypeScript error.

type Profile = {
  _id?: string,
  name: string,
  phone: string,
  email?: string,
  location?: string
  linkedIn?: string
}

const initialState = {
  profile: profile ? profile : null,
  isErrorProfile: false,
  isSuccess: false,
  isLoadingProfile: false,
  messageProfile: ''
} 

const extractMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
        const e = err as { response?: { data?: { messageProfile?: string } }; message?: string }
        return e.response?.data?.messageProfile ?? e.message ?? String(err)
    }
    return String(err)
}

// create profile
export const createProfile = createAsyncThunk('profile/create',
  async (profile: Profile, thunkAPI : any) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await profileService.createProfile(profile, token)
    } catch(err) {
        return thunkAPI.rejectWithValue(extractMessage(err))
    }
})

export const deleteProfile = createAsyncThunk('profile/delete',
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await profileService.deleteProfile(token)
    } catch(err) {
        return thunkAPI.rejectWithValue(extractMessage(err))
    }
})

// get user profile
export const getProfile = createAsyncThunk('profile/getAll',
  async (_, thunkAPI : any) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await profileService.getProfile(token)
    } catch(err) {
        return thunkAPI.rejectWithValue(extractMessage(err))
    }
}) 

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProfile.pending, (state) => {
                state.isLoadingProfile = true
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.isLoadingProfile = false
                state.isSuccess = true
                state.profile = action.payload
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.isLoadingProfile = false
                state.isErrorProfile = true
                state.messageProfile = action.payload as string
            })
            .addCase(getProfile.pending, (state) => {
                state.isLoadingProfile = true
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoadingProfile = false
                state.isSuccess = true
                state.profile = action.payload
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoadingProfile = false
                state.isErrorProfile = true
                state.messageProfile = action.payload as string
            })
            .addCase(deleteProfile.fulfilled, (state) => {
                state.profile = null
            })
    }
})

export const { reset } = profileSlice.actions
export default profileSlice.reducer