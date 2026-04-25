import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import experienceService from './experienceService'

type Experience = {
    _id?: string
    company: string
    position: string
    responsibilities?: string
    startYear: string
    endYear?: string
}

interface InitialState {
    experience: Experience[]
    isErrorExperience: boolean
    isSuccess: boolean
    isLoadingExperience: boolean
    messageExperience: string
}

const initialState: InitialState = {
    experience: [],
    isErrorExperience: false,
    isSuccess: false,
    isLoadingExperience: false,
    messageExperience: ''
}

const extractMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
        const e = err as { response?: { data?: { messageExperience?: string } }; message?: string }
        return e.response?.data?.messageExperience ?? e.message ?? String(err)
    }
    return String(err)
}

export const createExperience = createAsyncThunk(
    'experience/create',
    async (experience: Experience, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await experienceService.createExperience(experience, token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const getExperience = createAsyncThunk(
    'experience/getAll',
    async (_: void, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await experienceService.getExperience(token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const updateExperience = createAsyncThunk(
    'experience/update',
    async ({ id, data }: { id: string; data: Omit<Experience, '_id'> }, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await experienceService.updateExperience(id, data, token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const deleteExperience = createAsyncThunk(
    'experience/delete',
    async (id: string, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await experienceService.deleteExperience(id, token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const experienceSlice = createSlice({
    name: 'experience',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createExperience.pending, (state) => {
                state.isLoadingExperience = true
            })
            .addCase(createExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
                state.isLoadingExperience = false
                state.isSuccess = true
                state.experience = state.experience.concat(action.payload)
            })
            .addCase(createExperience.rejected, (state, action) => {
                state.isLoadingExperience = false
                state.isErrorExperience = true
                state.messageExperience = action.payload as string
            })
            .addCase(getExperience.pending, (state) => {
                state.isLoadingExperience = true
            })
            .addCase(getExperience.fulfilled, (state, action: PayloadAction<Experience[]>) => {
                state.isLoadingExperience = false
                state.isSuccess = true
                state.experience = action.payload
            })
            .addCase(getExperience.rejected, (state, action) => {
                state.isLoadingExperience = false
                state.isErrorExperience = true
                state.messageExperience = action.payload as string
            })
            .addCase(updateExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
                state.experience = state.experience.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                )
            })
            .addCase(deleteExperience.pending, (state) => {
                state.isLoadingExperience = true
            })
            .addCase(deleteExperience.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
                state.isLoadingExperience = false
                state.isSuccess = true
                state.experience = state.experience.filter(
                    (item) => item._id !== action.payload.id
                )
            })
            .addCase(deleteExperience.rejected, (state, action) => {
                state.isLoadingExperience = false
                state.isErrorExperience = true
                state.messageExperience = action.payload as string
            })
    }
})

export const { reset } = experienceSlice.actions
export default experienceSlice.reducer
