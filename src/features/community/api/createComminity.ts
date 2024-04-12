import axios from 'axios'

export const createCommunity = async <T>(data: T) => {
  await axios.post('/api/communities/', data)
}