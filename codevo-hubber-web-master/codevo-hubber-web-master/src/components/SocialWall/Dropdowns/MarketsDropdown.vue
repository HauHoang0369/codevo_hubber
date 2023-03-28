<script setup>
import { computed, onMounted, ref } from 'vue'
// icons
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
// components
import AuthImage from '@/components/base/AuthImage/AuthImage'
// services
import MarketService from '@/services/Articles/MarketService'
// utils
import { includesLowStr } from '@/utils/util'
import { clone } from 'lodash'

const props = defineProps({
  selectedItems: Array,
})

const emit = defineEmits(['onMarketChange'])

const searchQuery = ref('')
const isLoading = ref(false)
const markets = ref([])
const selectedOptions = ref([])

const onSelect = (item) => {
  if (tickedChecking(item)) {
    // Remove tag
    emit('updateTag', item)
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.id !== item.id
    )
  } else {
    // Add tag
    emit(
      'updateTag',
      {
        id: item.id,
        category: 'MARKET',
        name: item.name,
      },
      false
    )
    selectedOptions.value.push({
      id: item.id,
      category: 'MARKET',
      name: item.name,
    })
  }
}

onMounted(async () => {
  await fetchMarkets()
  selectedOptions.value = clone(props.selectedItems || [])
})

const fetchMarkets = async () => {
  isLoading.value = true
  markets.value = await new MarketService().getMarkets()
  isLoading.value = false
}

const filterMarkets = computed(() => {
  if (!searchQuery.value) {
    return markets.value
  }

  return markets.value.filter((m) => includesLowStr(m.name, searchQuery.value))
})

const tickedChecking = (value) => {
  return selectedOptions.value.findIndex((v) => v.id === value.id) !== -1
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row align-center position-relative">
      <input
        v-model="searchQuery"
        class="search-input pl-4 w-100 pr-10"
        placeholder="Seleziona mercati"
        type="text"
      />
      <img
        :src="SearchIcon"
        alt="Search"
        class="search-icon position-absolute d-flex justify-end mr-4"
      />
    </div>

    <div class="extend-items flex-grow-1">
      <div
        v-for="item in filterMarkets"
        :key="item.id"
        class="d-flex flex-row align-center justify-space-between content"
        @click.prevent="onSelect(item)"
      >
        <div class="d-flex align-center content-info">
          <div class="icon flex-grow-1">
            <AuthImage :height="40" :path="item.imageUrl" :width="40" />
          </div>
          <div class="info">
            <div class="item-name">{{ item.name }}</div>
          </div>
        </div>
        <div v-if="tickedChecking(item)" class="tick-icon rounded-circle">
          <img :src="CheckIcon" alt="Check" class="fill-height" />
        </div>
      </div>
    </div>
    <div class="popup-shadow-box"></div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  cursor: pointer;
  position: relative;
  padding: 10px 0;
  border-bottom: solid 1px var(--grey);

  .content-info {
    min-height: 60px;
  }

  .info {
    align-items: center;
    margin-left: 12px;

    .item-name {
      font-size: 16px;
      font-weight: bold;
      color: var(--text);
    }

    .item-sub {
      font-size: 14px;
      color: var(--grey-dark);
    }
  }
}

.popup-shadow-box {
  position: relative;
  top: -50px;
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--white) 82%
  );
}

.extend-items {
  margin-top: 19px;
  max-height: 317px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  margin-bottom: 10px;
  cursor: pointer;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7.5px;
    background-color: var(--grey);
  }

  .icon {
    width: 40px;
    height: 40px;
  }
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
</style>
