<script setup>
import { computed, ref, watch } from 'vue';
import { debounce } from 'lodash';
import { useStore } from 'vuex';
import { ArrowDownIcon } from '@/components/base/icons';
import AuthImage from '@/components/base/AuthImage/AuthImage';
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop';
import SearchInput from '@/components/base/inputs/SearchInput';
import ProductService from '@/services/Product/ProductService';
import FilterIcon from '@/components/base/icons/FilterIcon';
import MixProductsSelectFilter from '@/components/TankMix/MixProductsSelectFilter';

const emit = defineEmits(['select']);
const props = defineProps({
  selected: Array,
  label: String,
  markets: Array,
  productType: {
    type: String,
    default: 'CATALOG'
  }
});

const store = useStore();
const user = computed(() => store.getters.getUser);

const MODE = {
  PRODUCT_SELECT: 'PRODUCT_SELECT',
  PRODUCT_FILTER: 'PRODUCT_FILTER'
}

const search = ref('');
const showDropdown = ref(false);
const products = ref([]);
const productEnvelope = ref({});
const page = ref(0);
const isLoading = ref(false);
const selectedProducts = ref([]);
const mode = ref(MODE.PRODUCT_SELECT);

const selectedMarketIds = computed(() => {
  const marketIds = props.markets ? props.markets.map((item) => item.id) : [];
  if (!marketIds.includes(user.value.market.id)) {
    marketIds.push(user.value.market.id);
  }

  return marketIds;
});

const openMenu = () => {
  search.value = '';
  showDropdown.value = true;
};

const closeMenu = () => {
  search.value = '';
  showDropdown.value = false;
};

const cancel = () => {
  selectedProducts.value = props.selected;
  closeMenu();
};

const onChange = (value) => {
  search.value = value;
  debouncedSearch(value);
}

const debouncedSearch = debounce((value) => {
  if (value.length >= 3 || value.length === 0) {
    page.value = 0;
    products.value = [];
    searchProducts(true, value);
  }
}, [300]);

const onSelect = (option) => {
  if (selectedProducts.value.find((item) => item.id === option.id)) {
    selectedProducts.value = selectedProducts.value.filter((item) => item.id !== option.id);
  } else {
    selectedProducts.value = [...selectedProducts.value, option];
  }
}

const isSelected = (option) => {
  return selectedProducts.value.some((item) => item.id === option.id);
}

const searchProducts = async (initLoad, name = '') => {
  isLoading.value = true;

  try {
    const res = await new ProductService().service.getGenericProducts({
      contentLanguage: user.value.contentLanguage.isoCode,
      filter: {
        productTypeCode: props.productType,
        markets: selectedMarketIds.value,
        ...name ? { name } : {}
      },
      page: {
        page: page.value,
      }
    });


    productEnvelope.value = res;

    if (initLoad) {
      products.value = res.content;
    } else {
      products.value = [
        ...products.value,
        ...res.content
      ]
    }

    isLoading.value = false;

  } catch (err) {
    isLoading.value = false;
  }
}

const loadMore = async (e) => {
  if (isLoading.value) {
    return;
  }

  const element = e.target;

  if (element.scrollHeight - element.offsetHeight - element.scrollTop < 1) {
    if (productEnvelope.value?.last === false) {
      page.value += 1;
      await searchProducts(
        false,
        search.value.length >= 3 ? search.value : ''
      );
    }
  }
};

const clearSelection = () => {
  selectedProducts.value = [];
};

const submitProducts = () => {
  emit('select', selectedProducts.value);
  closeMenu();
};

const selectMode = (value) => {
  mode.value = value;
}

watch(
  () => props.selected,
  (newValue) => {
    selectedProducts.value = [...newValue];
  }
);

watch(showDropdown, (newValue) => {
  if (newValue) {
    selectedProducts.value = [...props.selected];
    products.value = [];
    page.value = 0;
    search.value = '';
    searchProducts(true, '');
  }
})

</script>

<template>
  <div class="mix-products-select-container" v-click-outside="cancel">
    <div
      class="custom-select-box"
      @click="openMenu"
    >
      <div class="">
        <p class="select-label text-clamp-1">
          {{ label }}
        </p>
      </div>

      <span class="dropdown-icon" :class="{ open: showDropdown }">
        <ArrowDownIcon />
      </span>
    </div>

    <div v-if="showDropdown" class="dropdown-menu-container" >
      <div class="dropdown-menu-wrapper">
        <div v-if="mode === MODE.PRODUCT_SELECT">
          <div class="d-flex align-center justify-space-between w-100 pl-6 mb-5">
            <SearchInput
              :placeholder="label"
              v-model="search"
              @updated="onChange"
            />

            <div class="filter-btn ml-5" @click="selectMode(MODE.PRODUCT_FILTER)">
              <FilterIcon />
            </div>
          </div>

          <div class="menu-list" @scroll="loadMore">
            <div
              v-for="item in products"
              :key="item.id"
              class="dropdown-menu-item text-clamp-1"
              @click="onSelect(item)"
            >
              <div>
                <div
                  class="product-label"
                  :class="{ 'product-chip': props.productType === 'CATALOG' }"
                  :style="{ 'background-color': props.productType === 'CATALOG' ? item.productFamily?.color : 'transparent' }"
                >
                  {{ props.productType === 'CATALOG' ? item.productFamily?.code : $t('MAIN_MENU_PRODUCT_TITLE')}}
                </div>
                <p class="product-name">{{item.name}}</p>
              </div>

              <AuthImage
                :path="item.imageUrl"
                class="product-img"
              ></AuthImage>

              <div class="check-mark-container" v-if="isSelected(item)">
                <img src="@/assets/icons/icon-system-check.png"
                     srcset="@/assets/icons/icon-system-check@2x.png 2x,
                     @/assets/icons/icon-system-check@3x.png 3x"
                     class="check-mark" alt="" >
              </div>
            </div>

            <div
              v-if="isLoading"
              class="d-flex spinning justify-center align-center pt-3"
            >
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </div>

            <div v-if="products.length === 0 && !isLoading" class="text-center py-10">
              No Data
            </div>
          </div>

          <div class="shadow-box"></div>


          <div class="d-flex flex-column align-center justify-center">
            <span class="selected-count">
              {{$t('TANK_MIX_SELECTED_PRODUCTS_CAPTION').replace('{}', selectedProducts.length)}}
            </span>

            <ButtonPrimaryDesktop
              class="confirm-btn mb-5"
              @click="submitProducts"
            >
              {{ $t('PORTAL_CONFIRM_TITLE') }}
            </ButtonPrimaryDesktop>

            <span class="cancel-btn" @click="clearSelection">
              {{ $t('TANK_MIX_DESELECT_PRODUCT_CAPTION') }}
            </span>
          </div>
        </div>

        <MixProductsSelectFilter
          v-if="mode === MODE.PRODUCT_FILTER"
          @close="selectMode(MODE.PRODUCT_SELECT)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mix-products-select-container {
  .custom-select-box {
    padding: 0 20px;
    opacity: 0.7;
    border-radius: 17px;
    border: solid 1px var(--celeste);
    background-color: var(--white);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 55px;

    &.disabled {
      pointer-events: none;

      .select-label {
        color: $color-grey-light-1 !important;
      }

      .selected-option__title {
        color: $color-grey-dark;
      }
    }

    &:hover {
      cursor: pointer;
    }

    .select-label {
      font-size: 16px;
      line-height: 18px;
      color: $color-text;
      transition: all ease-in 0.2s;

      &.option-selected {
        font-size: 12px;
        font-weight: 300;
        color: $color-text;
      }
    }

    .selected-option {
      display: flex;
      align-items: center;

      &__title {
        font-size: 16px;
        line-height: 18px;
        color: $color-text;
      }
    }

    .dropdown-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all ease-in 0.2s;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  .dropdown-menu-container {
    position: relative;
    width: 100%;

    .dropdown-menu-wrapper {
      position: absolute;
      width: 100%;
      padding: 28px 24px 24px 0;
      border-radius: 20px;
      box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
      background-color: var(--white);
      z-index: 99;

      ::v-deep(.search-input-container) {
        background-color: var(--background-blue);

        .custom-input {
          background: transparent;
        }
      }

      .filter-btn {
        width: 48px;
        height: 48px;
        border-radius: 13px;
        box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
        background-color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        &:hover {
          cursor: pointer;
          opacity: 0.8;
        }
      }

      .menu-list {
        max-height: 320px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px 24px 40px 24px;

        &::-webkit-scrollbar {
          width: 12px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 7.5px;
          background-color: var(--grey);
        }
      }

      .dropdown-menu-item {
        margin: 10px 0;
        padding: 10px 16px;
        border-radius: 20px;
        box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
        border: solid 1px rgba(221, 233, 255, 0.27);
        background-color: var(--white);
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        position: relative;

        .product-label {
          font-size: 14px;
          font-weight: 300;
          margin-bottom: 7px;
          color: $color-text;

          &.product-chip {
            display: inline-flex;
            align-items: center;
            padding: 0 22px;
            border-radius: 13.5px;
            background-color: var(--p-bs);
            color: white;
            height: 27px;
            font-size: 14px;
          }
        }

        .product-name {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          color: $color-text;
        }

        &:hover {
          cursor: pointer;
          background-color: var(--background-blue);
        }

        &.selected {
          background-color: var(--background-blue);
        }

        .check-mark-container {
          width: 23px;
          height: 23px;
          background-image: linear-gradient(to bottom, #009982, var(--primary));
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 7px;
          z-index: 2;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  .confirm-btn {
    width: 160px;
  }

  .cancel-btn {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .product-img {
    width: 65px;
    height: 87px;
    border-radius: 17px;
  }

  .shadow-box {
    position: relative;
    top: -40px;
    height: 40px;
    width: 100%;
    background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        var(--white) 82%
    );
  }

  .selected-count {
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    color: $color-text;
    margin-bottom: 28px;
  }
}
</style>
