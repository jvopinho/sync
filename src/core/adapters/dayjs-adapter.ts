import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(LocalizedFormat)
dayjs.locale('pt-br')
dayjs.extend(utc)

export const dayjsAdapter = dayjs
