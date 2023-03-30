<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { PlusIcon } from '@/components/base/icons';
import CustomSelectBox from '@/components/base/inputs/CustomSelectBox';
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop';
import MixMarketsSelect from '@/components/TankMix/MixMarketsSelect';
import MixProductsSelect from '@/components/TankMix/MixProductsSelect';
import MixIngredientSelect from '@/components/TankMix/MixIngredientSelect';

const store = useStore();

const user = computed(() => store.getters.getUser);

const selectedMarkets = ref([]);
const selectedIngredients = ref([])
const selectedInternalProducts = ref([]);
const selectedExternalProducts = ref([]);
const crops = ref([]);
const selectedCrop = ref(null);

const filteredMarkets = computed(() => {
  return selectedMarkets.value.filter((item) => item.id !== user.value.market.id);
})

const updateMarkets = (value) => {
  selectedMarkets.value = value;
};

const removeMarket = (market) => {
  selectedMarkets.value = selectedMarkets.value.filter((item) => item.id !== market.id);
}

const updateIngredients = (value) => {
  selectedIngredients.value = value;
};

const removeIngredient = (crop) => {
  selectedIngredients.value = selectedIngredients.value.filter((item) => item.id !== crop.id);
}

const updateSelectedInternalProducts = (value) => {
  selectedInternalProducts.value = value;
};

const removeInternalProduct = (product) => {
  selectedInternalProducts.value = selectedInternalProducts.value.filter((item) => item.id !== product.id);
};

const updateSelectedExternalProducts = (value) => {
  selectedExternalProducts.value = value;
};

const removeExternalProduct = (product) => {
  selectedInternalProducts.value = selectedInternalProducts.value.filter((item) => item.id !== product.id);
};

</script>

<template>
  <div class="tank-mix-advance-search-page">
    <div class="d-flex flex-column flex-sm-row align-baseline justify-space-between w-100 mb-8">
      <h1 class="page-title mb-0">{{$t('TANK_MIX_HOME_ADVANCED_SEARCH')}}</h1>

      <div class="action-button align-self-end align-self-sm-baseline mt-5 mt-sm-0">
        <PlusIcon class="action-button__icon" />

        <span class="action-button__label">{{ $t('TANK_MIX_ADD_MIX_CAPTION') }}</span>
      </div>
    </div>

    <div class="search-filter-card">
      <div class="mb-5">
        <MixMarketsSelect
          :selected="selectedMarkets"
          @select="(value) => updateMarkets(value)"
        />

        <div v-if="filteredMarkets.length > 0" class="market-chip-list">
          <v-chip
            class="ma-2 market-chip"
            text-color="white"
            v-for="(item, index) in filteredMarkets"
            :key="index"
          >
            <span class="text-white text-md">
              {{ item.name }}
            </span>
            <v-icon
              big
              right
              @click.stop="removeMarket(item)"
              class="pl-2 text-white"
            >mdi-close</v-icon
            >
          </v-chip>
        </div>
      </div>

      <div class="mb-5">
        <MixProductsSelect
          :label="$t('TANK_MIX_FILTERS_VIEW_INTERNAL_PRODUCTS_CAPTION')"
          :selected="selectedInternalProducts"
          :markets="selectedMarkets"
          productType="CATALOG"
          @select="(value) => updateSelectedInternalProducts(value)"
        />

        <div v-if="selectedInternalProducts.length > 0" class="market-chip-list">
          <v-chip
            class="ma-2 market-chip"
            text-color="white"
            v-for="(item, index) in selectedInternalProducts"
            :key="index"
          >
            <span class="text-white text-md">
              {{ item.name }}
            </span>
            <v-icon
              big
              right
              @click.stop="removeInternalProduct(item)"
              class="pl-2 text-white"
            >mdi-close</v-icon>
          </v-chip>
        </div>
      </div>

      <div class="mb-5">
        <MixProductsSelect
          :label="$t('TANK_MIX_FILTERS_VIEW_EXTERNAL_PRODUCTS_CAPTION')"
          :selected="selectedExternalProducts"
          :markets="selectedMarkets"
          productType="COMPETITOR"
          @select="(value) => updateSelectedExternalProducts(value)"
        />

        <div v-if="selectedExternalProducts.length > 0" class="market-chip-list">
          <v-chip
            class="ma-2 market-chip"
            text-color="white"
            v-for="(item, index) in selectedExternalProducts"
            :key="index"
          >
            <span class="text-white text-md">
              {{ item.name }}
            </span>
            <v-icon
              big
              right
              @click.stop="removeExternalProduct(item)"
              class="pl-2 text-white"
            >mdi-close</v-icon>
          </v-chip>
        </div>
      </div>

      <div class="mb-5">
        <MixIngredientSelect
          :selected="selectedIngredients"
          @select="(value) => updateIngredients(value)"
        />

        <div v-if="selectedIngredients.length > 0" class="market-chip-list">
          <v-chip
            class="ma-2 market-chip"
            text-color="white"
            v-for="(item, index) in selectedIngredients"
            :key="index"
          >
            <span class="text-white text-md">
              {{ item.name }}
            </span>
            <v-icon
              big
              right
              @click.stop="removeIngredient(item)"
              class="pl-2 text-white"
            >mdi-close</v-icon
            >
          </v-chip>
        </div>
      </div>

      <div class="mb-15">
        <CustomSelectBox
          :selected-item="selectedCrop"
          :options="crops"
          :label="$t('TANK_MIX_FILTERS_VIEW_CROPS_CAPTION')"
          item-key="id"
          item-title="name"
          @select="(value) => selectedCrop = value"
        />
      </div>

      <div class="d-flex align-center justify-center w-100 mb-9">
        <ButtonPrimaryDesktop class="confirm-btn">
          {{ $t('TANK_MIX_FILTERS_VIEW_SEARCH_BUTTON_CAPTION') }}
        </ButtonPrimaryDesktop>
      </div>

      <div class="d-flex align-center justify-center w-100">
        <span class="cancel-btn">
          {{ $t('RESET_FILTERS_CAPTION') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tank-mix-advance-search-page {

}

.action-button {
  display: flex;
  align-items: flex-start;

  &:hover {
    cursor: pointer;
  }

  &__icon {
    margin-right: 5px;
  }

  &__label {
    font-weight: 500;
  }
}

.search-filter-card {
  padding: 30px 20px 50px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  background-color: var(--white);
}

.confirm-btn {
  width: 160px;
}

.cancel-btn {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0.78px;

  &:hover {
    cursor: pointer;
  }
}

.market-chip-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;

  .market-chip {
    background-color: var(--primary-70);
    margin: 0 !important;
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
