
import { cloneElement } from 'react'
import deepcopy from 'deepcopy'
import objectAssign from 'UTILS/object-assign'
import { validateSocialLinks } from 'UTILS/resume'
import dateHelper from 'UTILS/date'
import { sortBySeconds, isUrl } from 'UTILS/helper'
import { formatUrl } from 'UTILS/formatter'
import { LINK_NAMES } from 'UTILS/constant/resume'

const validateDate = dateHelper.validator.date
const sortByDate = sortBySeconds('startTime', -1)
const getLinkText = social =>
  social.text
  || LINK_NAMES[social.name]
  || LINK_NAMES[social.name.toLowerCase()]
  || social.name

const formatResume = (resume) => {
  const {
    others,
    educations,
    workExperiences,
    personalProjects,
    customModules = []
  } = resume
  const { socialLinks } = others

  const formatWorkExperiences = workExperiences
    .sort(sortByDate)
    .reduce((list, experience) => {
      if (!experience.company) return list

      const {
        url,
        company,
        startTime,
        endTime,
        position,
        projects,
        untilNow
      } = experience

      const validateEnd = untilNow
        ? '至今'
        : validateDate(endTime)
      list.push({
        company,
        position,
        untilNow,
        url: formatUrl(url),
        endTime: validateEnd,
        startTime: validateDate(startTime),
        projects: projects
          .reduce((pList, project) => {
            if (!project.name) return pList
            pList.push(
              objectAssign({}, deepcopy(project), {
                url: formatUrl(project.url)
              })
            )
            return pList
          }, [])
      })
      return list
    }, [])

  const formatEducations = educations
    .sort(sortByDate)
    .reduce((list, edu) => {
      if (!edu.school) return list
      const {
        major,
        school,
        endTime,
        education,
        startTime,
        experiences = []
      } = edu

      list.push({
        school,
        major,
        education,
        experiences,
        endTime: validateDate(endTime),
        startTime: validateDate(startTime)
      })
      return list
    }, [])

  const formatPersonalProjects = personalProjects
    .reduce((list, project) => {
      if (!project.title) return list
      list.push(
        objectAssign({}, deepcopy(project), {
          url: formatUrl(project.url)
        })
      )
      return list
    }, [])

  const formatSocials = validateSocialLinks(socialLinks)
    .reduce((list, social) => {
      const { url } = social
      if (!isUrl(url)) return list

      list.push(objectAssign({}, deepcopy(social), {
        text: getLinkText(social),
        validateUrl: formatUrl(url)
      }))
      return list
    }, [])

  const formattedModules = customModules
    .reduce((list, module) => {
      if (!module.text) return list
      const { sections = [] } = module
      if (!sections.some(section => section.title)) return list

      list.push(
        objectAssign({}, deepcopy(module), {
          url: formatUrl(module.url)
        })
      )
      return list
    }, [])

  return objectAssign({}, resume, {
    educations: formatEducations,
    workExperiences: formatWorkExperiences,
    personalProjects: formatPersonalProjects,
    others: objectAssign({}, deepcopy(others), {
      socialLinks: formatSocials
    }),
    customModules: formattedModules
  })
}

const ResumeFormatter = (props) => {
  const { resume, children } = props
  const componentProps = objectAssign({}, props)
  delete componentProps.resume
  delete componentProps.children

  const component = cloneElement(children, {
    ...componentProps,
    resume: formatResume(resume)
  })
  return component
}

export default ResumeFormatter
