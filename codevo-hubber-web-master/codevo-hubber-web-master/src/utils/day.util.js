import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/it'

dayjs.extend(updateLocale)
dayjs.extend(customParseFormat)
dayjs.locale('it')

export const now = () => dayjs()

export const format = (date, format = 'DD MMM YYYY') =>
  dayjs(date).format(format)
