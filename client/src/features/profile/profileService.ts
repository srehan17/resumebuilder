import axios from 'axios'

const API_URL = '/api/profile/'

const config = (token: string) => ({
    headers: { Authorization: `Bearer ${token}` }
})

const createProfile = async (profileData: object, token: string) => {
    const response = await axios.post(API_URL, profileData, config(token))
    return response.data
}

const getProfile = async (token: string) => {
    const response = await axios.get(API_URL, config(token))
    return response.data
}

const deleteProfile = async (token: string) => {
    const response = await axios.delete(API_URL, config(token))
    return response.data
}

export default { createProfile, getProfile, deleteProfile }
