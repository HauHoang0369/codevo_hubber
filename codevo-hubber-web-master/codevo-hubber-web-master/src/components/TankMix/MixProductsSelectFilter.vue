<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex';
import { CloseIcon } from '@/components/base/icons';
import CustomSelectBox from '@/components/base/inputs/CustomSelectBox';
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop';
import ProductService from '@/services/Product/ProductService';

const emit = defineEmits(['close']);

const store = useStore();
const user = computed(() => store.getters.getUser);

const producers = ref([]);
const selectedProducer = ref(null);
const ingredients = ref([]);
const selectedIngredient = ref(null);
const productFamilies = ref([]);
const selectedProductFamily = ref(null);
const productClasses = ref([]);
const selectedProductClass = ref(null);

const closeFilter = () => {
  emit('close');
};

const searchIngredients = async () => {
  try {
    const { content } = await new ProductService().service.searchIngredients({
      marketId: user.value.market.id,
    });

    ingredients.value = content;
  } catch (err) {

  }
};

const searchProductFamilies = async () => {
  try {
    const { content } = await new ProductService().service.getProductFamilies(
      user.value.market.id,
      true,
      true,
      user.value.contentLanguage.isoCode,
      { page: 0 },
      true,
      false
    );

    productFamilies.value = content;
  } catch (err) {

  }
};

const searchProductClasses = async () => {
  try {
    const res = await new ProductService().service.getProductClasses(
      user.value.market.id,
      user.value.contentLanguage.isoCode,
      user.value.id,
      true,
    );

    productClasses.value = res;
  } catch (err) {

  }
};

const onConfirm = () => {
  emit('close');
};

const onCancel = () => {
  emit('close');
}

onMounted(() => {
  searchIngredients();
  searchProductFamilies();
  searchProductClasses();
})

</script>

<template>
  <div class="mix-product-select-filter">
    <div class="d-flex align-center justify-space-between mb-5">
      <span class="filter-label">
        {{$t('FILTER_BY_CAPTION')}}
      </span>

      <CloseIcon class="close-icon" @click="closeFilter" />
    </div>

    <div class="mb-5">
      <CustomSelectBox
        :selected-item="selectedProducer"
        :options="producers"
        :label="$t('PARTY_VIEW_COMPETITORS_TITLE')"
        item-key="id"
        item-title="name"
        @select="(value) => selectedProducer = value"
      />
    </div>

    <div class="mb-5">
      <CustomSelectBox
        :selected-item="selectedIngredient"
        :options="ingredients"
        :label="$t('PRODUCT_DETAIL_INGREDIENTI_TITLE')"
        item-key="id"
        item-title="name"
        @select="(value) => selectedIngredient = value"
      />
    </div>

    <div class="mb-5">
      <CustomSelectBox
        :selected-item="selectedProductFamily"
        :options="productFamilies"
        :label="$t('EDIT_PRODUCT_PRODUCT_FAMILY')"
        item-key="id"
        item-title="name"
        @select="(value) => selectedProductFamily = value"
      />
    </div>

    <div class="mb-5">
      <CustomSelectBox
        :selected-item="selectedProductClass"
        :options="productClasses"
        :label="$t('TANK_MIX_PRODUCT_CLASS_CAPTION')"
        item-key="id"
        item-title="name"
        @select="(value) => selectedProductClass = value"
      />
    </div>

    <div class="d-flex flex-column align-center justify-center">
      <ButtonPrimaryDesktop
        class="confirm-btn mb-8"
        @click="onConfirm"
      >
        {{ $t('PORTAL_CONFIRM_TITLE') }}
      </ButtonPrimaryDesktop>

      <span class="cancel-btn mb-1" @click="onCancel">
        {{ $t('RESET_FILTERS_CAPTION') }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mix-product-select-filter {
  padding-left: 24px;

  .filter-label {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.5;
  }

  .close-icon {
    width: 30px;
    height: 30px;

    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }

    &::v-deep {
      path {
        fill: $color-grey-dark;
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

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}
</style>
