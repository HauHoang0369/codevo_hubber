<script setup>
import TabBar from '@/components/TabBar/TabBar'
import CheckIcon from '@/assets/icons/icon-system-check@2x.png'
import { computed, onMounted, ref, inject, onUnmounted, provide } from 'vue'
import ProductService from '@/services/Product/ProductService'
import Grid from '@/components/base/Grid/Grid'

import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ProductDetailIngredients from '@/components/Product/ProductDetailsIngredients'
import ClientMessageLoggedIn from '@/components/Popup/ClientMessageLoggedIn.vue'
import ClientMessageAnonymous from '@/components/Popup/ClientMessageAnonymous.vue'
import ClientMessageSent from '@/components/Popup/ClientMessageSent.vue'
import ProductProperties from '@/components/Product/ProductProperties.vue'
import ProductDetailsHeader from '@/components/Product/ProductDetailsHeader.vue'
import CompetingProductSection from '@/views/CompetitorProducts/CompetingProductSection.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const user = computed(() => store.getters.getUser)
const setBreadcrumbTitle = inject('setBreadcrumbTitle')

const tabBarItems = ref(['Generale', 'Prodotti in competizione'])

const tabBarSections = ref(['GENERAL', 'COMPETITORPRODUCTS'])

const clientMessageAnonymousDialog = ref(false)
const clientMessageLoggedInDialog = ref(false)
const clientMessageSentDialog = ref(false)

const id = ref()
const product = ref([])
const isFixed = ref(false)

const selectedTab = ref(0)

const ingredientsPageable = ref({
  page: 0,
  size: 3,
  sort: 'asc',
})
// Stores full api response, including pagedata
const ingredientsEnvelope = ref({})
// Stores only response content, actual data
const ingredients = ref([])
// Ingredients loading indicator
const ingredientsLoading = ref(false)
// Ingredients error
const ingredientsError = ref(null)

onMounted(async () => {
  await loadData()
  window.addEventListener('scroll', onHandleScroll)
})

onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleScroll)
})

const onHandleScroll = async () => {
  let tabBarContainer = document.querySelector('.tab-bar-container')
  let stickyTop = document.querySelector('#appbar')
  tabBarContainer.append(stickyTop)
  isFixed.value = false
}

const loadData = async () => {
  try {
    store.commit('setLoading', true)
    id.value = route.params.id
    product.value = await new ProductService().service.getProduct({
      marketId: user.value.market.id,
      productId: id.value,
      hideLoader: true,
    })
    setBreadcrumbTitle(product.value?.name ?? null)
    if (!isAnonymous.value) {
      await loadIngredients(true)
    }
    store.commit('setLoading', false)
  } catch (e) {
    store.commit('setLoading', false)
    console.error(e)
  }
}

onUnmounted(async () => {
  setBreadcrumbTitle(null)
})

const favourite = async () => {
  try {
    await new ProductService().service.toggleProductFavourite(id.value)
    // await loadData()
    router.go(0)
  } catch (e) {
    console.error(e)
  }
}

let onTabChange = async (index) => {
  selectedTab.value = index
  let element = document.getElementById(tabBarSections.value[index])
  if (index == 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const y = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const loadIngredients = async (hideLoader) => {
  try {
    ingredientsEnvelope.value =
      await new ProductService().service.getProductIngredients({
        marketId: user.value.market.id,
        productId: id.value,
        contentLanguage: user.value.contentLanguage.isoCode,
        pageable: ingredientsPageable.value,
        hideLoader: hideLoader,
      })
    // TODO: Check data length, if zero throw error
    ingredientsError.value = null
    if (ingredientsEnvelope.value.content) {
      ingredients.value.push(...ingredientsEnvelope.value.content)
    } else {
      ingredientsError.value = 'No data available'
    }
  } catch (e) {
    // Check error type, if network error show this
    // TODO: multi lang?
    ingredientsError.value = 'Failed to fetch data'
  }
}

const onMoreIngredients = async () => {
  try {
    ingredientsLoading.value = true
    ingredientsPageable.value.page += 1
    await loadIngredients(true)
    ingredientsLoading.value = false
  } catch (e) {
    ingredientsLoading.value = false
  }
}

provide('clientMessageAnonymousDialog', clientMessageAnonymousDialog)
provide('clientMessageLoggedInDialog', clientMessageLoggedInDialog)

const onClientMessageAnonymousCallback = async (value) => {
  console.log('onClientMessageAnonymousCallback: ' + value)
  // Close first dialog
  clientMessageAnonymousDialog.value = false
  // Show sent dialog
  if (value > 0) {
    clientMessageSentDialog.value = true
  }
}

const onClientMessageLoggedInCallback = async (value) => {
  console.log('onClientMessageLoggedInCallback: ' + value)
  // Close first dialog
  clientMessageLoggedInDialog.value = false
  // Show sent dialog
  if (value > 0) {
    clientMessageSentDialog.value = true
  }
}

provide('clientMessageSentDialog', clientMessageSentDialog)
const onClientMessageSentCallback = async (value) => {
  console.log('onClientMessageCallback: ' + value)
  clientMessageSentDialog.value = false
  if (value === 2) {
    // route to dashboard
    await router.replace({ path: '/' })
  }
}

const isAnonymous = computed(
  () => user.value.id === null || user.value.id === undefined
)
</script>

<template>
  <div>
    <ClientMessageAnonymous v-on:callback="onClientMessageAnonymousCallback">
    </ClientMessageAnonymous>
    <ClientMessageLoggedIn v-on:callback="onClientMessageLoggedInCallback">
    </ClientMessageLoggedIn>
    <ClientMessageSent
      v-on:callback="onClientMessageSentCallback"
    ></ClientMessageSent>

    <ProductDetailsHeader
      :product="product"
      :product-sizes="product?.productSizes"
      v-on:favourite="favourite"
    >
    </ProductDetailsHeader>

    <div class="fluid-row mt-16">
      <div class="tab-bar-container">
        <div id="appbar">
          <v-row>
            <TabBar
              :items="tabBarItems"
              :selected="selectedTab"
              v-on:change="onTabChange"
              :class="{ fixed: isFixed }"
            ></TabBar>
          </v-row>
        </div>
      </div>
    </div>

    <Grid
      xl="2"
      lg="2"
      md="1"
      sm="1"
      :column-gap="40"
      :row-gap="30"
      class="claims-and-characteristics-section"
    >
      <div>
        <div class="claim-text">
          {{ product.claim }}
        </div>
        <div class="mt-7">
          <div
            class="d-flex flex-row align-center"
            v-for="(item, index) in product?.highlights"
            :key="index"
          >
            <div><img :src="CheckIcon" class="check-icon" /></div>
            <div class="ml-2 highlight-item">{{ item }}</div>
          </div>
        </div>
      </div>

      <ProductProperties
        :family="product?.productFamily"
        :technology="product?.technology"
        :certificate="product?.certificate"
        :applications="product?.applicationList"
      >
      </ProductProperties>
    </Grid>

    <v-divider />

    <ProductDetailIngredients
      v-if="!isAnonymous"
      class="competitor-product-detail-ingredients"
      :ingredients="ingredients"
      :more="ingredientsEnvelope?.totalElements - ingredients?.length"
      :show-more="ingredientsEnvelope?.last === false"
      :loading="ingredientsLoading"
      :error="ingredientsError"
      :divider="true"
      v-on:loadMore="onMoreIngredients"
    />

    <CompetingProductSection id="COMPETITORPRODUCTS" />
  </div>
</template>

<style type="text/css" scoped>
.check-icon {
  width: 30px;
  height: 32px;
}

.fluid-row {
  width: 100vw;
  position: relative;
  left: calc(-50vw + 50%);
}

.tab-bar-container {
  padding-left: 50%;
}

.claims-and-characteristics-section {
  padding: 60px 0;
}

.competitor-product-detail-ingredients {
  padding-top: 60px;
}

.claim-text {
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  color: var(--primary);
}

.highlight-item {
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  color: var(--text);
}

.fixed {
  box-shadow: none !important;
}
</style>
