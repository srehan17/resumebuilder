import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import educationService from './educationService'

type Education = {
    _id?: string
    institution: string
    qualification: string
    gpa?: string
    startYear: string
    endYear?: string
}

interface InitialState {
    education: Education[]
    isErrorEducation: boolean
    isSuccess: boolean
    isLoadingEducation: boolean
    messageEducation: string
}

const initialState: InitialState = {
    education: [],
    isErrorEducation: false,
    isSuccess: false,
    isLoadingEducation: false,
    messageEducation: ''
}

const extractMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
        const e = err as { response?: { data?: { messageEducation?: string } }; message?: string }
        return e.response?.data?.messageEducation ?? e.message ?? String(err)
    }
    return String(err)
}

export const createEducation = createAsyncThunk(
    'education/create',
    async (education: Education, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await educationService.createEducation(education, token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const getEducation = createAsyncThunk(
    'education/getAll',
    async (_: void, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await educationService.getEducation(token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const updateEducation = createAsyncThunk(
    'education/update',
    async ({ id, data }: { id: string; data: Omit<Education, '_id'> }, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await educationService.updateEducation(id, data, token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const deleteEducation = createAsyncThunk(
    'education/delete',
    async (id: string, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await educationService.deleteEducation(id, token)
        } catch (err) {
            return thunkAPI.rejectWithValue(extractMessage(err))
        }
    }
)

export const educationSlice = createSlice({
    name: 'education',
    initialState,
    reducers: {
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEducation.pending, (state) => {
                state.isLoadingEducation = true
            })
            .addCase(createEducation.fulfilled, (state, action: PayloadAction<Education>) => {
                state.isLoadingEducation = false
                state.isSuccess = true
                state.education = state.education.concat(action.payload)
            })
            .addCase(createEducation.rejected, (state, action) => {
                state.isLoadingEducation = false
                state.isErrorEducation = true
                state.messageEducation = action.payload as string
            })
            .addCase(getEducation.pending, (state) => {
                state.isLoadingEducation = true
            })
            .addCase(getEducation.fulfilled, (state, action: PayloadAction<Education[]>) => {
                state.isLoadingEducation = false
                state.isSuccess = true
                state.education = action.payload
            })
            .addCase(getEducation.rejected, (state, action) => {
                state.isLoadingEducation = false
                state.isErrorEducation = true
                state.messageEducation = action.payload as string
            })
            .addCase(updateEducation.fulfilled, (state, action: PayloadAction<Education>) => {
                state.education = state.education.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                )
            })
            .addCase(deleteEducation.pending, (state) => {
                state.isLoadingEducation = true
            })
            .addCase(deleteEducation.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
                state.isLoadingEducation = false
                state.isSuccess = true
                state.education = state.education.filter(
                    (item) => item._id !== action.payload.id
                )
            })
            .addCase(deleteEducation.rejected, (state, action) => {
                state.isLoadingEducation = false
                state.isErrorEducation = true
                state.messageEducation = action.payload as string
            })
    }
})

export const { reset } = educationSlice.actions
export default educationSlice.reducer
