<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash';
import { useStore } from 'vuex';
import DropdownProductListItem from '@/components/Product/DropdownProductListItem'
import CustomSwitch from '@/components/base/inputs/CustomSwitch'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import ChevronDownIcon from '@/assets/icons/icon-system-chevron-down@2x.png'

import SearchInput from "@/components/base/inputs/SearchInput";
import ProductService from "@/services/Product/ProductService";

// eslint-disable-next-line no-unused-vars,no-undef
const props = defineProps({
  text: String,
  mixProducts: Array,
})

const store = useStore()
const user = computed(() => store.getters.getUser)

const isLoading = ref(false);
const isDisplayContainer = ref(false)
const isFilterFavourite = ref(true)

const producerEnvelope = ref({});
const productList = ref([])
const selectedProducts = ref([])

const searchStr = ref('');
const searchQuery = ref('');

const pageable = ref({
  page: 0,
  size: 9,
  sort: 'asc',
})

const onToggleDisplayContainer = () => {
  showHideContainer(!isDisplayContainer.value)
}

const showHideContainer = (value) => {
  isDisplayContainer.value = value
}

const clickOutsideContainer = () => {
  showHideContainer(false)
}

const clearSelection = () => {
  selectedProducts.value = []
}

const onToggleSelectProductItem = (product) => {
  if (selectedProducts.value.some((item) => item.id === product.id)) {
    selectedProducts.value = selectedProducts.value.filter((item) => item.id !== product.id);
  } else {
    selectedProducts.value = [
      ...selectedProducts.value,
      product,
    ]
  }
}

const isProductItemSelected = (product) => {
  return selectedProducts.value.some((item) => item.id === product.id);
}

const onSubmit = () => {
  // Set list of mix in store
  let newArray = [...selectedProducts.value]
  store.commit('tank_mix/setMix', newArray)
  //Hide dropdown container
  showHideContainer(false)
}

const selectedCount = computed({
  get() {
    return selectedProducts.value.length
  },
})

const onChangeSearch = (value) => {
  searchStr.value = value;
  debouncedUpdate(value);
};

const debouncedUpdate = debounce((value) => {
  searchQuery.value = value;
  if (searchQuery.value.length > 3) {
    pageable.value.page = 0;
    productList.value = [];
    fetchProducts(true, searchQuery.value, isFilterFavourite.value);
  }
}, [300]);

watch(
  () => props.mixProducts,
  (newValue) => {
    pageable.value.page = 0;
    productList.value = [];
    selectedProducts.value = [...newValue]
  }
)

watch(isFilterFavourite, (newValue) => {
  pageable.value.page = 0;
  productList.value = [];
  fetchProducts(true, searchQuery.value, newValue);
});


const fetchProducts = async (initialLoad, search = '', onlyFavourites = false) => {
  const productParameters = {
    marketId: user.value.market.id,
    contentLanguage: user.value.contentLanguage.isoCode,
    pageable: pageable.value,
    hideLoader: true,
    onlyFavourites,
  };

  isLoading.value = true

  try {
    const res = await new ProductService().service.getProducts(productParameters);
    producerEnvelope.value = res;
    if (!initialLoad) {
      productList.value = [
        ...productList.value,
        ...res.content
      ];
    } else {
      productList.value = res.content;
    }

    isLoading.value = false;
  } catch (err) {
    console.log('err', err);
    isLoading.value = false;
  }
}

watch(isDisplayContainer, async (newValue) => {
  if (newValue) {
    selectedProducts.value = [...props.mixProducts]
    productList.value = [];
    await fetchProducts(true, '' , isFilterFavourite.value);
  }
});

const loadMore = async (e) => {
  if (isLoading.value) {
    return;
  }

  const element = e.target;

  if (element.scrollHeight - element.offsetHeight - element.scrollTop < 1) {
    if (producerEnvelope.value?.last === false) {
      pageable.value.page += 1;
      await fetchProducts(false, searchQuery.value, isFilterFavourite.value);
    }
  }
};

onMounted(async () => {
  selectedProducts.value = [...props.mixProducts]
})
</script>
<template>
  <div class="dropdown-product">
    <div
      class="product-dropdown rounded-xl bg-white d-flex flex-row align-center justify-space-between pl-4 pr-4"
      @click="onToggleDisplayContainer()"
    >
      <div class="dropdown-placeholder">
        {{ text }}
      </div>

      <img :src="ChevronDownIcon" class="chevron-down-icon" />
    </div>
    <div
      class="product-dropdown-container mt-3 rounded-xl bg-white bg-shades-black"
      v-if="isDisplayContainer === true"
      v-click-outside="clickOutsideContainer"
    >
      <div class="d-flex flex-column px-6 pb-6 pt-3">
        <div class="d-flex align-center justify-space-between pt-1">
          <div class="text-dark">
            {{$t('SHOW_ONLY_FAVOURITES')}}
          </div>
          <div>
            <CustomSwitch
              :model-value="isFilterFavourite"
              @update:modelValue="(value) => isFilterFavourite = value"
              :disabled="isLoading"
            ></CustomSwitch>
          </div>
        </div>

        <div class="mt-9">
          <SearchInput
            :placeholder="$t('MAIN_MENU_PRODUCT_TITLE')"
            v-model="searchQuery"
            @updated="onChangeSearch"
          />
        </div>

        <div class="product-list mt-6" @scroll="loadMore">
          <DropdownProductListItem
            class="mt-5 align-self-start w-100"
            v-for="(item, index) in productList"
            :key="index"
            :product="item"
            :selected="isProductItemSelected(item)"
            @toggle-select="onToggleSelectProductItem"
          ></DropdownProductListItem>

          <div
            v-if="isLoading"
            class="d-flex spinning justify-center align-center pt-3"
          >
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </div>
        </div>
        <div class="text-dark mt-5">
          {{$t('TANK_MIX_SELECTED_PRODUCTS_CAPTION').replace('{}', selectedCount)}}
        </div>
        <div class="mt-7">
          <ButtonPrimaryDesktop @click="onSubmit" class="confirm-btn">
            {{ $t('PORTAL_CONFIRM_TITLE') }}
          </ButtonPrimaryDesktop>
        </div>
        <div
          class="pt-4 pb-4 mt-5 font-weight-bold text-h6 clickable-label"
          @click="clearSelection"
        >
          {{ $t('TANK_MIX_DESELECT_PRODUCT_CAPTION') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-dropdown {
  height: 55px;
  padding: 19px 20px 15.8px;
  opacity: 0.7;
  border-radius: 17px;
  border: solid 1px #699eff;
  cursor: pointer;
}

.dropdown-product {
  ::v-deep(.search-input-container) {
    border-radius: 18px;
    background-color: var(--background-blue);

    .custom-input {
      background: transparent;
    }
  }
}

.dropdown-placeholder {
  font-size: 16px;
  color: $color-text;
}

.text-dark {
  color: $color-text;
}

.product-dropdown-container {
  /*height: 866px;*/
}

.search-input {
  height: 50px;
  background-color: var(--background-blue);
  border: none;
  border-radius: 18px;
}

.clickable-label:hover {
  cursor: pointer;
}

.product-search-icon {
  height: 20px;
  width: 20px;
  z-index: 100;
  /*cursor: pointer;*/
  right: 0;
}

.chevron-down-icon {
  height: 20px;
  width: 20px;
}

.confirm-btn {
  width: 160px;
}

.product-list {
  min-height: 150px;
  max-height: 500px;
  overflow-y: auto;
  padding: 0 28px;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7.5px;
    background-color: var(--grey);
  }
}
</style>
