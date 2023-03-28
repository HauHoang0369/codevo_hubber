<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ProductService from '@/services/Product/ProductService';
import { ProducerListItem, ProducerFilter } from '@/components/Producers';
import PlusIcon from '@/components/base/icons/PlusIcon';
import Chip from '@/components/base/buttons/Chip'
import MoreDropdown from '@/components/base/MoreDropdown/MoreDropdown';

const router = useRouter();
const store = useStore();
const user = computed(() => store.getters.getUser);

const { t } = useI18n();

const isLoading = ref(false);
const showDropdown = ref(false);
const producerEnvelope = ref({});
const producers = ref([]);
const pagination = ref({
  page: 0,
  size: 10,
});
const selectedFilters = ref({});

const filters = ref({
  switches: [],
  chips: [
    {
      key: 'dimensione',
      label: t('PRODUCER_FILTER_BY_SIZE'),
      values: [
        { title: t('PARTY_ORGANIZATION_SIZE_SMALL'), value: 'SMALL' },
        { title: t('PARTY_ORGANIZATION_SIZE_MEDIUM'), value: 'MEDIUM' },
        { title: t('PARTY_ORGANIZATION_SIZE_LARGE'), value: 'LARGE' },
      ],
    },
    {
      key: 'status',
      label: 'PRODUCER_FILTER_BY_STATUS',
      values: [
        { title: t('PARTY_APPROVED_STATUS_APPROVED'), value: 'APPROVED' },
        { title: t('PARTY_APPROVED_STATUS_PENDING'), value: 'PENDING' },
        { title: t('PARTY_APPROVED_STATUS_REJECTED'), value: 'REJECTED' },
      ],
    },
  ]
});

const selectedFiltersChips = computed({
  get() {
    return Object.fromEntries(
      Object.entries(selectedFilters.value).filter(([key, value]) =>
        Array.isArray(value)
      )
    )
  },
})

const isSelectedFiltersEmpty = computed({
  get() {
    return checkSelectedFiltersEmpty()
  },
})

const checkSelectedFiltersEmpty = () => {
  let isEmpty = true;
  for (const value of Object.values(selectedFilters.value)) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        isEmpty = isEmpty && false;
      }
    } else if (typeof value === 'boolean') {
      if (value === true) {
        isEmpty = isEmpty && false;
      }
    }
  }
  return isEmpty;
}

const prepareSelectedFilters = () => {
  const combined = [...filters.value?.chips, ...filters.value?.switches]
  for (const value of Object.values(combined)) {
    let objectKey = value?.key
    if (objectKey) {
      if ('value' in value) {
        selectedFilters.value[objectKey] = ref(false)
      } else if ('values' in value) {
        selectedFilters.value[objectKey] = []
      }
    }
  }
};

const onConfirmFilters = async (selectedFiltersData) => {
  selectedFilters.value = { ...selectedFiltersData }
  try {
    pagination.value = {
      page: 0,
      size: 10,
    }
    store.commit('setLoading', true)
    await fetchProducers(true, true)
    store.commit('setLoading', false)
  } catch (e) {
    store.commit('setLoading', false)
    console.error(e)
  }
}

const fetchProducers = async (initialLoad, hideLoader) => {
  window.removeEventListener('scroll', onHandleScroll)

  try {
    if (initialLoad) {
      store.commit('setLoading', true);
    }

    const res = await new ProductService().service.getProducers({
      contentLanguage: user.value.contentLanguage.isoCode,
      marketId: user.value.market.id,
      pageable: pagination.value,
      hideLoader: hideLoader
    });

    producerEnvelope.value = res;

    if (initialLoad) {
      store.commit('setLoading', false);
      producers.value = res.content;
    } else {
      producers.value = [...producers.value, ...res.content];
    }
  } catch (err) {
    console.log(err);
  } finally {
    store.commit('setLoading', false);
    window.addEventListener('scroll', onHandleScroll)
  }
};

const onMoreProducers = async () => {
  pagination.value.page += 1;
  await fetchProducers(false, false);
};

const openDropdown = () => {
  showDropdown.value = true;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const isLoadMoreInScreen = () => {
  const producersLoadMoreItem = document.querySelector('#producer-load-more');
  // Check if our 0 height indicator item is in display,
  const pageTop = window.scrollY;
  const pageBottom = pageTop + window.innerHeight;
  const elementTop = producersLoadMoreItem.offsetTop;
  return elementTop <= pageBottom;
};

const onHandleScroll = async () => {
  // Only load new items if our indicator is in display and we are not on the last page
  if (isLoadMoreInScreen() && producerEnvelope.value?.last === false) {
    try {
      isLoading.value = true;
      window.removeEventListener('scroll', onHandleScroll);
      await onMoreProducers();
    } catch (e) {
      console.log(e);
    } finally {
      isLoading.value = false;
      window.addEventListener('scroll', onHandleScroll);
    }
  }
};

const unselectFilter = async (key, filter) => {
  let filterGroup = selectedFilters.value[key]
  if (filterGroup) {
    let filterIndex = Object.entries(filterGroup)?.findIndex(
      (filterItem, index) => {
        return filter?.value === filterGroup[index]?.value
      }
    )
    if (filterIndex !== -1) {
      filterGroup?.splice(filterIndex, 1)
    }
  }

  try {
    pagination.value = {
      page: 0,
      size: 10,
    }
    store.commit('setLoading', true)
    await fetchProducers(true, true)
    store.commit('setLoading', false)
  } catch (e) {
    store.commit('setLoading', false)
    console.error(e)
  }
}

const navigateToCreatePage = () => {
  router.push(`/producers/create`);
}

onMounted(async () => {
  prepareSelectedFilters();

  if (
    producerEnvelope.value?.first === true &&
    producerEnvelope.value?.last === false
  ) {
    window.addEventListener('scroll', onHandleScroll);
  }
  await fetchProducers(true, true);
  window.addEventListener('scroll', onHandleScroll);
});

onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleScroll);
});

</script>

<template>
  <div>
    <div class="page-header d-flex flex-column flex-sm-row align-baseline justify-space-between">
      <h1 class="page-title">{{$t('PARTY_VIEW_COMPETITORS_TITLE')}}</h1>

      <div class="add-btn" @click="navigateToCreatePage">
          <PlusIcon path-color="currentColor" />

          <span class="btn-text">{{$t('COMPETITOR_ADD_COMPETITOR_CAPTION')}}</span>
      </div>
    </div>

    <ProducerFilter
      :filters="filters"
      :selected-filters="selectedFilters"
      @changeFilter="onConfirmFilters"
    />

    <div
      class="selected-filters d-flex justify-end flex-wrap"
      v-if="!isSelectedFiltersEmpty"
    >
      <div
        v-for="(item, objectKey) in selectedFiltersChips"
        :key="objectKey"
        class="d-flex flex-wrap justify-end"
      >
        <Chip
          v-for="(chip, chipIndex) in item"
          :key="chipIndex"
          :clickable="true"
          :selected="true"
          class="ml-2 mb-2"
          :class="[
            item?.bgColor !== undefined ? 'text-white' : 'filter-chip-selected',
          ]"
          :style="{
            backgroundColor: chip?.bgColor + '!important' ?? 'inherit',
          }"
          v-on:click="unselectFilter(objectKey, chip)"
        >
          <span class="chip-title">{{ chip?.title }}</span>
        </Chip>
      </div>
    </div>

    <div class="action-dropdown-container">
      <MoreDropdown
        :show="showDropdown"
        @open="openDropdown"
        @close="closeDropdown"
      >
        <div class="menu-item d-flex align-center">
          <img
            :src="require('@/assets/icons/icon-system-importa-prodotti-da-file-excel.svg')"
            alt="excel"
          />

          <span class="menu-title">Importa  da file excel</span>
        </div>
      </MoreDropdown>
    </div>

    <div class="producers-list">
      <ProducerListItem
        v-for="(producer, index) in producers"
        :key="index"
        :producer="producer"
      />
    </div>

    <div id="producer-load-more" class="w-100">
      <div v-if="isLoading" class="text-center mt-10 mb-16">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </div>
    </div>

    <div class="d-flex flex-column align-center justify-center page-footer">
      <img :src="require('@/assets/logo-logo.svg')" class="mb-2" alt="logo" />
      <span>© 2021 Valagro - All rights reserved</span>
      <span>66041 Atessa (Chieti) ITALY - P.I. 01295050692</span>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 40px;
  font-weight: normal;
  line-height: 1.25;
  margin-bottom: 0;
}

.add-btn {
  display: flex;
  align-items: center;

  .btn-text {
    margin-left: 5px;
    font-weight: 500;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.producers-list {
  padding: 0 15px;
  margin: 0 -15px;
  margin-top: 30px;
  min-height: 200px;
}

.action-dropdown-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 30px;
}

.menu-item {
  height: 40px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .menu-title {
    white-space: nowrap;
    margin-left: 5px;
    font-size: 16px;
    font-weight: 500;
  }
}

.selected-filters {
  margin-top: 30px;
}

.selected-filters {
  margin-top: 30px;
}

.filter-chip-selected {
  background-color: var(--primary-70) !important;

  .chip-title {
    color: var(--white) !important;
  }
}

.chip-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
}

.page-footer {
  margin-top: 89px;
}
</style>
