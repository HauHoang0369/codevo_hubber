<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';
import ProductService from '@/services/Product/ProductService';
import { ArrowDownIcon } from '@/components/base/icons';
import AuthImage from '@/components/base/AuthImage/AuthImage';
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop';
import SearchInput from '@/components/base/inputs/SearchInput';

const emit = defineEmits(['select']);
const props = defineProps({
  selected: Array
})

const store = useStore();
const user = computed(() => store.getters.getUser);

const search = ref('');
const showDropdown = ref(false);
const markets = ref([]);
const filteredMarkets = ref([]);
const marketEnvelope = ref({});
const isLoading = ref(false);
const page = ref(0);
const selectedMarkets = ref([]);

const marketList = computed(() => {
  if (search.value.length >= 3) {
    return filteredMarkets.value;
  }

  return markets.value
})

const openMenu = () => {
  search.value = '';
  showDropdown.value = true;
}

const closeMenu = () => {
  search.value = '';
  showDropdown.value = false;
}

const cancel = () => {
  selectedMarkets.value = props.selected;
  closeMenu();
}

const onChange = (value) => {
  search.value = value;
  debouncedSearch(value);
}

const debouncedSearch = debounce((value) => {
  if (value.length >= 3) {
    page.value = 0;
    filteredMarkets.value = [];
    searchMarkets(true, value);
  } else {
    isLoading.value = false;
  }
}, [300]);

const onSelect = (option) => {
  if (option.id === user.value.market.id) {
    return;
  }

  if (selectedMarkets.value.find((item) => item.id === option.id)) {
    selectedMarkets.value = selectedMarkets.value.filter((item) => item.id !== option.id);
  } else {
    selectedMarkets.value = [...selectedMarkets.value, option];
  }
}

const isSelected = (option) => {
  if (option.id === user.value.market.id) {
    return true;
  }
  return selectedMarkets.value.some((item) => item.id === option.id);
}

const searchMarkets = async (initLoad, name = '') => {
  isLoading.value = true;

  try {
    const res = await new ProductService().service.searchMarket({
      marketId: user.value.market.id,
      page: page.value,
      ...name ? { name } : {}
    });

    marketEnvelope.value = res;

    if (name) {
      if (initLoad) {
        filteredMarkets.value = res.content;
      } else {
        filteredMarkets.value = [
          ...markets.value,
          ...res.content
        ]
      }
    } else {
      if (initLoad) {
        markets.value = res.content;
      } else {
        markets.value = [
          ...markets.value,
          ...res.content
        ]
      }
    }
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
  }
};

const loadMore = async (e) => {
  if (isLoading.value) {
    return;
  }

  const element = e.target;

  if (element.scrollHeight - element.offsetHeight - element.scrollTop < 1) {
    if (marketEnvelope.value?.last === false) {
      page.value += 1;
      await searchMarkets(
        false,
        search.value.length >= 3 ? search.value : ''
      );
    }
  }
};

const clearSelection = () => {
  selectedMarkets.value = [];
}

const submitMarkets = () => {
  emit('select', selectedMarkets.value);
  closeMenu();
}

watch(
  () => props.selected,
  (newValue) => {
    selectedMarkets.value = [...newValue];
  }
)

onMounted(() => {
  searchMarkets(true, '');
})

</script>

<template>
  <div class="mix-markets-select-container" v-click-outside="cancel">
    <div
      class="custom-select-box"
      :class="{ disabled: markets.length === 0 }"
      @click="openMenu"
    >
      <div class="">
        <p class="select-label text-clamp-1">
          {{ $t('MAIN_MENU_MARKET_TITLE') }}
        </p>
        <div class="selected-option">
          <span class="selected-option__title">
            {{user.market.name}}
          </span>
        </div>
      </div>

      <span class="dropdown-icon" :class="{ open: showDropdown }">
        <ArrowDownIcon />
      </span>
    </div>

    <div v-if="showDropdown" class="dropdown-menu-container" >
      <div class="dropdown-menu-wrapper">
        <div>
          <div class="pl-4 mb-5">
            <SearchInput
              :placeholder="$t('TANK_MIX_FILTERS_VIEW_MARKETS_CAPTION')"
              v-model="search"
              @updated="onChange"
            />
          </div>

          <div class="menu-list" @scroll="loadMore">
            <div
              v-for="item in marketList"
              :key="item.id"
              class="dropdown-menu-item text-clamp-1"
              @click="onSelect(item)"
            >
              <div class="d-flex align-center">
                <AuthImage
                  :path="item.imageUrl"
                  class="label-prefix-img"
                ></AuthImage>

                <span class="dropdown-menu-item__title">
                  {{item.name}}
                </span>
              </div>

              <div>
                <div class="check-mark-container" v-if="isSelected(item)">
                  <img src="@/assets/icons/icon-system-check.png"
                       srcset="@/assets/icons/icon-system-check@2x.png 2x,
                     @/assets/icons/icon-system-check@3x.png 3x"
                       class="check-mark" alt="" >
                </div>
              </div>
            </div>

            <div
              v-if="isLoading"
              class="d-flex spinning justify-center align-center pt-3"
            >
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </div>

            <div v-if="marketList.length === 0 && !isLoading" class="text-center py-2">
              No Data
            </div>
          </div>

          <div class="shadow-box"></div>

          <div class="d-flex flex-column align-center justify-center">
            <span class="selected-count">
              {{$t('TANK_MIX_SELECTED_MARKETS_CAPTION').replace('{}', selectedMarkets.length + 1)}}
            </span>

            <ButtonPrimaryDesktop
              class="confirm-btn mb-5"
              @click="submitMarkets"
            >
              {{ $t('PORTAL_CONFIRM_TITLE') }}
            </ButtonPrimaryDesktop>

            <span class="cancel-btn" @click="clearSelection">
              {{ $t('TANK_MIX_DESELECT_PRODUCT_CAPTION') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mix-markets-select-container {
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
      font-weight: 300;
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
      padding: 28px 16px 24px 0;
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

      .menu-list {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 40px;

        &::-webkit-scrollbar {
          width: 12px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 7.5px;
          background-color: var(--grey);
        }
      }

      .dropdown-menu-item {
        padding: 10px 20px 11px 26px;
        border-radius: 9px;
        font-size: 18px;
        color: $color-text;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        &__title {
          font-size: 18px;
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

  .label-prefix-img {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    margin-right: 20px;
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
