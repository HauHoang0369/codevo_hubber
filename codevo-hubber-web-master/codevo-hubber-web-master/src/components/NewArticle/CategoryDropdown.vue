<script setup>
import { computed, onMounted, ref } from 'vue'
import ChannelDropdown from '@/components/NewArticle/ChannelDropdown'
import ChevronDownIcon from '@/assets/icons/icon-system-chevron-down@2x.png'
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'

import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
import { useStore } from 'vuex'
import { includesLowStr } from '@/utils/util'
import CategoriesService from '@/services/Categories/CategoriesService'

// eslint-disable-next-line no-unused-vars,no-undef
const props = defineProps({
  categoryCode: {
    type: String,
  },
})

const store = useStore()

const isDisplayContainer = ref(false)
const searchQuery = ref('')
const categories = ref([])
const category = ref(null)
const categoryCode = ref(props.categoryCode)
const channels = ref(store.state.articles.channels)

const filterCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value
  }
  return categories.value.filter((category) =>
    includesLowStr(category.name, searchQuery.value)
  )
})

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

const onCategoryChange = async (newCategory, isChanged) => {
  if (isChanged) {
    category.value = newCategory
    showHideContainer(false)
    const categoryService = new CategoriesService()
    const { content } = await categoryService.getChannels(newCategory.code)

    channels.value = content
  }
}

onMounted(async () => {
  categories.value = await store.getters['categories/getCategories']
  if (!categories.value.length) {
    await store.dispatch('categories/callCategories')
    categories.value = await store.getters['categories/getCategories']
  }
  category.value = categories.value.find((c) => c.code === categoryCode.value)
  channels.value = store.state.articles.channels
  // Set current channel
  await store.commit(
    'articles/setSelectedChannelEdit',
    store.state.articles.channels.find(
      (ch) => ch.id === store.state.articles.channelId
    )
  )
})
</script>

<template>
  <div>
    <div
      class="dropdown bg-white d-flex flex-row align-center justify-space-between pl-4 pr-4"
      @click="onToggleDisplayContainer()"
    >
      <div class="dropdown-placeholder">
        {{ category?.name || 'Seleziona una categoria' }}
      </div>
      <img
        :src="ChevronDownIcon"
        class="chevron-down-icon"
        alt="Select category"
      />
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
              placeholder="Cerca un categoria"
              type="text"
            />
          </div>
          <img
            :src="SearchIcon"
            alt="Search"
            class="search-icon position-absolute d-flex justify-end mr-4"
          />
        </div>

        <div class="extend-items flex-grow-1">
          <div
            v-for="item in filterCategories"
            :key="item.id"
            class="d-flex flex-row justify-space-between align-center"
            :class="{ 'cursor-default': item.code === category.code }"
            @click.prevent="onCategoryChange(item, item.code !== category.code)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div
              v-if="item.code === category.code"
              class="tick-icon rounded-circle"
            >
              <img :src="CheckIcon" class="fill-height" alt="Check" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChannelDropdown :categoryChannels="channels" class="my-6" />
  </div>
</template>

<style lang="scss" scoped>
.dropdown-placeholder {
  color: var(--text);
}

.cursor-default {
  cursor: default;
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
