<script setup>
import { computed, ref, watch } from 'vue'
import ChevronDownIcon from '@/assets/icons/icon-system-chevron-down@2x.png'
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
import { includesLowStr } from '@/utils/util'
import { useStore } from 'vuex'

const props = defineProps({
  categoryChannels: {
    value: [],
  },
})

const store = useStore()

const isDisplayContainer = ref(false)
const searchQuery = ref('')

const channel = computed(() => store.getters['articles/getSelectedChannelEdit'])

// List channels
const channels = computed(() => {
  return props.categoryChannels
})

watch(
  () => props.categoryChannels,
  (newValue) => {
    const tmp = newValue.find((ch) => ch.id === channel.id)
    if (typeof tmp != 'undefined') {
      // Choose selected option
      store.commit('articles/setSelectedChannelEdit', tmp)
    } else if (newValue.length) {
      // Choose 1st channel
      store.commit('articles/setSelectedChannelEdit', newValue[0])
    }
  }
)

// List filtered channel
const filterChannels = computed(() => {
  if (!searchQuery.value) {
    return channels.value
  }
  return channels.value.filter((ch) =>
    includesLowStr(ch.name, searchQuery.value)
  )
})

// Toggle display list channel options
const onToggleDisplayContainer = async () => {
  showHideContainer(!isDisplayContainer.value)
}

const showHideContainer = (value) => {
  isDisplayContainer.value = value
}

const clickOutsideContainer = () => {
  if (isDisplayContainer.value === true) {
    showHideContainer(false)
  }
}

const onChannelChange = (newChannel) => {
  channel.value = newChannel
  store.commit('articles/setSelectedChannelEdit', newChannel)
  showHideContainer(false)
}
</script>

<template>
  <div>
    <div
      class="dropdown bg-white d-flex flex-row align-center justify-space-between pl-4 pr-4"
      @click="onToggleDisplayContainer()"
    >
      <div class="dropdown-placeholder">
        {{ channel?.name || 'Seleziona una canale' }}
      </div>
      <img :src="ChevronDownIcon" class="chevron-down-icon" alt="dropdown" />
    </div>
    <div
      v-if="isDisplayContainer === true"
      v-click-outside="clickOutsideContainer"
      class="list-items"
    >
      <div class="d-flex flex-column">
        <div class="d-flex flex-row align-center position-relative">
          <div class="flex-grow-1">
            <input
              v-model="searchQuery"
              class="search-input pl-4 w-100 pr-10"
              placeholder="Cerca un canale"
              type="text"
            />
          </div>
          <img
            alt="Search"
            :src="SearchIcon"
            class="search-icon position-absolute d-flex justify-end mr-4"
          />
        </div>

        <div class="extend-items flex-grow-1">
          <div
            v-for="item in filterChannels"
            :key="item.id"
            class="d-flex flex-row justify-space-between align-center"
            @click="onChannelChange(item)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div v-if="item.id === channel.id" class="tick-icon rounded-circle">
              <img :src="CheckIcon" class="fill-height" alt="Check" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-placeholder {
  color: var(--text);
}

.list-items {
  margin-top: 10px;

  .extend-items {
    height: 200px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    //row-gap: 30px;
    padding: 10px 20px;
    margin-bottom: 10px;
    cursor: pointer;

    .item-name {
      padding: 15px 0;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--text);
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 7.5px;
      background-color: var(--grey);
    }
  }
}

.dropdown {
  height: 55px;
  padding: 20px 15.8px;
  opacity: 0.7;
  border-radius: 17px;
  border: solid 1px var(--celeste);
  background-color: var(--white);
  cursor: pointer;
}

.search-input {
  height: 55px;
  background-color: var(--background-blue);
  border-radius: 17px;

  &:focus-visible,
  &:focus {
    outline: none;
  }

  &::-webkit-input-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }

  &:-moz-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }

  &::-moz-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }

  &:-ms-input-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }
}

.tick-icon {
  height: 23px;
  width: 23px;
  background-image: linear-gradient(to bottom, #009982, var(--primary));
}

.search-icon {
  height: 20px;
  width: 20px;
  z-index: 100;
  right: 0;
}

.chevron-down-icon {
  height: 20px;
  width: 20px;
}
</style>
