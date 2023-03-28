<script setup>
import ProductCard from "@/components/ProductCard/ProductCard";
import TabBar from "@/components/TabBar/TabBar";
import CheckIcon from '@/assets/icons/icon-system-check@2x.png';
import {computed, onMounted, reactive, ref, inject, onUnmounted, provide} from 'vue'
import ProductService from "@/services/Product/ProductService";
import Grid from '@/components/base/Grid/Grid'

import {useRoute, useRouter} from 'vue-router';
import DocumentList from "@/components/DocumentList/DocumentList";
import ButtonPrimaryDesktop from "@/components/base/inputs/ButtonPrimaryDesktop";
import {useStore} from "vuex";
import ProductDetailSection from "@/components/Product/ProductDetailSection";
import ProductDetailIngredients from "@/components/Product/ProductDetailsIngredients";
import ProductDetailsSolutions from "@/components/Product/ProductDetailsSolutions";
import ProductDetailsSameLineProducts from "@/components/Product/ProductDetailsSameLineProducts";
import ProductDetailTankMix from "@/components/Product/ProductDetailTankMix";
import RelatedArticleCard from "@/components/Article/RelatedArticleCard";
import SocialWallPost from "@/components/SocialWall/SocialWallPost";
import ClientMessageLoggedIn from "@/components/Popup/ClientMessageLoggedIn.vue";
import ClientMessageAnonymous from "@/components/Popup/ClientMessageAnonymous.vue";
import ClientMessageSent from "@/components/Popup/ClientMessageSent.vue";
import LabelIngredient from "@/components/base/Label/LabelIngredient.vue";
import config from '@/config/config'
import ProductProperties from "@/components/Product/ProductProperties.vue";
import ProductDetailsHeader from "@/components/Product/ProductDetailsHeader.vue";


const route = useRoute();
const router = useRouter()
const store = useStore()
const user = computed(() => store.getters.getUser)
const setBreadcrumbTitle = inject('setBreadcrumbTitle')

const tabBarItems = ref([
  'Generale', 'Documenti', 'Soluzioni', 'Tank Mix', 'Prodotti correlati', 'Testimonial'
])

const tabBarSections = ref([
  'GENERAL', 'DOCUMENTS', 'SOLUTION', 'TANKMIX', 'RELATEDPRODUCTS', 'TESTIMONIAL'
])

const phenologicalPhases = ref([
  'Trapianto', 'Sviluppo foliare', 'Formazione di germogli laterali', 'Emergenza infiorescenza'
])

const clientMessageAnonymousDialog = ref(false)
const clientMessageLoggedInDialog = ref(false)
const clientMessageSentDialog = ref(false)

const id = ref()
const product = ref([])
const isFixed = ref(false)

const selectedTab = ref(0)


const ingredientsPageable = ref({
  "page": 0,
  "size": 3,
  "sort": "asc"
})
// Stores full api response, including pagedata
const ingredientsEnvelope = ref({})
// Stores only response content, actual data
const ingredients = ref([])
// Ingredients loading indicator
const ingredientsLoading = ref(false)
// Ingredients error
const ingredientsError = ref(null)

const documentsPageable = ref({
  "page": 0,
  "size": 6,
  "sort": "asc"
})
const documentsEnvelope = ref({})
const documents = ref([])
const documentsLoading = ref(false)
const documentsError = ref(null)

const solutionsPageable = ref({
  "page": 0,
  "size": 6,
  "sort": "asc"
})
const solutionsEnvelope = ref({})
const solutions = ref([])
const solutionsLoading = ref(false)
const solutionsError = ref(null)

const sameLineProducts = ref([])
const sameLineProductsPageable = ref({
  "page": 0,
  "size": 3,
  "sort": "asc"
})
const sameLineProductsEnvelope = ref({})
const sameLineProductsLoading = ref(false)
const sameLineProductsError = ref(null)


// const tankMixesPageable = ref({
//   "page": 0,
//   "size": 6,
//   "sort": "asc"
// })
// const tankMixesEnvelope = ref({})
// const tankMixes = ref([])
// const tankMixesLoading = ref(false)
// const tankMixesError = ref(null)


const reviewsPageable = ref({
  "page": 0,
  "size": 2,
  "sort": "asc"
})
const reviewsEnvelope = ref({})
const reviews = ref([])
const reviewsLoading = ref(false)
const reviewsError = ref(null)

const postsPageable = ref({
  "page": 0,
  "size": 2,
  "sort": "asc"
})
const postsEnvelope = ref({})
const posts = ref([])
const postsLoading = ref(false)
const postsError = ref(null)


onMounted(async () => {
  await loadData()
  window.addEventListener('scroll', onHandleScroll)
});

onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleScroll)
})

const onHandleScroll = async (e) => {
  let header = document.querySelector('.top-bar')
  let tabBarContainer = document.querySelector('.tab-bar-container')
  let askvalagro = document.querySelector('#askvalagro')
  let stickyTop = document.querySelector('#appbar')
  if(askvalagro && askvalagro.getBoundingClientRect()){
    if (askvalagro.getBoundingClientRect().top < 0) {
      header.append(stickyTop)
      isFixed.value = true
    } else {
      tabBarContainer.append(stickyTop)
      isFixed.value = false
    }
  }
}

const intersectionOptions = {threshold: 1}

const onIntersect = (entries, observer) =>{
  if(observer[0].isIntersecting && observer[0].intersectionRatio >= 1){
    console.log(observer[0])
    selectedTab.value = tabBarSections.value.indexOf(observer[0].target.id)
    console.log("INTERSECTED RATIO:" + observer[0].intersectionRatio + " ID:" + observer[0].target.id + " VISIBLE:" + observer[0].isVisible)
  }else{
    //selectedTab.value = tabBarSections.value.indexOf(0)
    console.log("NOT INTERSECTED")
  }
}

const loadData = async () => {
  try {
    store.commit('setLoading', true)
    id.value = route.params.id;
    product.value = await new ProductService().service.getProduct({
      marketId: user.value.market.id,
      productId: id.value,
      hideLoader: true,
    })
    console.log(product.value)
    setBreadcrumbTitle(product.value?.name ?? null)
    console.log("isAnonymous: " + isAnonymous.value)
    if (!isAnonymous.value) {
      await loadIngredients(true)
      await loadDocuments(true)
      await loadSolutions(true)
      await loadSameLineProducts(true)
      await loadTankMixes(true)
      await loadReviews(true)
      await loadPosts(true)
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
    const data = await new ProductService().service.toggleProductFavourite(id.value);
    // await loadData()
    router.go(0)
  } catch (e) {
    console.error(e)
  }
}

let onTabChange = async (index) => {
  selectedTab.value = index
  let element = document.getElementById(tabBarSections.value[index])
  if(index == 0){
    window.scrollTo({top: 0, behavior: 'smooth'});
  }else{
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
}

const loadIngredients = async (hideLoader) => {
  try {
    ingredientsEnvelope.value = await new ProductService().service.getProductIngredients(
      {
        marketId: user.value.market.id,
        productId: id.value,
        contentLanguage: user.value.contentLanguage.isoCode,
        pageable: ingredientsPageable.value,
        hideLoader: hideLoader
      }
    )
    // TODO: Check data length, if zero throw error
    ingredientsError.value = null
    if (ingredientsEnvelope.value.content) {
      ingredients.value.push(...(ingredientsEnvelope.value.content))
    } else {
      ingredientsError.value = "No data available"
    }
  } catch (e) {
    // Check error type, if network error show this
    // TODO: multi lang?
    ingredientsError.value = "Failed to fetch data"
  }

}


const loadDocuments = async (hideLoader) => {
  try {
    documentsEnvelope.value = await new ProductService().service.getProductDocuments(
      {
        marketId: user.value.market.id,
        productId: id.value,
        contentLanguage: user.value.contentLanguage.isoCode,
        pageable: documentsPageable.value,
        hideLoader: hideLoader
      }
    )
    documentsError.value = null
    if (documentsEnvelope.value.content) {
      documents.value.push(...(documentsEnvelope.value.content))
    } else {
      documentsError.value = "No data available"
    }
  } catch (e) {
    documentsError.value = "Failed to fetch data"
  }
}

const loadSolutions = async (hideLoader) => {
  try {
    solutionsEnvelope.value = await new ProductService().service.getProductSolutions({
      marketId: user.value.market.id,
      productId: id.value,
      contentLanguage: user.value.contentLanguage.isoCode,
      pageable: solutionsPageable.value,
      hideLoader: hideLoader,
    })
    if (solutionsEnvelope.value.content) {
      solutions.value.push(...(solutionsEnvelope.value.content))
    } else {
      solutionsError.value = "No data available"
    }
  } catch (e) {
    documentsError.value = "Failed to fetch data"
  }
}

const loadSameLineProducts = async (hideLoader) => {
  try {
    // let sameLineProductsData = await new ProductService().service.getProductSameLineProducts(user.value.market.id, id.value, user.value.contentLanguage.id)
    // const pageable = {"page": 0, "size": 3, "sort": "asc"}
    // TODO: Temp only
    // user.value.market.id, user.value.contentLanguage.id, pageable
    sameLineProductsEnvelope.value = await new ProductService().service.getProductSameLineProducts({
      marketId: user.value.market.id,
      productId: id.value,
      contentLanguage: user.value.contentLanguage.isoCode,
      pageable: sameLineProductsPageable.value,
      hideLoader: hideLoader,
    });
    if (sameLineProductsEnvelope.value.content) {
      sameLineProducts.value.push(...(sameLineProductsEnvelope.value.content))
    } else {
      sameLineProductsError.value = "No data available"
    }
  } catch (e) {
    sameLineProductsError.value = "Failed to fetch data"
  }
}



const tankMixesError = ref(null)
const tankMixesLoading = ref(false)
const tankMixes = ref({
  "FEASIBLE": {
    pageable: {
      "page": 0,
      "size": 7,
      "sort": "asc"
    },
    envelope: Object,
    mixes: [],
    fetchError: null,
  },
  "NOT_FEASIBLE": {
    pageable: {
      "page": 0,
      "size": 7,
      "sort": "asc"
    },
    envelope: Object,
    mixes: [],
    fetchError: null,
  },
  "FEASIBLE_WITH_CAUTION": {
    pageable: {
      "page": 0,
      "size": 7,
      "sort": "asc"
    },
    envelope: Object,
    mixes: [],
    fetchError: null,
  },
})

const tankMixesLoadMore = computed(() => {
  let totalRecordCount = 0
  let totalShownCount = 0;
  for (const [key, value] of Object.entries(tankMixes.value)) {
    totalShownCount += tankMixes.value[key].mixes?.length
    totalRecordCount += tankMixes.value[key].envelope?.totalElements
  }
  return totalRecordCount - totalShownCount
})

const loadTankMixes = async (hideLoader) => {
  try {
    for (const [key, value] of Object.entries(tankMixes.value)) {
      console.log(`${key}: ${value}`)
      console.log("PAGEABLE")
      console.log(tankMixes.value[key].pageable)
      // load data only if not last page
      if (tankMixes.value[key]?.envelope?.last === true) {
        continue
      }
      tankMixes.value[key].envelope = await new ProductService().service.getProductMixes({
        productId: id.value,
        marketId: user.value.market.id,
        contentLanguage: user.value.contentLanguage.isoCode,
        pageable: tankMixes.value[key].pageable,
        result: key,
        hideLoader: hideLoader
      })
      if (tankMixes.value[key].envelope.content) {
        tankMixes.value[key].mixes.push(...(tankMixes.value[key].envelope.content))
      }
      // check total count
      else {
        tankMixesError.value = "No data available"
      }
      console.log(tankMixes)
    }
  } catch (e) {
    tankMixesError.value = "Failed to fetch tank mixes"
  }
}

const loadReviews = async (hideLoader) => {
  try {
    reviewsEnvelope.value = await new ProductService().service.getProductReviews({
      tagType: 'PRODUCT',
      objectId: id.value,
      contentLanguage: user.value.contentLanguage.isoCode,
      pageable: reviewsPageable.value,
      hideLoader: hideLoader,
    })
    console.log("REVIEWS")
    console.log(reviewsEnvelope.value)
    if (reviewsEnvelope.value.content) {
      reviews.value.push(...(reviewsEnvelope.value.content))
    } else {
      reviewsError.value = "No data available"
    }
  } catch (e) {
    reviewsError.value = "Failed to fetch reviews"
  }
}

const loadPosts = async (hideLoader) => {
  try {
    postsEnvelope.value = await new ProductService().service.getProductPosts({
      productId: id.value,
      pageable: postsPageable.value,
      hideLoader: hideLoader,
    })
    if (postsEnvelope.value.content) {
      posts.value.push(...(postsEnvelope.value.content))
    } else {
      postsError.value = "No data available"
    }
  } catch (e) {
    reviewsError.value = "Failed to fetch articles"
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

const onMoreSolutions = async () => {
  try {
    solutionsLoading.value = true
    solutionsPageable.value.page += 1
    await loadSolutions(true)
    solutionsLoading.value = false
  } catch (e) {
    solutionsLoading.value = false
  }
}

const onMoreSameLineProducts = async () => {
  try {
    sameLineProductsLoading.value = true
    sameLineProductsPageable.value.page += 1
    await loadSameLineProducts(true)
    sameLineProductsLoading.value = false
  } catch (e) {
    sameLineProductsLoading.value = false
  }
}

const onMoreTankMixes = async () => {
  try {
    tankMixesLoading.value = true
    for (const [key, value] of Object.entries(tankMixes.value)) {
      // increase page number only if not last page
      if (tankMixes.value[key]?.envelope?.last === false) {
        tankMixes.value[key].pageable.page += 1
      }
    }
    await loadTankMixes(true)
    tankMixesLoading.value = false
  } catch (e) {
    console.log(e)
    tankMixesLoading.value = false
  }
}


const onMoreDocuments = async () => {
  try {
    documentsLoading.value = true
    documentsPageable.value.page += 1
    await loadDocuments(true)
    documentsLoading.value = false
  } catch (e) {
    documentsLoading.value = true
  }
}

const onMoreReviews = async () => {
  try {
    reviewsLoading.value = true
    reviewsPageable.value.page += 1
    await loadReviews(true)
    reviewsLoading.value = false
  } catch (e) {
    reviewsLoading.value = false
  }
}

const onMorePosts = async () => {
  try {
    postsLoading.value = true
    postsPageable.value.page += 1
    await loadPosts(true)
    postsLoading.value = false
  } catch (e) {
    postsLoading.value = true
  }
}

const onDownloadDocuments = async (documents) => {
  console.log(documents)
  for (const item of documents) {
    console.log(item)
    console.log("Downloading document " + item.id)
    let documentData = await new ProductService().service.getProductDocumentDownload(user.value.market.id, id.value, item.id);
    console.log(documentData)
  }
}


provide('clientMessageAnonymousDialog', clientMessageAnonymousDialog)
provide('clientMessageLoggedInDialog', clientMessageLoggedInDialog)

const onClientMessage = async () => {
  console.log("onClientMessage")
  // Check if Loggedin
  if (isAnonymous.value !== true) {
    clientMessageLoggedInDialog.value = true
  } else {
    clientMessageAnonymousDialog.value = true
  }
}

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
    await router.replace({path: '/'})
  }
}

const isAnonymous = computed({
  get() {
    let isAnonymousUser = (user.value.id === null || user.value.id === undefined)
    return isAnonymousUser
  }
})

// Custom directive: Capitalise
const vCapitalise = {
  mounted: (el, binding, vnode, prevVnode) => {
    let value = el.innerHTML.toLowerCase()
    el.innerHTML = value.charAt(0).toUpperCase() + value.slice(1)
  }
}

</script>


<template>
  <div>
    <ClientMessageAnonymous v-on:callback="onClientMessageAnonymousCallback">
    </ClientMessageAnonymous>
    <ClientMessageLoggedIn v-on:callback="onClientMessageLoggedInCallback">
    </ClientMessageLoggedIn>
    <ClientMessageSent v-on:callback="onClientMessageSentCallback"></ClientMessageSent>

    <ProductDetailsHeader
      :product="product"
      :product-sizes="product?.productSizes"
      v-on:favourite="favourite"
    >

    </ProductDetailsHeader>

    <div class="mt-16 mx-auto text-center">
      <div class="information-title">Hai bisogno di maggiori informazioni su {{ product.name }} ?</div>
      <div class="mt-3 information-text">Il nostro Tech&Sales team può aiutarti a trovare la migliore soluzione per le
        tue colture.
      </div>
      <div id="askvalagro" class="mt-6">
        <ButtonPrimaryDesktop @click="onClientMessage">
          {{$t('ASK_TO')}} {{ config.CUSTOMER_NAME }}
        </ButtonPrimaryDesktop>
      </div>
    </div>

    <div  class="fluid-row mt-16" >
      <div class="tab-bar-container">
        <div id="appbar" class="full-appbar" >
        <v-row>
          <TabBar :items="tabBarItems" :selected="selectedTab" v-on:change="onTabChange" :class="{'fixed justify-center': isFixed}"></TabBar>
        </v-row>
        </div>
      </div>
    </div>


    <Grid xl="2" lg="2" md="1" sm="1" :column-gap="40" :row-gap="30" class="claims-and-characteristics-section">
      <div>
        <div class="claim-text">
          {{ product.claim }}
        </div>
        <div class="mt-7">
          <div class="d-flex flex-row align-center " v-for="(item, index) in product?.highlights" :key="index">
            <div><img :src="CheckIcon" class="check-icon"/></div>
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
    <ProductDetailIngredients
      v-if="!isAnonymous" id="GENERAL"
      v-intersect="{handler: onIntersect,options: intersectionOptions}"
      :ingredients="ingredients"
      :more="ingredientsEnvelope?.totalElements-ingredients?.length"
      :show-more="ingredientsEnvelope?.last===false"
      :loading="ingredientsLoading"
      :error="ingredientsError"
      :divider=true
      v-on:loadMore="onMoreIngredients"
    />
    <DocumentList
      v-if="!isAnonymous"
      v-intersect="{handler: onIntersect,options: intersectionOptions}"
      id="DOCUMENTS"
      :documents="documents"
      :loading="documentsLoading"
      :more="documentsEnvelope?.totalElements - documents?.length"
      :show-more="solutionsEnvelope?.last===false"
      :error="documentsError"
      :divider=true
      v-on:more="onMoreDocuments"
      v-on:download="onDownloadDocuments">
    </DocumentList>
    <ProductDetailsSolutions
      id="SOLUTION"
      v-intersect="{handler: onIntersect,options: intersectionOptions}"
      v-if="!isAnonymous"
      :solutions="solutions"
      :more="solutionsEnvelope?.totalElements-solutions?.length"
      :show-more="solutionsEnvelope?.last===false"
      :loading="solutionsLoading"
      :error="solutionsError"
      :divider=true
      v-on:loadMore="onMoreSolutions"
    >
    </ProductDetailsSolutions>
    <ProductDetailsSameLineProducts
      v-if="!isAnonymous"
      :products="sameLineProducts"
      :more="sameLineProductsEnvelope?.totalElements-sameLineProducts?.length"
      :show-more="sameLineProductsEnvelope?.last===false"
      :loading="sameLineProductsLoading"
      :error="sameLineProductsError"
      :divider=true
      v-on:loadMore="onMoreSameLineProducts">
    </ProductDetailsSameLineProducts>
  <!--    <ProductDetailsRelatedProducts-->
    <!--      v-if="!isAnonymous"-->
    <!--      :products="sameLineProducts"-->
    <!--      :more="sameLineProductsEnvelope?.totalElements-sameLineProducts?.length"-->
    <!--      :show-more="sameLineProductsEnvelope?.last===false"-->
    <!--      :loading="sameLineProductsLoading"-->
    <!--      :error="sameLineProductsError"-->
    <!--      :divider=true-->
    <!--      v-on:loadMore="onMoreSameLineProducts">-->
    <!--    </ProductDetailsRelatedProducts>-->


    <div class="mt-15 mb-15 mx-auto text-center">
      <div class="information-title">{{$t('NEED_MORE_INFORMATION_ABOUT')}} {{ product.name }} ?</div>
      <div class="mt-3 information-text">{{$t('OUR_TECH_AND_SALES_MAY_HELP_YOU')}}.
      </div>
      <div class="mt-6">
        <ButtonPrimaryDesktop @click="onClientMessage">
          {{$t('ASK_TO')}} {{ config.CUSTOMER_NAME }}
        </ButtonPrimaryDesktop>
      </div>
    </div>


    <div class="fluid-row"
          v-intersect="{handler: onIntersect,options: intersectionOptions}"
          id="TANKMIX">
      <div class="fluid-container tankmixes-section">
        <!--        :more="tankMixesEnvelope?.totalElements-tankMixes?.length"-->
        <!--        :show-more="tankMixesEnvelope?.last===false"-->
        <ProductDetailSection

          class="tankmix-detail"
          v-if="!isAnonymous"
          load-more-label="Guarda altri"
          :more="tankMixesLoadMore"
          :show-more="tankMixesLoadMore>0"
          :loading="tankMixesLoading"
          :error="tankMixesError"
          v-on:load-more="onMoreTankMixes">
          <template v-slot:topIcon>
            <img src="@/assets/icons/icon-detailed-tankmix.png"
                 srcset="@/assets/icons/icon-detailed-tankmix@2x.png 2x,
             @/assets/icons/icon-detailed-tankmix@3x.png 3x"
                 class="Icondetailedtankmix">
          </template>
          <template v-slot:title>Tank Mix</template>
          <template v-slot:description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh
            finibus et. Aenean eu enim justo.
          </template>
          <div class="">
            <div>COMBINAZIONI SICURE</div>
            <div class="tankmixes-container w-100">
              <Grid xl="7" lg="4" md="2" sm="1" :column-gap="20" :row-gap="20"
                    class="">
                <LabelIngredient v-for="(mix, index) in tankMixes['FEASIBLE'].mixes" :key="index" type="feasible">
                  {{ mix?.name }}
                </LabelIngredient>
              </Grid>
              <div class="align-self-end" style="width: fit-content">
                <LabelIngredient type="feasible"
                                 v-if="(tankMixes['FEASIBLE'].envelope?.totalElements - tankMixes['FEASIBLE'].mixes?.length)>0">
                  + {{ tankMixes['FEASIBLE'].envelope?.totalElements - tankMixes['FEASIBLE'].mixes?.length }}
                </LabelIngredient>
              </div>
            </div>

            <div>DA MISCELARE CON CAUTELA</div>
            <div class="tankmixes-container w-100">
              <Grid xl="7" lg="4" md="2" sm="1" :column-gap="20" :row-gap="20"
                    class="">
                <LabelIngredient v-for="(mix, index) in tankMixes['NOT_FEASIBLE'].mixes" :key="index"
                                 type="not-feasible">
                  {{ mix?.name }}
                </LabelIngredient>
              </Grid>
              <div class="align-self-end" style="width: fit-content">
                <LabelIngredient type="not-feasible"
                                 v-if="(tankMixes['NOT_FEASIBLE'].envelope?.totalElements - tankMixes['NOT_FEASIBLE'].mixes?.length)>0">
                  + {{ tankMixes['NOT_FEASIBLE'].envelope?.totalElements - tankMixes['NOT_FEASIBLE'].mixes?.length }}
                </LabelIngredient>
              </div>
            </div>

            <div>ATTENZIONE! NON COMPATIBILE</div>
            <div class="tankmixes-container w-100">
              <Grid xl="7" lg="4" md="2" sm="1" :column-gap="20" :row-gap="20"
                    class="">
                <LabelIngredient v-for="(mix, index) in tankMixes['FEASIBLE_WITH_CAUTION'].mixes" :key="index"
                                 type="feasible-with-caution">
                  {{ mix?.name }}
                </LabelIngredient>
              </Grid>
              <div class="align-self-end" style="width: fit-content">
                <LabelIngredient type="feasible-with-caution"
                                 v-if="(tankMixes['FEASIBLE_WITH_CAUTION'].envelope?.totalElements - tankMixes['FEASIBLE_WITH_CAUTION'].mixes?.length)>0">
                  + {{
                    tankMixes['FEASIBLE_WITH_CAUTION'].envelope?.totalElements - tankMixes['FEASIBLE_WITH_CAUTION'].mixes?.length
                  }}
                </LabelIngredient>
              </div>
            </div>

          </div>
        </ProductDetailSection>
      </div>
    </div>

    <div class="mt-15 mb-15">
      <Grid :xl=[2,1] lg="1" md="1" sm="1" :column-gap="38" :row-gap="20"
            class="">
        <div class="w-100">

          <ProductDetailSection
            v-if="!isAnonymous"
            load-more-label="Guarda altri"
            load-more-align="start"
            :more="reviewsEnvelope?.totalElements-reviews?.length"
            :show-more="reviewsEnvelope?.last===false"
            :loading="reviewsLoading"
            :error="reviewsError"
            v-on:load-more="onMoreReviews">
            <template v-slot:title>Tank Testimonial</template>
            <Grid xl="2" lg="2" md="2" sm="1" :column-gap="38" :row-gap="20"
                  class="">
              <SocialWallPost v-for="(review, index) in reviews" :key="index" :data="review">

              </SocialWallPost>
            </Grid>
          </ProductDetailSection>
        </div>
        <div>
          <ProductDetailSection
            v-if="!isAnonymous"
            load-more-label="Guarda altri"
            load-more-align="start"
            :more="postsEnvelope?.totalElements-posts?.length"
            :show-more="postsEnvelope?.last===false"
            :loading="postsLoading"
            :error="postsError"
            v-on:load-more="onMorePosts">
            <template v-slot:title>AG Articles</template>
            <Grid xl="1" lg="1" md="1" sm="1" :column-gap="38" :row-gap="20"
                  class="">
              <div v-for="(article, index) in posts" :key="index">
                <RelatedArticleCard :article="article"></RelatedArticleCard>
              </div>
            </Grid>
          </ProductDetailSection>
        </div>
      </Grid>
    </div>


    <div
      id="TESTIMONIAL"
      v-intersect="{handler: onIntersect,options: intersectionOptions}"
      class="reviews-and-articles">
      <div class="reviews-section">

      </div>
      <div class="articles-section">

      </div>
    </div>


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

.fluid-container {
  padding-left: 180px;
  padding-right: 180px;
}

.tab-bar-container {
  padding-left: 180px;
}


.claims-and-characteristics-section {
  margin-top: 61px;
}

.claim-text {
  ont-family: Ubuntu;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  color: var(--primary);
}

.highlight-item {
  font-family: Ubuntu;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: normal;
  color: var(--text);
}


.characteristics-subitem-title {
  font-family: Ubuntu;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: var(--text);
}

.characteristics-subitem-value {
  font-family: Ubuntu;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: right;
  color: var(--text);
}


.application-item {
  color: var(--primary);
  background-color: white;
}

.applications-container {
  gap: 10px
}

.Icondetailedtankmix{
  margin-top: 30px;
}


.information-title {
  font-family: Ubuntu;
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
}

.information-text {
  font-family: Ubuntu;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: var(--text);
}

.tankmixes-section {
  background-color: var(--background-blue);
}

.tankmixes-container {
  margin-bottom: 59px;
  margin-top: 22px;
  display: grid;
  grid-template-columns: 7fr 1fr;
  grid-column-gap: 20px;
}

.fixed{box-shadow:none !important;}

.full-appbar{width:100%}

.tankmix-detail{padding-bottom:60px;}

/*
.reviews-and-articles {
  display: grid;
  grid-column-gap: 38px;
  grid-template-columns: 1fr 1fr 1fr;
}
.reviews-section {
  grid-column-start: 1;
  grid-column-end: 3;
}

.articles-section {
  grid-column: 3;
}

.reviews-container {
  margin-top: 30px;
  display: grid;
  grid-column-gap: 38px;
  grid-row-gap: 21px;
  grid-template-columns: 1fr 1fr;
}

.articles-container {
  margin-top: 30px;
  display: grid;
  grid-row-gap: 20px;
  grid-template-columns: 1fr;
}
*/

</style>
