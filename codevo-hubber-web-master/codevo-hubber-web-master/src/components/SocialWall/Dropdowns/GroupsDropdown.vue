<script setup>
import { computed, onMounted, ref } from 'vue'
import { debounce } from 'lodash'
// icons
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
// components
import AuthImage from '@/components/base/AuthImage/AuthImage'
import Observer from '@/components/base/Observer/Observer.vue'
// services
import AppService from '@/services/App/AppService'

const props = defineProps({
  selectedItems: Array
})

const emit = defineEmits(['onSelectUserGroup'])

const selectedOptions = computed(() => props.selectedItems || [])
const searchQuery = ref('')
const isLoading = ref(false)
const dataList = ref([])
const data = ref({
  searchText: '',
  number: -1,
  totalPages: 0,
  last: false
})

const onSelect = (item) => {
  emit('onSelectUserGroup', item, tickedChecking(item))
}

onMounted(async () => {
  await searchData()
})

const searchData = async (name = '') => {
  if (isLoading.value) {
    return
  }
  if (data.value.last && data.value?.searchText === name) {
    // Last page (same query text)
    return
  }
  isLoading.value = true
  const result = await new AppService().service.getUserGroups(
    name,
    data.value.number + 1
  )
  dataList.value = [...dataList.value, ...result.content]
  delete result.content
  data.value = result
  data.value.searchText = name
  isLoading.value = false
}

const searchInput = debounce((event) => {
  searchQuery.value = event.target.value
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    data.value.number = -1
    data.value.totalPages = 0
    dataList.value = []
    searchData(searchQuery.value)
  }
}, 500)

const tickedChecking = (value) => {
  return selectedOptions.value.includes(value.id)
}
</script>

<template>
  <div class='d-flex flex-column'>
    <div class='d-flex flex-row align-center position-relative'>
      <input :value='searchQuery' class='search-input pl-4 w-100 pr-10' placeholder='Seleziona gruppo' type='text'
        @keyup='searchInput' />
      <img :src='SearchIcon' alt='Search' class='search-icon position-absolute d-flex justify-end mr-4' />
    </div>

    <div class='extend-items flex-grow-1'>
      <div v-for='item in dataList' :key='item.id' class='d-flex flex-row align-center justify-space-between content'
        @click.prevent='onSelect(item)'>
        <div class='d-flex align-center content-info'>
          <div class='icon flex-grow-1'>
            <AuthImage v-if='item.imageUrl' :path='item.imageUrl' :height='40' :width='40' />
            <img v-else :src='require(`@/assets/icons/visibility-3people.svg`)' alt='User Group' height='40'
              width='40' />
          </div>
          <div class='info'>
            <div class='item-name'>{{ item.name }}</div>
          </div>
        </div>
        <div v-if='tickedChecking(item)' class='tick-icon rounded-circle'>
          <img :src='CheckIcon' alt='Check' class='fill-height' />
        </div>
      </div>
      <div v-if='isLoading' class='d-flex spinning justify-center align-center pt-3'>
        <v-progress-circular indeterminate size='64'></v-progress-circular>
      </div>
      <Observer @intersect='searchData(searchQuery)' />
    </div>
    <div class='popup-shadow-box'></div>
  </div>
</template>

<style lang='scss' scoped>
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
  background-image: linear-gradient(to bottom,
      rgba(255, 255, 255, 0),
      var(--white) 82%);
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
