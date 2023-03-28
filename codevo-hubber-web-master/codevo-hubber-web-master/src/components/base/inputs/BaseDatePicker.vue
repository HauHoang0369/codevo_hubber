<template>
  <base-input :label="label" v-model="model" readonly>
    <template #append-inner>
      <Datepicker v-bind="attrs" auto-apply v-model="model">
        <template #trigger>
          <base-icon
            name="calendar"
            width="20"
            height="20"
            class="date-picker-icon"
          />
        </template>
        <template #time-picker> </template>
      </Datepicker>
    </template>
  </base-input>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { useAttrs, computed } from 'vue'

import Datepicker from '@vuepic/vue-datepicker'
import BaseInput from '@/components/base/inputs/BaseInput'
import { format } from '@/utils/day.util'
import { isUndefined } from 'lodash'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'

const props = defineProps({
  /**
   * Component model value
   */
  modelValue: {
    type: [Array, String, Number, Date],
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()
const { label, range, 'date-format': dateFormat } = attrs

const hasRange = !isUndefined(range)

const model = computed({
  get() {
    if (!props.modelValue) return props.modelValue

    return hasRange
      ? [props.modelValue].map((date) => format(date, dateFormat))
      : format(props.modelValue, dateFormat)
  },
  set(model) {
    emit('update:modelValue', model)
  },
})
</script>

<style lang="scss">
$dp__font_family: 'Ubuntu', sans-serif;
$dp__border_radius: 17px;
$dp__cell_border_radius: 5px;
$dp__font_size: 14px;

@import '@/../node_modules/@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';

.dp__theme_light {
  .dp__range_between {
    background-color: rgba($color-primary, 0.2);
    border: none;
  }
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
  border: none;
  background-color: rgba($color-primary, 0.2);
  color: var(--text);
}

.dp__cell_auto_range_start,
.dp__date_hover_start:hover,
.dp__range_start {
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
}

.dp__cell_auto_range_end,
.dp__date_hover_end:hover,
.dp__range_end {
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
}

.dp__today {
  border: none;
  color: var(--white) !important;
  background-image: linear-gradient(
    to top,
    var(--primary),
    var(--primary-dark)
  );

  &:hover {
    color: var(--text) !important;
  }
}

.date-picker {
  &-icon {
    cursor: pointer;
  }
}

.dp__menu {
  display: flex;
  flex-direction: column-reverse;
  border: none !important;
  border-radius: 20px;
  padding: 18px 22px 30px 22px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
}

.dp__calendar_header_separator {
  height: 0;
}

.dp__cell_inner {
  color: var(--text);
  font-weight: 500;
}

.dp__instance_calendar {
  & .dp__instance_calendar:last-of-type {
    border-left: 1px solid var(--grey);
  }
}

.dp__arrow_top {
  display: none;
}
</style>
