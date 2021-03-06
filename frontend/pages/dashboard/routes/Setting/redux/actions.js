/* eslint global-require: "off" */
import Push from 'push.js'
import { createActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'
import API from 'API'
import locales from 'LOCALES'
import refresher from 'UTILS/refresher'
import { REMOTE_ASSETS } from 'UTILS/constant'

const updateMsg = locales('github.message.update')

const {
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateStatus,
  initialResumeShareInfo,
  initialGithubShareInfo
} = createActions(
  'TOGGLE_GITHUB_MODAL',
  'TOGGLE_SETTING_LOADING',
  'SET_UPDATE_STATUS',
  'INITIAL_RESUME_SHARE_INFO',
  'INITIAL_GITHUB_SHARE_INFO',
)

// github data update
const fetchGithubUpdateStatus = () => (dispatch) => {
  API.github.getUpdateStatus().then((result) => {
    dispatch(setUpdateStatus(result))
  })
}

const refreshGithubDatas = () => (dispatch) => {
  dispatch(toggleSettingLoading(true))
  API.github.update().then(() => {
    refresher.fire(5000, (result) => {
      dispatch(setUpdateStatus(result))
      Push.create(updateMsg.header, {
        body: updateMsg.body,
        icon: REMOTE_ASSETS.NOTIFY_ICON,
        timeout: 3000
      })
    })
  })
}

// github share
const fetchGithubShareInfo = () => (dispatch) => {
  API.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareInfo(result))
  })
}

const postGithubShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().setting.githubInfo
  API.user.patchUserInfo({ githubShare: !openShare }).then(() => {
    dispatch(initialGithubShareInfo({
      openShare: !openShare
    }))
  })
}

// resume
const fetchResumeShareInfo = () => (dispatch) => {
  API.resume.getResumeInfo().then((result) => {
    dispatch(initialResumeShareInfo(result))
  })
}

const postResumeGithubStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const { useGithub, loading } = resumeInfo
  if (loading) return

  API.resume.patchResumeInfo({ useGithub: !useGithub }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      useGithub: !useGithub
    })))
  })
}

const postResumeShareStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const { openShare, loading } = resumeInfo
  if (loading) return

  API.resume.patchResumeInfo({ openShare: !openShare }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      openShare: !openShare
    })))
  })
}

const toggleResumeReminder = enable => (dispatch, getState) => {
  const { resumeInfo } = getState().setting

  const reminder = objectAssign({}, resumeInfo.reminder, { enable })

  API.resume.patchResumeInfo({ reminder }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      reminder
    })))
  })
}

const postResumeReminderChange = (key, value) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const preVal = resumeInfo.reminder[key]
  if (preVal === value) return

  const reminder = objectAssign({}, resumeInfo.reminder, { [key]: value })

  API.resume.patchResumeInfo({ reminder }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      reminder
    })))
  })
}

const toggleResumeSimplifyUrl = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const { simplifyUrl, loading } = resumeInfo
  if (loading) return

  API.resume.patchResumeInfo({ simplifyUrl: !simplifyUrl }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      simplifyUrl: !simplifyUrl
    })))
  })
}

const postResumeShareSection = (section, checked) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const github = objectAssign({}, resumeInfo.github, { [section]: checked })

  API.resume.patchResumeInfo({ github }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      github
    })))
  })
}

export default {
  // github
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateStatus,
  fetchGithubUpdateStatus,
  refreshGithubDatas,
  // github share
  fetchGithubShareInfo,
  initialGithubShareInfo,
  postGithubShareStatus,
  // resume
  initialResumeShareInfo,
  fetchResumeShareInfo,
  postResumeGithubStatus,
  postResumeShareStatus,
  toggleResumeReminder,
  postResumeReminderChange,
  toggleResumeSimplifyUrl,
  postResumeShareSection
}
