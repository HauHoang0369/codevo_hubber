<script setup>
import { computed, onMounted, ref } from 'vue'
// icons
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
// services
import ProductService from '@/services/Product/ProductService'
// utils
import { includesLowStr } from '@/utils/util'
import { clone } from 'lodash'

const props = defineProps({
  selectedItems: Array
})

const emit = defineEmits(['onSelectItem'])

const selectedOptions = ref([])

const searchQuery = ref('')
const isLoading = ref(false)
const data = ref([])


const onSelect = (item) => {
  if (tickedChecking(item)) {
    // Remove item
    emit('onSelectItem', item)
    selectedOptions.value = selectedOptions.value.filter((o) => o.id !== item.id)
  } else {
    // Add item
    emit('onSelectItem', item)
    selectedOptions.value.push(item)
  }
}

onMounted(async () => {
  await fetchData()
  selectedOptions.value = clone(props.selectedItems || [])
})

const fetchData = async () => {
  isLoading.value = true
  data.value = await new ProductService().getProductLines(0, true)

  isLoading.value = false
}

const filterData = computed(() => {
  if (!searchQuery.value) {
    return data.value
  }

  return data.value.filter((m) =>
    includesLowStr(m.name, searchQuery.value)
  )
})

const tickedChecking = (value) => {
  return selectedOptions.value.findIndex((v) => v.id === value.id) !== -1
}
</script>

<template>
  <div class='d-flex flex-column'>
    <div class='extend-items'>
      <div v-for='item in filterData' :key='item.id' class='d-flex flex-row align-center justify-space-between content'
           :class='{"selected-item" : tickedChecking(item)}'
        @click.prevent='onSelect(item)'>
        <div class='d-flex align-center content-info'>
          <div class='info'>
            <div class='item-name'>{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div v-if='isLoading' class='d-flex spinning justify-center align-center pt-3'>
        <v-progress-circular indeterminate size='64'></v-progress-circular>
      </div>
    </div>
    <div class='popup-shadow-box'></div>
  </div>
</template>

<style lang='scss' scoped>
.content {
  display: flex;
  cursor: pointer;
  position: relative;
  padding: 14px;
  color: var(--text);
  &:hover, .selected-item {
    background-color: var(--background-blue);
  }

  .info {
    align-items: center;

    .item-name {
      color: var(--text);
    }

    .item-sub {
      font-size: 14px;
      color: var(--grey-dark);
    }
  }
}

.popup-shadow-box {
  position: absolute;
  bottom: 0;
  height: 60px;
  width: 100%;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background-image: linear-gradient(to bottom,
      rgba(255, 255, 255, 0),
      var(--white) 82%);
}

.extend-items {
  max-height: 210px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
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
