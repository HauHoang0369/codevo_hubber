<template>
  <div class="header">
    <div class="text-h3 mb-12">
      {{ $t('MAIN_MENU_MYACTIVITIES') }}
    </div>
    <div
      class="d-flex align-center justify-space-between activities-date-container"
    >
      <div class="d-flex align-center first-row">
        <CustomDateRangePicker v-model="dates" />
        <div class="d-flex align-center activities-btn-container">
          <div class="date-filter"><p>Giorno</p></div>
          <div class="date-filter"><p>Settimana</p></div>
          <div class="date-filter"><p>Mese</p></div>
        </div>
      </div>
      <div>
        <v-btn
          variant="text"
          class="activities-add"
          @click="openAddActivityModal"
        >
          <PlusIcon class="pr-1" fill="#00604b" />
          {{ $t('MYACTIVITIES_ADD_ACTIVITY_CAPTION') }}</v-btn
        >
      </div>
    </div>

    <div
      class="d-flex align-center justify-space-between"
      :class="view !== 'scheduler' ? 'mb-11' : 'mb-5'"
    >
      <div class="d-flex align-center activities-view-type">
        <v-btn
          icon
          class="activities-views-btn"
          :class="view === 'scheduler' && 'selected'"
          @click="() => handleChangeView('scheduler')"
        >
          <CalendarIcon />
        </v-btn>
        <v-btn
          icon
          class="activities-views-btn"
          :class="view === 'list' && 'selected'"
          @click="() => handleChangeView('list')"
        >
          <ListViewIcon />
        </v-btn>
        <v-btn
          icon
          class="activities-views-btn"
          :class="view === 'grid' && 'selected'"
          @click="() => handleChangeView('grid')"
        >
          <GridViewIcon />
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <div>
          <span>
            <v-btn
              icon
              class="activities-views-btn mr-2"
              :class="showPersonalActivity && 'selected'"
              @click="handleShowPersonalActivitiesOnly"
            >
              <UserIcon
            /></v-btn>
            <v-btn
              icon
              class="activities-views-btn mr-5"
              :class="!showPersonalActivity && 'selected'"
              @click="handleShowAllActivities"
              ><GroupIcon
            /></v-btn>
          </span>
        </div>
        <v-divider class="mr-7" vertical />

        <div class="filter-button">
          <FilterIcon />
        </div>
      </div>
    </div>
  </div>

  <div v-if="view === 'scheduler'">
    <Scheduler :data="data" />
  </div>

  <div v-else class="card-views">
    <div v-if="view === 'list'" class="d-flex align-center justify-end mb-5">
      <CustomSelectBoxVue class="input-select" :label="'Per nome cliente AZ'" />
    </div>

    <div class="mb-15">
      <div class="text-h6 mb-8">
        {{ $t('MAIN_MENU_MYACTIVITIES') }}
      </div>
      <div
        class="d-flex align-center activities-cards"
        :class="view === 'list' && 'flex-column'"
      >
        <ActivityCard
          v-for="activity in data"
          :activity="activity"
          :view="view"
        />
      </div>
    </div>

    <div v-if="!showPersonalActivity" class="mb-15">
      <div class="text-h6 mb-8">
        {{ $t('MYACTIVITIES_MYACTIVITIES_CARD_VIEW_TITLE') }}
      </div>
      <div
        class="d-flex align-center activities-cards"
        :class="view === 'list' && 'flex-column'"
      >
        <ActivityCard
          v-for="activity in data"
          :activity="activity"
          :view="view"
        />
      </div>
    </div>

    <div v-if="!showPersonalActivity">
      <div class="text-h6 mb-8">
        {{ $t('MYACTIVITIES_MYACTIVITIES_CARD_VIEW_TITLE') }}
        <span>Tommaso Crociera</span>
      </div>
      <div
        class="d-flex align-center activities-cards"
        :class="view === 'list' && 'flex-column'"
      >
        <ActivityCard
          v-for="activity in data"
          :activity="activity"
          :view="view"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { now } from '@/utils/day.util'
import Scheduler from '@/components/Scheduler/Scheduler'
import CalendarIcon from '@/components/base/icons/CalendarIcon'
import ListViewIcon from '@/components/base/icons/ListViewIcon'
import GridViewIcon from '@/components/base/icons/GridViewIcon'
import PlusIcon from '@/components/base/icons/PlusIcon'
import FilterIcon from '@/components/base/icons/FilterIcon'
import UserIcon from '@/components/base/icons/UserIcon'
import GroupIcon from '@/components/base/icons/GroupIcon'
import ActivityCard from '@/components/ActivityCard/ActivityCard'
import CustomSelectBoxVue from '@/components/base/inputs/CustomSelectBox.vue'
import CustomDateRangePicker from '@/components/base/inputs/CustomDateRangePicker.vue'
import { ref } from 'vue'

const data = [
  {
    type: 'WORK',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-20 09:00',
    endDate: '2023-03-20 10:00',
    status: 'Completato',
  },
  {
    type: 'VISIT',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-20 10:00',
    endDate: '2023-03-20 11:00',
    status: 'Non completato',
  },
  {
    type: 'TRAINING',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-21 10:00',
    endDate: '2023-03-21 11:30',
    status: 'Completato',
  },
  {
    type: 'WORK',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-22 10:00',
    endDate: '2023-03-22 11:00',
    status: 'Completato',
  },
  {
    type: 'MEETING',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-22 12:00',
    endDate: '2023-03-22 13:30',
    status: 'Assegnata',
  },
  {
    type: 'CLIENT',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-23 11:00',
    endDate: '2023-03-23 12:30',
    status: 'Assegnata',
  },
  {
    type: 'VISIT',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-24 09:30',
    endDate: '2023-03-24 10:00',
    status: 'Assegnata',
  },
  {
    type: 'VISIT',
    slot1: 'Nome cliente lorem ipsum',
    slot2: 'Oggetto della visita',
    text1: 'Campo cardine',
    date: '14/luglio/2021 - 10:00',
    startDate: '2023-03-24 10:00',
    endDate: '2023-03-24 10:30',
    status: 'Assegnata',
  },
]

const showPersonalActivity = ref(false)
const dates = ref([now(), now().add(8, 'day')])

const emit = defineEmits(['open-add-activity'])

const openAddActivityModal = () => emit('open-add-activity')

const handleShowPersonalActivitiesOnly = () =>
  (showPersonalActivity.value = true)

const handleShowAllActivities = () => (showPersonalActivity.value = false)
const view = ref('grid')

const handleChangeView = (viewString) => (view.value = viewString)
</script>

<style lang="scss" scoped>
@import '../../scss/style.scss';

.first-row {
  gap: 45px;
  font-weight: bold;

  p {
    cursor: pointer;
  }
}

.header {
  padding-left: 82px;
}

.card-views {
  padding-left: 82px;
}
.activities-date-container {
  margin-bottom: 28px;
}

.activities-btn-container {
  gap: 14px;
}

.activities-add {
  font-weight: 500;
}

.activities-views-btn {
  background-color: transparent;
  box-shadow: none;
}

.selected {
  svg {
    fill: $color-primary;
  }
}

.activities-view-type {
  gap: 8px;
}

.date-filter {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border-radius: 18px;
  min-height: 36px;

  &:hover {
    background-color: $color-background-blue;
  }

  &:focus-within {
    background-color: $color-primary-70;
    color: $color-white;
  }
}

.filter-button {
  width: 48px;
  height: 48px;
  background-color: $color-white;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.302);
  border-radius: 13px;
  padding: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.activities-cards {
  gap: 20px;
  flex-wrap: wrap;
}

.input-select {
  width: 240px;
}
</style>
