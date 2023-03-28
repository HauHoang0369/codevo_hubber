<template #append-inner>
  <Datepicker
    range
    multi-calendars
    hide-offset-dates
    keep-action-row
    auto-apply
    close-on-scroll
    :alt-position="true"
    :enable-time-picker="false"
    position="left"
    v-model="dates"
    :locale="systemLanguage"
    @update:model-value="handleDate"
  >
    <template #trigger>
      <div class="d-flex align-center activities-date-selector">
        <v-btn icon class="activities-chevron-btn" @click.stop="">
          <ChevronLeftIcon />
        </v-btn>
        <p class="cursor-pointer capitalize">
          {{ format(dates[0]) }} - {{ format(dates[1]) }}
        </p>
        <v-btn icon class="activities-chevron-btn" @click.stop="">
          <ChevronRightIcon />
        </v-btn>
      </div>
    </template>

    <template
      #month-year="{ instance, handleMonthYearChange, month, year, months }"
    >
      <div v-if="!instance" class="header-left">
        <v-btn
          variant="text"
          class="chevron-btn right"
          icon
          @click="() => handleMonthYearChange(false)"
        >
          <ChevronLeftIcon />
        </v-btn>

        <div>
          <p class="month-year capitalize">
            <span class="mr-1">{{
              months.find((m) => m.value === month).text
            }}</span>
            <span>{{ year }}</span>
          </p>
        </div>
      </div>

      <div v-else class="header-right">
        <div>
          <p class="month-year capitalize">
            <span class="mr-1">{{
              months.find((m) => m.value === month).text
            }}</span>
            <span>{{ year }}</span>
          </p>
        </div>

        <v-btn
          variant="text"
          class="chevron-btn left"
          icon
          @click="() => handleMonthYearChange(true)"
        >
          <ChevronRightIcon />
        </v-btn>
      </div>
    </template>

    <template #calendar-header="{ day }">
      <p class="text-grey-dark capitalize">{{ day.split('')[0] }}</p>
    </template>

    <template class="action-row" #action-row>
      <div class="d-flex align-center date-inputs">
        <CustomSelectBox class="option-select" :label="'Settimana corrente'" />
        <CustomSelectBox
          class="date-select"
          :label="format(dates[0])"
          readonly
        />
        <CustomSelectBox
          class="date-select"
          :label="format(dates[1])"
          readonly
        />
      </div>
    </template>
  </Datepicker>
</template>

<script setup>
import CustomSelectBox from '@/components/base/inputs/CustomSelectBox.vue'
import ChevronLeftIcon from '@/components/base/icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '@/components/base/icons/ChevronRightIcon.vue'
import Datepicker from '@vuepic/vue-datepicker'
import { format } from '@/utils/day.util'
import { ref, computed } from 'vue'

import store from '@/store'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const user = computed(() => store.getters.getUser)

const dates = ref(props.modelValue)
const systemLanguage = ref(user.value.systemLanguage.isoCode)

const handleDate = () => emit('update:modelValue', dates)
</script>

<style lang="scss" scoped>
@import '../../../scss/style.scss';

.date-select {
  width: 155px;
}

.date-picker {
  text-align: center;
}

.option-select {
  width: 261px;
}

.date-inputs {
  gap: 9px;
  margin-bottom: 29px;
}

.action-row {
  display: block !important;
}

.cursor-pointer {
  cursor: pointer;
}

.chevron-btn {
  svg {
    height: 28px;
    width: 28px;
  }
}

.header-left {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.header-right {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.right {
  margin-right: 92px;
}

.left {
  margin-left: 92px;
}

.month-year {
  span {
    color: $color-text;
    font-weight: 500;
  }
}

.activities-chevron-btn {
  width: 32px;
  height: 32px;
  border-radius: 23px;
}
.activities-date-selector {
  gap: 20px;
}

.capitalize {
  text-transform: capitalize;
}
</style>
