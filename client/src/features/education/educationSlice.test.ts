import educationReducer, { reset } from './educationSlice'

const initialState = {
    education: [],
    isErrorEducation: false,
    isSuccess: false,
    isLoadingEducation: false,
    messageEducation: ''
}

const sampleEdu = { _id: 'edu1', institution: 'MIT', qualification: 'BSc', startYear: '2018' }

describe('educationSlice reducer', () => {
    it('returns the initial state for unknown actions', () => {
        expect(educationReducer(undefined, { type: 'unknown' })).toMatchObject(initialState)
    })

    it('reset restores initial state', () => {
        const dirty = { ...initialState, isErrorEducation: true, messageEducation: 'err' }
        expect(educationReducer(dirty, reset())).toEqual(initialState)
    })

    it('createEducation/pending sets isLoadingEducation', () => {
        const result = educationReducer(initialState, { type: 'education/create/pending' })
        expect(result.isLoadingEducation).toBe(true)
    })

    it('createEducation/fulfilled appends the new entry', () => {
        const result = educationReducer(initialState, {
            type: 'education/create/fulfilled',
            payload: sampleEdu
        })
        expect(result.isSuccess).toBe(true)
        expect(result.education).toHaveLength(1)
        expect(result.education[0]).toEqual(sampleEdu)
    })

    it('createEducation/rejected sets isErrorEducation and message', () => {
        const result = educationReducer(initialState, {
            type: 'education/create/rejected',
            payload: 'Server error'
        })
        expect(result.isErrorEducation).toBe(true)
        expect(result.messageEducation).toBe('Server error')
    })

    it('getEducation/fulfilled replaces the education list', () => {
        const entries = [sampleEdu, { _id: 'edu2', institution: 'Oxford', qualification: 'MSc', startYear: '2021' }]
        const result = educationReducer(initialState, {
            type: 'education/getAll/fulfilled',
            payload: entries
        })
        expect(result.education).toHaveLength(2)
    })

    it('getEducation/rejected sets isErrorEducation', () => {
        const result = educationReducer(initialState, {
            type: 'education/getAll/rejected',
            payload: 'Fetch failed'
        })
        expect(result.isErrorEducation).toBe(true)
    })

    it('deleteEducation/fulfilled removes the entry by id', () => {
        const withEntry = { ...initialState, education: [sampleEdu] }
        const result = educationReducer(withEntry, {
            type: 'education/delete/fulfilled',
            payload: { id: 'edu1' }
        })
        expect(result.education).toHaveLength(0)
    })

    it('deleteEducation/fulfilled leaves other entries intact', () => {
        const edu2 = { _id: 'edu2', institution: 'Oxford', qualification: 'MSc', startYear: '2021' }
        const withTwo = { ...initialState, education: [sampleEdu, edu2] }
        const result = educationReducer(withTwo, {
            type: 'education/delete/fulfilled',
            payload: { id: 'edu1' }
        })
        expect(result.education).toHaveLength(1)
        expect(result.education[0]._id).toBe('edu2')
    })
})
