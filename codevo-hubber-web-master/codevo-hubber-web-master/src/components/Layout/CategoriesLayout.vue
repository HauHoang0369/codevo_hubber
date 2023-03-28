<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop'
import DynamicPopup from '@/components/Popup/DynamicPopup'
import InfinityScrlPopup from '@/components/NewArticle/InfinityScrlPopup'
import ProductPopup from '@/components/NewArticle/ProductPopup'
import SolutionPopup from '@/components/NewArticle/SolutionPopup'
import CropsPopup from '@/components/NewArticle/CropsPopup'

import { computed, onMounted, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import debounce from 'lodash/debounce'

const isLoading = ref(false)
const store = useStore()
const route = useRoute()
const router = useRouter()

const breadCrumbText = computed(() =>
  ['Article', 'EditArticle'].includes(route.name)
    ? store.getters['articles/getCurrentArticle'].title
    : route.name === 'NewArticle'
    ? 'New Article'
    : (route.params.code || route.name).toLowerCase()
)

const breadCrumbArr = computed(() =>
  route.name === 'Categories' && store.state.categories.prevCategoryCode
    ? [
        {
          name: 'Categories',
          path: 'Categories/' + store.state.categories.prevCategoryCode,
        },
      ]
    : []
)

const goNewArticlePage = () => {
  router.push('/categories/ARTICLE/new-article')
}

function closeProductsPopup() {
  store.commit('products/unSelect')
  store.commit('articles/changePopupClose', '')
}

const popupClose = computed(() => store.getters['articles/getPopupClose'])
watch(
  () => popupClose.value,
  (newValue) => {
    let el = document.getElementsByTagName('html')[0]
    if (newValue.length) {
      el.classList.add('scroll-none')
    } else {
      el.classList.remove('scroll-none')
    }
  }
)

onMounted(async () => {
  store.commit('setLoading', true)
  await Promise.all([callProducts(), callSolutions(), callCrops()])
  store.commit('setLoading', false)
})

async function searchTypingPr(name) {
  store.commit('products/emptyProducts')
  await callProducts(name)
}

const callProducts = debounce(async function search(name = '') {
  isLoading.value = true
  await store.dispatch('products/callSearchedProducts', name)
  isLoading.value = false
}, 500)

const selectProduct = (id) => {
  store.commit('products/selectProduct', id)
}

const confirmSelectedProducts = () => {
  store.commit('products/setChosenProducts')
  store.commit('articles/changePopupClose', '')
}

async function searchTypingSl(name) {
  store.commit('solutions/emptySolutions')
  await callSolutions(name)
}

const callSolutions = debounce(async function search(name = '') {
  isLoading.value = true
  await store.dispatch('solutions/callSearchedSolutions', name)
  isLoading.value = false
}, 500)

const selectSolution = (id) => {
  store.commit('solutions/selectSolution', id)
}

const confirmSelectedSolutions = () => {
  store.commit('solutions/setChosenSolutions')
  store.commit('articles/changePopupClose', '')
}

const getProducts = computed(
  () => store.getters['products/getSearchedProducts']
)

const getSolutions = computed(
  () => store.getters['solutions/getSearchedSolutions']
)

// CROPS
const crops = computed(() => store.state.crops.crops)
const searchTypingCrops = async (name) => {
  store.commit('crops/emptyCrops')
  await callCrops(name)
}
const callCrops = debounce(async function search(name = '') {
  isLoading.value = true
  await store.dispatch('crops/callCrops', name)
  isLoading.value = false
}, 500)
const selectCrop = (id) => {
  store.commit('crops/selectCrop', id)
}
const confirmSelectedCrops = () => {
  store.commit('articles/changePopupClose', '')
}

// Scroll to top when route changes
watch(
  () => route.name,
  () => window.scrollTo(0, 0)
)
</script>

<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />

    <DynamicPopup
      v-if="popupClose === 'ProductPopup'"
      @closePopup="closeProductsPopup"
    >
      <InfinityScrlPopup
        :name="ProductPopup"
        :items="getProducts"
        :is-loading="isLoading"
        :title="$t('PRODUCT_CHOOSE_PRODUCT_MODAL_TITLE')"
        search-placeholder="Cerca un prodotto"
        @selectItem="selectProduct"
        @searchTyping="searchTypingPr"
        @callItems="callProducts"
        @confirmSelected="confirmSelectedProducts"
      />
    </DynamicPopup>

    <!--  CROPS POPUP  -->
    <DynamicPopup
      v-if="popupClose === 'CropPopup'"
      @closePopup="closeProductsPopup"
    >
      <InfinityScrlPopup
        :name="CropsPopup"
        :items="crops"
        :is-loading="isLoading"
        :title="$t('PRODUCT_CHOOSE_PRODUCT_MODAL_TITLE')"
        search-placeholder="Seleziona uno o più coltura"
        @selectItem="selectCrop"
        @searchTyping="searchTypingCrops"
        @callItems="callCrops"
        @confirmSelected="confirmSelectedCrops"
      />
    </DynamicPopup>

    <DynamicPopup
      v-if="popupClose === 'SolutionPopup'"
      @closePopup="closeProductsPopup"
    >
      <InfinityScrlPopup
        :name="SolutionPopup"
        :items="getSolutions"
        :is-loading="isLoading"
        title="Seleziona soluzione"
        search-placeholder="Cerca soluzione"
        @selectItem="selectSolution"
        @searchTyping="searchTypingSl"
        @callItems="callSolutions"
        @confirmSelected="confirmSelectedSolutions"
      />
    </DynamicPopup>

    <v-layout>
      <v-container fluid class="main-container category-container">
        <div
          class="d-flex justify-space-between align-content-center breadcrumb-holder"
        >
          <BreadCrumb :links="breadCrumbArr" :title="breadCrumbText" />
          <button
            v-if="
              $route.params.code === 'ARTICLE' && $route.name === 'Category'
            "
            class="article-page-btn"
            @click="goNewArticlePage"
          >
            <span>Aggiungi</span>
            <svg
              class="article-page-btn-plus"
              width="12"
              height="12"
              viewBox="0 0 15 15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.886 1.136a.75.75 0 0 1 1.06 0L7.25 6.438l5.304-5.302a.75.75 0 1 1 1.061 1.06L8.31 7.5l5.304 5.304a.75.75 0 0 1 .073.977l-.073.084a.75.75 0 0 1-1.06 0L7.248 8.56l-5.302 5.304a.75.75 0 0 1-1.061-1.06l5.302-5.305L.886 2.197a.75.75 0 0 1-.073-.977z"
                fill="#FFF"
                fill-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div class="content">
          <router-view />
        </div>
        <footer-desktop />
      </v-container>
    </v-layout>
  </v-app>
</template>

<style type="text/css" scoped>
.article-page-btn {
  padding: 7px 30px;
  border-radius: 18px;
  box-shadow: 0 18px 40px -6px rgba(240, 151, 58, 0.2);
  background-image: linear-gradient(to top, #f9c86c, var(--orange) 33%);
}

.article-page-btn span {
  color: var(--white);
}

.article-page-btn-plus {
  margin-left: 10px;
  transform: rotate(45deg);
}

.breadcrumb-holder {
  flex-wrap: wrap;
}

.category-container {
  width: 1156px;
  margin: auto;
  padding: 130px 0 0 0;
}

@media all and (max-width: 600px) {
  .breadcrumb {
    width: 100%;
  }
  .breadcrumb-holder button {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
