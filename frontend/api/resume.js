
import API from './base'

const getResume = () => API.get('/resume/data')
const setResume = (resume, ...params) => API.put(`/resume/data?${params.join('&')}`, { resume })

const download = () => API.get('/resume/download')

const getPubResume = hash => API.get('/resume/shared/public', { hash })

const getResumeInfo = (options = {}) => {
  const { hash, userId } = options
  const qs = {}
  if (hash) qs.hash = hash
  if (userId) qs.userId = userId
  return API.get('/resume/info', qs)
}

const patchResumeInfo = info => API.patch('/resume/info', { info })

const getShareRecords = () => API.get('/resume/records')

export default {
  getResume,
  setResume,
  // =================================
  download,
  getPubResume,
  patchResumeInfo,
  getResumeInfo,
  getShareRecords
}
