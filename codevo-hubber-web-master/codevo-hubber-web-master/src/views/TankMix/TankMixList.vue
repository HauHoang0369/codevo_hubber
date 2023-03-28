<script setup>
import { TrailIcon } from '@/components/base/icons';
import Chip from '@/components/base/buttons/Chip';
import PlusIcon from '@/components/base/icons/PlusIcon';
import MixCombinationCard from '@/components/TankMix/MixCombinationCard';
import TankMixService from '@/services/TankMix/TankMixService';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const isLoading = ref(false)
let tankMixesPageable = ref({
  page: 0,
  size: 9,
  sort: 'asc',
})
const tankmixesEnvelope = ref({})
const tankmixes = ref([])
onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleTankMixesGridScroll)
})
const isLoadMoreInScreen = () => {
  let tankMixesLoadMoreItem = document.querySelector('#tank-mixes-load-more')
  // Check if our 0 height indicator item is in display,
  let pageTop = window.scrollY
  let pageBottom = pageTop + window.innerHeight
  let elementTop = tankMixesLoadMoreItem.offsetTop
  return elementTop <= pageBottom
}
const onHandleTankMixesGridScroll = async () => {
  // Only load new items if our indicator is in display and we are not on the last page
  if (isLoadMoreInScreen() && tankmixesEnvelope.value?.last === false) {
    // remove scroll listener while loading new tank mixes
    try {
      isLoading.value = true
      window.removeEventListener('scroll', onHandleTankMixesGridScroll)
      await onMoreloadTanKMixes()
    } catch (e) {
      isLoading.value = false
      window.addEventListener('scroll', onHandleTankMixesGridScroll)
    }
  }
}
const loadTanKMixes = async (initialLoad, hideLoader) => {
  try {
    window.removeEventListener('scroll', onHandleTankMixesGridScroll)
    if (initialLoad) {
      tankmixes.value.splice(0, tankmixes.value.length)
    }
    let tankMixParameters = {
      pageable: tankMixesPageable.value,
      hideLoader: hideLoader,
    }
    tankmixesEnvelope.value = await new TankMixService().service.getTankmixes(tankMixParameters)
    if (tankmixesEnvelope.value.content) {
      tankmixes.value.push(...tankmixesEnvelope.value.content)
    }
    window.addEventListener('scroll', onHandleTankMixesGridScroll)
  } catch (error) {
    window.addEventListener('scroll', onHandleTankMixesGridScroll)
    console.error(error)
  }
}
const onMoreloadTanKMixes = async () => {
  tankMixesPageable.value.page += 1
  await loadTanKMixes(false)
}
// TODO: check why reactive did not update on compute
let products = ref([])
let counts = ref({})
// let data = ref({})
const selectedTypeId = ref(-1)
// const isLastPage = ref(false)
//
// // TODO: Move to app settings
// const PAGE_SIZE = 10
// const pageable = ref(
//   {
//     offset: 0,
//     pageNumber: 0,
//     pageSize: 10,
//     paged: true,
//     unpaged: false,
//     sort: {
//       empty: true,
//       sorted: false,
//       unsorted: true,
//     }
//   }
// )
const types = [
  {
    id: 0,
    name: 'TANK_MIX_FEASIBILITY_FEASIBLE',
    value: 'feasible',
    colour: '#ffdb72',
  },
  {
    id: 1,
    name: 'TANK_MIX_FEASIBILITY_FEASIBLE_WITH_CAUTION',
    value: 'not feasible',
    colour: '#00b899',
  },
  {
    id: 2,
    name: 'TANK_MIX_FEASIBILITY_NOT_FEASIBLE',
    value: 'feasibile with caution',
    colour: '#ff516e',
  },
]
let mixData = [
  {
    id: 1,
    type: 0,
    producer: 'Valagro',
    products: ['Prodotto 1', 'Prodotto 2'],
    product_name: 'Lorem ipsum SpA',
    competitor_products: [
      {
        competitor: 'Lorem ipsum SpA',
        name: 'Lorem ipsum',
        ingredients: ['Calcio', 'Nitrogeno', 'Polisaccaridi'],
      },
    ],
    markets: ['ITALIA', 'SPAGNA', 'KENIA', 'USA', 'INDIA'],
    created_by: {
      name: 'Valagro',
      imageUrl: '',
    },
    isFavourite: false,
  },
  {
    id: 2,
    type: 1, //feasible, not feasible,feasibile with caution
    producer: 'Valagro',
    products: ['Prodotto 1', 'Prodotto 2'],
    product_name: 'Lorem ipsum SpA',
    competitor_products: [
      {
        competitor: 'Lorem ipsum SpA',
        name: 'Lorem ipsum',
        ingredients: ['Calcio', 'Nitrogeno', 'Polisaccaridi'],
      },
    ],
    markets: ['ITALIA', 'SPAGNA', 'KENIA', 'USA', 'INDIA'],
    created_by: {
      name: 'TOMMASO CROCIERA',
      imageUrl: '',
    },
    isFavourite: true,
  },
  {
    id: 3,
    type: 2, //feasible, not feasible,feasibile with caution
    producer: 'Valagro',
    products: ['Prodotto 1', 'Prodotto 2'],
    product_name: 'Lorem ipsum SpA',
    competitor_products: [
      {
        competitor: 'Lorem ipsum SpA',
        name: 'Lorem ipsum',
        ingredients: ['Calcio', 'Nitrogeno', 'Polisaccaridi'],
      },
    ],
    markets: ['ITALIA', 'SPAGNA', 'KENIA', 'USA', 'INDIA'],
    created_by: {
      name: 'TOMMASO CROCIERA',
      imageUrl: '',
    },
    isFavourite: true,
  },
]
onMounted(async () => {
  products.value = [...mixData]
  counts.value = countsByType(products.value)
  try {
    store.commit('setLoading', true)
    await loadTanKMixes(true, true)
    store.commit('setLoading', false)
  } catch (e) {
    store.commit('setLoading', false)
  }
})
// const loadSolutionListNextPage = async () => {
//   // try {
//   //   // Data.pageable will be undefined when called from nMounted, so default pageable value will be used in Service method
//   //   const pageable = data.value.pageable
//   //   const solutionData = await new ProductService().service.getSolutions(user.value.market.id, user.value.contentLanguage.id, pageable);
//   //   isLastPage.value = solutionData.last
//   //   solutions.push(...solutionData.content)
//   //   data.value = solutionData
//   // } catch (e) {
//   //   console.error(e)
//   // }
// }
//
// const onLoadMore = () => {
//   console.log("onLoadMore")
//   loadSolutionListNextPage()
// }
const filteredData = computed({
  get() {
    // TODO: Will be used for category filtering. Solution Data do not have any categgory information atm!
    if (selectedTypeId.value === -1) {
      return products.value
    }
    let filteredData = products.value.filter((value) => {
      return value.type === selectedTypeId.value
    })
    return filteredData
  },
})
const getType = (id) => {
  return types.find((value) => {
    return value.id === id
  })
}
const countsByType = (arr) => {
  const counts1 = {}
  arr.forEach((obj) => {
    if (counts1[obj.type]) {
      counts1[obj.type] += 1
    } else {
      counts1[obj.type] = 1
    }
  })
  return counts1
}
const getTypeCount = (type) => {
  return counts.value[type.id] ?? 0
}
const onSelectType = (type) => {
  if (selectedTypeId.value === type.id) {
    selectedTypeId.value = -1
  } else {
    selectedTypeId.value = type.id
  }
}
</script>
<template>
  <div class="tank-mix-list">
    <div class="page-header d-flex flex-column flex-md-row align-start align-md-center justify-space-between">
      <div class="tank-mix-title">{{ $t('TANK_MIX_SEARCH_RESULT_CAPTION') }}</div>

      <div class="align-self-end align-self-md-center d-flex flex-column flex-sm-row align-end align-sm-center mt-4 mt-md-0">
        <div class="action-button mr-4 mr-md-10">
          <TrailIcon class="action-button__icon" />
          <span>{{ $t('TANK_MIX_NEW_TRIAL_REQUEST') }}</span>
        </div>

        <div class="action-button mt-4 mt-sm-0">
          <PlusIcon class="action-button__icon" />

          <span>{{ $t('TANK_MIX_ADD_MIX_CAPTION') }}</span>
        </div>
      </div>
    </div>

    <div class="chip-list my-7">
      <Chip
        v-for="(type, index) in types"
        :key="index"
        :clickable="true"
        class="pa-2 chip-item"
        :selected="type.id === selectedTypeId"
        v-on:click="onSelectType(type)"
      >
        <span
          class="type-chip-icon rounded-circle"
          :style="{ 'background-color': type.colour }"
        ></span>
        <span class="type-chip-label ml-3"
          >{{ $t(type.name) }} ({{ getTypeCount(type) }})</span
        >
      </Chip>
    </div>

    <div class="d-flex align-center justify-end mb-7">
      <span class="search-result">{{$t('TANK_MIX_COUNT_RESULT_CAPTION')}}</span>
    </div>

    <div class="mix-card-grid">
      <MixCombinationCard
        :product="item"
        :type="getType(item.type)"
        v-for="(item, index) in filteredData"
        :key="index"
      ></MixCombinationCard>
      <!--      <div class="d-flex justify-center" v-if="isLastPage!==true && filteredData.length>0">-->
      <!--        <a @click.prevent="onLoadMore" href="#">-->
      <!--          Load More-->
      <!--        </a>-->
      <!--      </div>-->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tank-mix-list {
  .tank-mix-title {
    font-size: 40px;
    line-height: 50px;
    cursor: pointer;
  }

  .action-button {
    display: flex;
    align-items: flex-start;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }

    &__icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .filter-message {
    font-size: 14px;
    font-weight: normal;
  }
  &-filter-item {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    .v-input__details {
      display: none;
    }
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 20px;
  }

  .mix-card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px 40px;

    @media (min-width: 520px) {
      grid-template-columns: repeat(auto-fill, 360px);
    }
  }

  .type-chip-icon {
    height: 24px;
    width: 24px;
  }

  .type-chip-label {
    color: rgb(var(--primary));
  }

  #tank-mix-load-more {
    height: 50px;
  }

  .icon-system-trial {
    margin-right: 5px !important;
  }

  .plus-icon {
    margin-right: 5px;
    margin-left: 40px;
  }

  .chip-item {
    cursor: pointer;

    &:not(.selected) {
      background: white;
    }

  }

  .search-result {
    font-size: 14px;
    font-weight: 300;
    color: $color-text;
  }

}
</style>
