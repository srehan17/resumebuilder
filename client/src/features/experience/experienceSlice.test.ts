import experienceReducer, { reset } from './experienceSlice'

const initialState = {
    experience: [],
    isErrorExperience: false,
    isSuccess: false,
    isLoadingExperience: false,
    messageExperience: ''
}

const sampleExp = { _id: 'exp1', company: 'Acme', position: 'Dev', startYear: '2020' }

describe('experienceSlice reducer', () => {
    it('returns the initial state for unknown actions', () => {
        expect(experienceReducer(undefined, { type: 'unknown' })).toMatchObject(initialState)
    })

    it('reset restores initial state', () => {
        const dirty = { ...initialState, isErrorExperience: true, messageExperience: 'err' }
        expect(experienceReducer(dirty, reset())).toEqual(initialState)
    })

    it('createExperience/pending sets isLoadingExperience', () => {
        const result = experienceReducer(initialState, { type: 'experience/create/pending' })
        expect(result.isLoadingExperience).toBe(true)
    })

    it('createExperience/fulfilled appends the new entry', () => {
        const result = experienceReducer(initialState, {
            type: 'experience/create/fulfilled',
            payload: sampleExp
        })
        expect(result.isSuccess).toBe(true)
        expect(result.experience).toHaveLength(1)
        expect(result.experience[0]).toEqual(sampleExp)
    })

    it('createExperience/rejected sets isErrorExperience and message', () => {
        const result = experienceReducer(initialState, {
            type: 'experience/create/rejected',
            payload: 'Server error'
        })
        expect(result.isErrorExperience).toBe(true)
        expect(result.messageExperience).toBe('Server error')
    })

    it('getExperience/fulfilled replaces the experience list', () => {
        const experiences = [sampleExp, { _id: 'exp2', company: 'Corp B', position: 'Lead', startYear: '2022' }]
        const result = experienceReducer(initialState, {
            type: 'experience/getAll/fulfilled',
            payload: experiences
        })
        expect(result.experience).toHaveLength(2)
    })

    it('getExperience/rejected sets isErrorExperience', () => {
        const result = experienceReducer(initialState, {
            type: 'experience/getAll/rejected',
            payload: 'Fetch failed'
        })
        expect(result.isErrorExperience).toBe(true)
        expect(result.messageExperience).toBe('Fetch failed')
    })

    it('deleteExperience/fulfilled removes the entry by id', () => {
        const withEntry = { ...initialState, experience: [sampleExp] }
        const result = experienceReducer(withEntry, {
            type: 'experience/delete/fulfilled',
            payload: { id: 'exp1' }
        })
        expect(result.experience).toHaveLength(0)
    })

    it('deleteExperience/fulfilled leaves other entries intact', () => {
        const exp2 = { _id: 'exp2', company: 'Other', position: 'PM', startYear: '2021' }
        const withTwo = { ...initialState, experience: [sampleExp, exp2] }
        const result = experienceReducer(withTwo, {
            type: 'experience/delete/fulfilled',
            payload: { id: 'exp1' }
        })
        expect(result.experience).toHaveLength(1)
        expect(result.experience[0]._id).toBe('exp2')
    })
})
