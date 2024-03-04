const dateFormatter = new Intl.DateTimeFormat(`ru-RU`)
export const formatDate = (date: Date) => dateFormatter.format(date)

const units = {
  day: 24 * 60 * 60 * 1000,
  format: {
    day: ['день', 'дня', 'дней'],
    hour: ['час', 'часа', 'часов'],
    minute: ['минуту', 'минуты', 'минут'],
    month: ['месяц', 'месяца', 'месяцев'],
    year: ['год', 'года', 'лет'],
  },
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  year: 24 * 60 * 60 * 1000 * 365,
}

function getFormat(unit: string[], value: number): string {
  if (value % 10 === 1 && value !== 11) {
    return unit[0] ?? ''
  } else if (
    (value % 10 === 2 || value % 10 === 3 || value % 10 === 4) &&
    (value < 10 || value > 20)
  ) {
    return unit[1] ?? ''
  } else {
    return unit[2] ?? ''
  }
}
export function formatDateHelper(dateInput: Date) {
  const date = dateInput.getTime()

  const now = new Date().getTime()
  const elapsed = now - date
  let result = ''

  if (elapsed < units.minute) {
    result = 'минуту назад'
  } else if (elapsed < units.hour) {
    const minutes = Math.floor(elapsed / units.minute)
    result = minutes + ' ' + getFormat(units.format.minute, minutes) + ' назад'
  } else if (elapsed < units.day) {
    const hours = Math.floor(elapsed / units.hour)
    result = hours + ' ' + getFormat(units.format.hour, hours) + ' назад'
  } else if (elapsed < units.day * 2) {
    result = 'вчера'
  } else if (elapsed < units.month) {
    const days = Math.floor(elapsed / units.day)
    result = days + ' ' + getFormat(units.format.day, days) + ' назад'
  } else if (elapsed < units.year) {
    const months = Math.floor(elapsed / units.month)
    result = months + ' ' + getFormat(units.format.month, months) + ' назад'
  } else if (elapsed < units.year * 2) {
    result = getFormat(units.format.year, 1) + ' назад'
  } else {
    result = 'более двух лет назад'
  }

  return result
}
