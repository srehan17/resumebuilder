import axios from 'axios'

const API_URL = '/api/education/'

const config = (token: string) => ({
    headers: { Authorization: `Bearer ${token}` }
})

const createEducation = async (educationData: object, token: string) => {
    const response = await axios.post(API_URL, educationData, config(token))
    return response.data
}

const getEducation = async (token: string) => {
    const response = await axios.get(API_URL, config(token))
    return response.data
}

const updateEducation = async (educationId: string, educationData: object, token: string) => {
    const response = await axios.put(API_URL + educationId, educationData, config(token))
    return response.data
}

const deleteEducation = async (educationId: string, token: string) => {
    const response = await axios.delete(API_URL + educationId, config(token))
    return response.data
}

export default { createEducation, getEducation, updateEducation, deleteEducation }
