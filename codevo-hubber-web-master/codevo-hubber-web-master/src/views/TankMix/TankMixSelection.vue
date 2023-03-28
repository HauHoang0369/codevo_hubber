<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import DropdownProduct from '@/components/Product/DropdownProduct'

const store = useStore()
const router = useRouter()

const mixProducts = computed(() => store.getters['tank_mix/getMix'])

onMounted(async () => {
  // On page init, clear store value
  store.commit('tank_mix/setMix', [])
})

const onSubmit = () => {
  // TODO:
  console.log('TankMix onSubmit')
}

const onExplore = () => {
  // TODO:
  console.log('TankMix onExplore')
  router.push('/tank-mix/list')
}

const submitDisabled = computed({
  get() {
    return mixProducts.value.length === 0
  },
})

const removeMixProduct = (item) => {
  // Need to create new array, just modifying array does not notify watcher
  let newArray = mixProducts.value.filter((value) => {
    return value.id !== item.id
  })
  store.commit('tank_mix/setMix', newArray)
}

const navigateToAdvanceSearch = () => {
  router.push('/tank-mix/advance-search');
};

</script>

<template>
  <div class="text-center flex-column d-flex">
    <div class="tank-page-title mt-6 mb-5">
      {{$t('TANK_MIX_HOME_TITLE')}}
    </div>
    <div class="tank-page-subtitle">
      {{$t('TANK_MIX_HOME_DESCRIPTION')}}
    </div>
    <div class="dropdown-select-container">
      <DropdownProduct
        :text="$t('TANK_MIX_HOME_FIND_PRODUCT')"
        :mix-products="mixProducts"
      ></DropdownProduct>
    </div>
    <div class="chips-container mt-2">
      <v-chip
        class="ma-2 product-chip"
        text-color="white"
        v-for="(item, index) in mixProducts"
        :key="index"
      >
        <span class="text-white">
          {{ item.name }}
        </span>
        <v-icon
          big
          right
          @click.stop="removeMixProduct(item)"
          class="pl-2 text-white"
          >mdi-close</v-icon
        >
      </v-chip>
    </div>
    <div class="mt-10">
      <ButtonPrimaryDesktop @click="onSubmit" :disabled="submitDisabled">
        {{$t('TANK_MIX_HOME_FIND_MIXES')}}
      </ButtonPrimaryDesktop>
    </div>
    <div
      class="mt-9 text-h6 font-weight-bold advance-search-btn"
      @click="navigateToAdvanceSearch"
    >
      {{$t('TANK_MIX_HOME_ADVANCED_SEARCH')}}
    </div>
    <div class="mt-10 tank-page-subtitle">
      {{$t('TANK_MIX_HOME_EXPLORE_DESCRIPTION')}}
    </div>
    <div class="mt-8">
      <ButtonPrimaryDesktop
        @click="onExplore"
        :bg-style="{
          'background-image': 'linear-gradient(to top, #f9c86c, #f0973a)',
        }"
      >
        {{$t('TANK_MIX_HOME_EXPLORE')}}
      </ButtonPrimaryDesktop>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tank-page-title {
  font-size: 40px;
  line-height: 1.25;
  font-weight: normal;
  text-align: center;
  color: var(--primary);
}

.tank-page-subtitle {
  font-size: 30px;
  font-weight: 300;
  line-height: 1;
  text-align: center;
  color: $color-text;
}

.dropdown-select-container {
  align-self: center;
  margin-top: 50px;
  width: 100%;

  @media (min-width: 600px) {
    width: 510px;
  }
}

.chips-container {
  align-self: center;
  display: flex;
  flex-wrap: wrap;

  @media (min-width: 600px) {
    width: 510px;
  }
}

.product-chip {
  background-color: var(--primary-70);
  color: white;
}

.advance-search-btn {
  &:hover {
    cursor: pointer;
  }
}
</style>
