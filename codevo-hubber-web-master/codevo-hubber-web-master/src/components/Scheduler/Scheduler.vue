<template>
  <div class="scheduler">
    <Qalendar
      :events="events"
      :config="config"
      :selected-date="new Date('2023-03-20')"
      @event-was-dragged="updateScheduler"
      @event-was-clicked="(event) => onEventClick(event)"
    >
      <template #customCurrentTime></template>
      <template #weekDayEvent="eventProps">
        <div
          v-if="
            isDurationShort(
              eventProps.eventData.time.start,
              eventProps.eventData.time.end
            )
          "
          class="event short-event"
          :class="eventProps.eventData.color"
        >
          <p class="text-text min-width-0 text-ellipsis">
            {{ eventProps.eventData.title }}
          </p>
          <span
            class="oval"
            :class="'oval-' + eventProps.eventData.color"
          ></span>
        </div>

        <div
          v-else
          class="event long-event"
          :class="eventProps.eventData.color"
        >
          <div class="mt-4">
            <img
              v-if="eventProps.eventData.type === 'MEETING'"
              :src="MeetingIcon"
              class="activity-icon"
            />
            <img
              v-else-if="eventProps.eventData.type === 'VISIT'"
              :src="VisitingIcon"
              class="activity-icon"
            />
            <img
              v-else-if="eventProps.eventData.type === 'WORK'"
              :src="WorkIcon"
              class="activity-icon"
            />
            <img
              v-else-if="eventProps.eventData.type === 'TRAINING'"
              :src="TrainingIcon"
              class="activity-icon"
            />
            <img
              v-else-if="eventProps.eventData.type === 'CLIENT'"
              :src="ClientIcon"
              class="activity-icon"
            />
          </div>
          <div class="d-flex flex-column min-width-0">
            <div class="details">
              <div>
                <p class="text-text text-sm min-width-0 text-ellipsis">
                  {{ eventProps.eventData.title }}
                </p>
                <p class="text-text text-sm bold min-width-0 text-ellipsis">
                  {{ eventProps.eventData.task }}
                </p>
              </div>
              <div>
                <p class="d-flex align-center">
                  <span
                    class="oval mr-1"
                    :class="'oval-' + eventProps.eventData.color"
                  ></span>
                  <span class="text-sm text-text min-width-0 text-ellipsis">{{
                    eventProps.eventData.status
                  }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Qalendar>
  </div>
</template>

<script>
import { Qalendar } from 'qalendar'
import { now } from '@/utils/day.util'
import {
  highlightToday,
  highlightSelected,
  isDurationShort,
} from '@/utils/qalendar.util'

import MeetingIcon from '@/assets/icons/MeetingIcon.svg'
import VisitingIcon from '@/assets/icons/VisitingIcon.svg'
import WorkIcon from '@/assets/icons/WorkIcon.svg'
import TrainingIcon from '@/assets/icons/TrainingIcon.svg'
import ClientIcon from '@/assets/icons/ClientIcon.svg'

export default {
  props: ['data'],
  components: {
    Qalendar,
  },

  data() {
    return {
      events: this.data.map((datum, index) => {
        return {
          id: index,
          title: datum.text1,
          time: { start: datum.startDate, end: datum.endDate },
          color: datum.status.toLowerCase().split(' ').join('-'),
          status: datum.status,
          task: datum.slot2,
          type: datum.type,
          isEditable: true,
          isCustom: true,
        }
      }),
      isToday: true,
      selectedDayColumn: null,
      config: {
        week: {
          scrollToHour: 5,
        },
        dayIntervals: {
          length: 30,
          height: 38,
          displayClickableInterval: true,
        },
        defaultMode: 'week',
        disableModes: ['month'],
        eventDialog: {
          isDisabled: true,
          isCustom: true,
        },
      },
    }
  },
  methods: {
    handleHightlight() {
      if (this.isToday) {
        this.selectedDayColumn = highlightToday()
      } else {
        highlightSelected(this.selectedDayColumn, false)
      }
    },

    onEventClick(event) {
      this.isToday = false
      this.selectedDayColumn = event.eventElement.parentNode
      highlightSelected(this.selectedDayColumn, true)
    },

    updateScheduler() {
      setTimeout(() => {
        this.handleHightlight()
      })
    },
  },
  setup() {
    return {
      now,
      isDurationShort,
      WorkIcon,
      TrainingIcon,
      VisitingIcon,
      MeetingIcon,
      ClientIcon,
    }
  },

  mounted() {
    this.updateScheduler()
  },
}
</script>

<style>
@import '../../../node_modules/qalendar/dist/style.css';

.scheduler {
  height: 100vh;
  overflow: auto;
}

.is-today {
  background-color: rgba(0, 97, 76, 0.102) !important;
}

.is-today .week-timeline__date {
  background-color: transparent !important;
  color: var(--text) !important;
}

.bold {
  font-weight: bold;
}

.min-width-0 {
  min-width: 0;
}

.details {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 100%;
}

.calendar-root-wrapper .calendar-root {
  min-width: 1700px;
  border: none;
}

.calendar-header {
  display: none !important;
}

.calendar-week__event {
  z-index: 2 !important;
}

.calendar-week__day {
  padding: 0 5px;
  border: none !important;
}

.calendar-week__day:first-of-type {
  /* padding-left: 0; */
  border-inline-end: 0;
}

.calendar-week__day:last-of-type {
  /* padding-right: 0; */
}

.week-timeline {
  padding-bottom: 0 !important;
  padding-left: 0 !important;
  border-bottom: none !important;
  margin-left: 91px;
}

.week-timeline__day {
  margin: 0 5px;
  background-color: var(--white);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 13px 13px 31px 13px;
}

.week-timeline__day-name {
  color: var(--grey-dark) !important;
  font-size: 14px;
  font-weight: normal;
  font-size: 16px !important;
  font-weight: 500 !important;
  line-height: normal;
  letter-spacing: normal;
}

.week-timeline__date {
  margin-bottom: 0;
  color: var(--text);
  font-size: 20px !important;
  height: 23px !important;
  font-weight: 500;
  line-height: normal;
  letter-spacing: normal;
}

.day-timeline {
  z-index: 1;
  width: 100% !important;
  transform: none !important;
}

.day-timeline__hour:not(:last-child) {
  border-bottom: 1px dashed var(--grey-dark) !important;
  padding-left: 0;
}

.day-timeline__hour:first-child {
  border-top: 1px dashed var(--grey-dark) !important;
  padding-left: 0;
}

.day-timeline__hour-text {
  transform: translate(-91px) !important;
  font-size: 14px;
  font-weight: 500;
  color: var(--grey-dark);
  text-transform: lowercase;
}

.day-timeline__hour:first-child .day-timeline__hour-text {
  display: block !important;
}

.calendar-week__wrapper {
  padding-left: 91px !important;
}

.mode-is-day .week-timeline {
  width: auto !important;
}

.calendar-week__day .calendar-week__day-interval {
  padding: 0;
  color: transparent !important;
  background-color: var(--white);
}

.calendar-week__day .calendar-week__day-interval:last-of-type {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.calendar-week__day .calendar-week__day-interval.has-border {
  border-bottom: 1px dashed var(--grey-dark) !important;
}

.calender-week__day {
  z-index: 2;
}

.event {
  margin: 0 5px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid black;
  height: 100%;
  opacity: 0.7;
}

.short-event {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: normal;
}

.long-event {
  display: flex;
  gap: 13px;
  padding: 6px 8px;
}

.assegnata {
  background-color: rgba(240, 151, 58, 0.1);
  border-color: var(--orange);
}

.completato {
  background-color: rgba(0, 184, 153, 0.05);
  border-color: var(--verde-acqua);
}

.non-completato {
  background-color: rgba(255, 81, 110, 0.1);
  border-color: var(--rosso);
}

.oval {
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  background-color: var(--grey-dark);
}

.oval-assegnata {
  background-color: var(--orange);
}

.oval-completato {
  background-color: var(--verde-acqua);
}

.oval-non-completato {
  background-color: var(--rosso);
}

.activity-icon {
  height: 30px;
  width: 30px;
  object-fit: contain;
}
</style>
