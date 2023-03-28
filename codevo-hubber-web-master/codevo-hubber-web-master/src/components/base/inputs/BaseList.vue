<template>
  <v-card class="base-list">
    <ul ref="baseList" @scroll="loadMore">
      <li
        class="base-list-item"
        :class="{ active: active === item[valueProperty] }"
        v-for="item in items"
        :key="item[valueProperty]"
        @click="onSelectItem(item)"
      >
        <slot name="list-item">
          {{ item[labelProperty] }}
        </slot>
      </li>
    </ul>

    <div
      v-if="isLoading"
      class="d-flex spinning justify-center align-center pt-3"
    >
      <v-progress-circular indeterminate size="50"></v-progress-circular>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  active: {
    default: null,
  },
  labelProperty: {
    type: String,
    default: 'label',
  },
  valueProperty: {
    type: String,
    default: 'value',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  infiniteScroll: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['change', 'load-more'])
const onSelectItem = (item) =>
  emit('change', {
    label: item[props.labelProperty],
    value: item[props.valueProperty],
  })

const baseList = ref(null)
const loadMore = () => {
  if (props.isLoading || !props.infiniteScroll) {
    return
  }

  if (
    baseList.value.offsetHeight + baseList.value.scrollTop >=
    baseList.value.scrollHeight
  ) {
    emit('load-more')
  }
}
</script>

<style lang="scss">
.base-list {
  &.v-card {
    border-radius: 20px;
    box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 100px;
    width: 100%;
    z-index: 100;
  }

  ul {
    list-style: none;
    overflow: auto;
    max-height: 260px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 7.5px;
      background-color: var(--grey);
    }
  }

  &-item {
    padding: 14px;
    cursor: pointer;
    color: var(--text);

    &:hover {
      background-color: var(--background-blue);
    }

    &.active {
      background-color: var(--background-blue);
    }
  }
}
</style>
