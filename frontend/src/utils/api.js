import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const uploadDocument = (file, docDate) => {
  const form = new FormData()
  form.append('file', file)
  form.append('doc_date', docDate)
  return api.post('/documents/upload', form)
}

export const getDocuments = () => api.get('/documents/')

export const sendChat = (query, sessionId = 'default') =>
  api.post('/chat/', { query, session_id: sessionId })

export const createCRMTicket = (query, response) =>
  api.post('/crm/ticket', { query, response })

export default api
