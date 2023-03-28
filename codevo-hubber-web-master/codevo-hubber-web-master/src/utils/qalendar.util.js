import { now } from './day.util'

export const isDurationShort = (start, end) => {
  const duration = now().diff(start, 'minutes') - now().diff(end, 'minutes')

  if (duration <= 30) return true
  return false
}

export const highlightToday = () => {
  const today = now(new Date()).format('D')

  // Get index of timeline header with today's date
  const collection = document.getElementsByClassName('week-timeline__date')
  const collectionArray = [...collection]
  const todayIndex = collectionArray.findIndex(
    (date) => date.innerHTML === today
  )

  // Append highlight class to the day column with same index as the timeline header
  const dayColumns = document.getElementsByClassName('calendar-week__day')
  const currentDayColumn = [...dayColumns][todayIndex]
  const currentDayIntervals = [...currentDayColumn.children].filter((item) =>
    [...item.classList].includes('calendar-week__day-interval')
  )
  currentDayIntervals.forEach((item) => item.classList.add('is-today'))

  return currentDayColumn
}

export const highlightSelected = (itemToSelect, isClickEvent) => {
  const timelineCollection =
    document.getElementsByClassName('week-timeline__day')
  const dayColumnsCollection =
    document.getElementsByClassName('calendar-week__day')
  const dayColumnsCollectionArray = [...dayColumnsCollection]

  if (isClickEvent) {
    // Remove highlight from previous selected
    const selectedCollection = document.getElementsByClassName('is-today')
    const selectedCollectionArray = [...selectedCollection]
    selectedCollectionArray.forEach((item) => item.classList.remove('is-today'))

    //Add highlight to newly selected
    const intervalsToSelect = [...itemToSelect.children].filter((item) =>
      [...item.classList].includes('calendar-week__day-interval')
    )
    intervalsToSelect.forEach((item) => item.classList.add('is-today'))

    const newSelectedDayIndex = dayColumnsCollectionArray.findIndex(
      (item) => item === itemToSelect
    )

    timelineCollection.item(newSelectedDayIndex).classList.add('is-today')
  } else {
    const timelineCollectionClassLists = [...timelineCollection].map(
      (item) => item.classList
    )
    const selectedTimelineIndex = timelineCollectionClassLists.findIndex(
      (className) => [...className].includes('is-today')
    )
    const columnChildren = [
      ...dayColumnsCollectionArray[selectedTimelineIndex].children,
    ].filter((t) => [...t.classList].includes('calendar-week__day-interval'))

    columnChildren.forEach((item) => item.classList.add('is-today'))
  }
}
