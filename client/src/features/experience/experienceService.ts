import axios from 'axios'

const API_URL = '/api/experience/'

const config = (token: string) => ({
    headers: { Authorization: `Bearer ${token}` }
})

const createExperience = async (experienceData: object, token: string) => {
    const response = await axios.post(API_URL, experienceData, config(token))
    return response.data
}

const getExperience = async (token: string) => {
    const response = await axios.get(API_URL, config(token))
    return response.data
}

const updateExperience = async (experienceId: string, experienceData: object, token: string) => {
    const response = await axios.put(API_URL + experienceId, experienceData, config(token))
    return response.data
}

const deleteExperience = async (experienceId: string, token: string) => {
    const response = await axios.delete(API_URL + experienceId, config(token))
    return response.data
}

export default { createExperience, getExperience, updateExperience, deleteExperience }
