<template>
  <div class="market-filter position-relative">
    <base-input solo label="Seleziona Mercati" readonly @click="onInputClick">
      <template #append-inner>
        <base-icon name="chevronDown" width="20" height="20" />
      </template>
    </base-input>

    <v-card
      v-if="showMarketList"
      class="market-filter-result position-absolute"
      ref="marketList"
    >
      <div class="d-flex flex-column py-5 position-relative">
        <base-input
          class="px-5"
          v-model="searchQuery"
          solo
          label="Seleziona Mercati"
          variant="search"
          @keyup="searchInput"
        >
          <template #append-inner>
            <base-icon name="search" width="20" height="20" />
          </template>
        </base-input>

        <div class="extend-items flex-grow-1">
          <div
            v-for="item in dataList"
            :key="item.id"
            class="w-100 d-flex flex-row align-center justify-space-between market-filter-content"
            @click.prevent="onSelect(item)"
          >
            <div class="d-flex align-center">
              <div class="icon">
                <auth-image
                  v-if="item.imageUrl"
                  :height="169"
                  :path="item.imageUrl"
                  :width="128"
                />
                <img
                  v-else
                  alt="Product Image"
                  src="/images/img-product-actiwave.png"
                />
              </div>
              <div class="market-filter-info">
                <div
                  v-if="item.productFamily?.id"
                  :style="{ backgroundColor: item.productFamily.color }"
                  class="item-code"
                >
                  {{ item.productFamily.code }}
                </div>
                <div class="item-name">{{ item.name }}</div>
              </div>
            </div>
            <div v-if="tickedChecking(item)" class="tick-icon rounded-circle">
              <img :src="CheckIcon" alt="Check" class="fill-height" />
            </div>
          </div>
          <div
            v-if="isLoading"
            class="d-flex spinning justify-center align-center pt-3"
          >
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </div>
          <Observer @intersect="searchData" />
        </div>
        <div class="popup-shadow-box"></div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { clone, debounce } from 'lodash'
import ProductService from '@/services/Product/ProductService'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import Observer from '@/components/base/Observer/Observer.vue'
import { onClickOutside } from '@vueuse/core'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'

const props = defineProps({
  selectedItems: Array,
})

const emit = defineEmits(['change'])
const store = useStore()

const user = computed(() => store.getters.getUser)
const selectedOptions = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const dataList = ref([])

const onSelect = (item) => {
  const index = selectedOptions.value.findIndex((v) => v.id === item.id)
  if (index > -1) {
    selectedOptions.value.splice(index, 1)
  } else {
    selectedOptions.value.push(item)
  }
  emit('change', selectedOptions.value)
}

onMounted(async () => {
  // await searchData()
  selectedOptions.value = clone(props.selectedItems) || []
})

const page = ref(0)
const searchData = async () => {
  try {
    isLoading.value = true

    const { content, first, last } =
      await new ProductService().service.searchMarket({
        name: searchQuery.value,
        description: searchQuery.value,
        page: page.value,
        marketId: user.value.market.id,
      })

    if (first) {
      dataList.value = content
    } else {
      dataList.value = [...dataList.value, ...content]
    }

    if (!last) {
      // not last page
      page.value++
    }
  } finally {
    isLoading.value = false
  }
}

const searchInput = debounce((event) => {
  searchQuery.value = event.target.value
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    searchData(searchQuery.value)
  }
}, 500)

const tickedChecking = (value) => {
  return selectedOptions.value.findIndex((v) => v.id === value.id) !== -1
}

const showMarketList = ref(false)
const marketList = ref(null)
onClickOutside(marketList, () => {
  showMarketList.value = false
})

const onInputClick = () => {
  showMarketList.value = true
  searchData(searchQuery.value)
}
</script>

<style lang="scss">
.market-filter {
  &-result {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
    background-color: var(--white);
  }

  &-content {
    display: flex;
    cursor: pointer;
    position: relative;
    padding: 10px 0;
    min-height: 75px;
    border-bottom: 1px solid var(--grey);

    .market-filter-info {
      align-items: center;
      margin-left: 12px;

      .item-name {
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--text);
        min-height: 22px;
        margin-top: 6px;
      }

      .item-code {
        display: inline;
        padding: 2px 5px;
        border-radius: 13.5px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: var(--white);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.market-filter-result {
  z-index: 100;
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
    display: flex;
    align-items: center;
    width: 46px;
    height: 65px;

    img {
      width: 35px;
      height: 35px;
      object-fit: unset;
      border-radius: 50%;
    }
  }
}

.tick-icon {
  height: 23px;
  width: 23px;
  background-image: linear-gradient(
    to bottom,
    var(--persian-green),
    var(--primary)
  );
}

.search-icon {
  height: 20px;
  width: 20px;
  z-index: 100;
  right: 0;
}
</style>
