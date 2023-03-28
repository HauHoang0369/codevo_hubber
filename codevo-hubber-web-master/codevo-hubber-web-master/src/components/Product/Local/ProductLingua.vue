<script setup>
import { computed, ref } from 'vue'
// components
import EditIcon from '@/components/base/icons/EditIcon.vue'
import Grid from '@/components/base/Grid/Grid'
import ProductHighlightPopup from '@/components/Product/Local/ProductHighlightPopup'
// icons
import CheckIcon from '@/assets/icons/icon-system-check@2x.png'
import { useStore } from 'vuex'

const onProductHighlight = ref(false)

const store = useStore()
const contentLanguageProduct = computed(
  () => store.state.products.currentProduct
)
const systemLanguageProduct = computed(
  () => store.state.products.systemLanguageProduct
)
</script>

<template>
  <div class="position-relative">
    <div class="position-absolute" style="right: 0">
      <div class="icon" @click="onProductHighlight = true">
        <EditIcon pathColor="#A6ACB5" />
      </div>
    </div>

    <Grid
      :column-gap="30"
      :lg="systemLanguageProduct ? 2 : 1"
      :md="systemLanguageProduct ? 2 : 1"
      :row-gap="30"
      :xl="systemLanguageProduct ? 2 : 1"
      sm="1"
    >
      <div>
        <div class="lingua-title">{{ $t('MAIN_MENU_LANGUAGE_TITLE') }} 1</div>
        <div v-if="contentLanguageProduct?.claim" class="lingua-item-title">
          {{ contentLanguageProduct.claim }}
        </div>
        <ul v-if="contentLanguageProduct?.highlights" class="lingua-item-list">
          <li
            v-for="(value, index) in contentLanguageProduct.highlights"
            :key="index"
            class="d-flex align-center"
          >
            <img :src="CheckIcon" alt="Check Icon" class="check-icon mr-2" />
            {{ value }}
          </li>
        </ul>
      </div>

      <div v-if="systemLanguageProduct">
        <div class="lingua-title">{{ $t('MAIN_MENU_LANGUAGE_TITLE') }} 2</div>
        <div v-if="systemLanguageProduct?.claim" class="lingua-item-title">
          {{ systemLanguageProduct.claim }}
        </div>
        <ul v-if="systemLanguageProduct?.highlights" class="lingua-item-list">
          <li
            v-for="(value, index) in systemLanguageProduct.highlights"
            :key="index"
            class="d-flex align-center"
          >
            <img :src="CheckIcon" alt="Check Icon" class="check-icon mr-2" />
            {{ value }}
          </li>
        </ul>
      </div>
    </Grid>

    <v-dialog
      v-model="onProductHighlight"
      max-width="1161"
      v-on:click:outside="onProductHighlight = false"
    >
      <v-card style="border-radius: 30px">
        <ProductHighlightPopup @close="onProductHighlight = false" />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.lingua-title {
  line-height: 40px;
  color: var(--text);
  font-size: 18px;
}

.lingua-item-title {
  margin-top: 30px;
  margin-bottom: 28px;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  color: var(--primary);
}

.icon {
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
  cursor: pointer;
}

ul.lingua-item-list {
  li {
    list-style-type: none;
    line-height: 1.44;
    color: var(--text);
    margin-bottom: 23px;

    .check-icon {
      width: 30px;
      height: 32px;
    }
  }
}
</style>
