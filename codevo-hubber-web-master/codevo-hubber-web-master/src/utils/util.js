import { isNil } from 'lodash'
import AppService from '@/services/App/AppService'

export const authImage = async ({
  name,
  path,
  width = 100,
  height = 100,
  hideLoader = true,
}) => {
  const data = await new AppService().service.getAuthImage({
    path: path.replaceAll('/', '!'),
    width,
    height,
    hideLoader,
  })

  return new File(
    [new Blob([data], { type: 'application/octet-stream' })],
    name,
    { type: 'application/octet-stream' }
  )
}

export const includesLowStr = (str, includesStr) => {
  if (isNil(str) || isNil(includesStr)) {
    return false
  }

  return `${str}`.toLowerCase().includes(`${includesStr}`.toLowerCase())
}

export const capitalize = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str
}

export const readableSize = (size) =>
  size < 1024
    ? size
    : size < 1048576
    ? '' + Math.round((size / 1024) * 10) / 10 + 'K'
    : size < 1073741824
    ? '' + Math.round((size / 1048576) * 10) / 10 + 'M'
    : '' + Math.round((size / 1073741824) * 10) / 10 + 'G'
