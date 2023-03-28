<script setup>
import { computed, onMounted, provide, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// components
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop.vue'
import PlusIcon from '@/components/base/icons/PlusIcon.vue'
import ProductListPopup from '@/components/Product/ProductListPopup.vue'

const breadCrumbTitle = ref(null)
const router = useRouter()
const route = useRoute()

const showProductListPopup = ref(false)

const isButtonPrimaryVisible = computed(() => (
  ['Products', 'Global Products', 'Prodotti per l’agricoltura'].includes(route.name)
))

const setBreadcrumbTitle = (title) => {
  breadCrumbTitle.value = title
}

const newProduct = () => {
  if (['Global Products', 'Prodotti per l’agricoltura'].includes(route.name)) {
    router.push({ name: 'New Global Product' })
  } else if (route.name === 'Products') {
    showProductListPopup.value = true
  }
}

onMounted(() => {
  if (route.name === 'Global Products') {
    setBreadcrumbTitle('MAIN_MENU_GLOBAL_PRODUCT_TITLE')
  }
})

provide('setBreadcrumbTitle', setBreadcrumbTitle)
</script>

<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout>
      <v-container class="main-container" fluid>
        <BreadCrumb :title="breadCrumbTitle" />
        <div class="content">
          <div v-if="isButtonPrimaryVisible" class='d-flex justify-space-between align-center'>
            <div class='product-title'>{{ $t('MAIN_MENU_GLOBAL_PRODUCT_TITLE') }}</div>
            <div class='d-flex align-center add-product' @click="newProduct">
              <PlusIcon path-color='var(--primary)' style='margin-right: 5px;' />
              {{ $t('PRODUCT_ADD_PRODUCT_CAPTION') }}
            </div>
          </div>
          <router-view />
        </div>
      </v-container>
    </v-layout>
    <FooterDesktop></FooterDesktop>
    <v-dialog
      v-model="showProductListPopup"
      max-width="534"
      v-on:click:outside="showProductListPopup = false"
    >
      <v-card style="border-radius: 30px">
        <ProductListPopup v-on:close="showProductListPopup = false" />
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style lang="scss">
.hubber-btn {
  &.hubber-btn-orange {
    box-shadow: 0 18px 40px -6px rgba(240, 151, 58, 0.2);
    background-image: linear-gradient(to top, #f9c86c, var(--orange) 33%);

    span {
      color: white;
    }
  }
}
</style>

<style lang='scss' scoped>
.add-product {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.product-title {
  height: 40px;
  font-size: 40px;
  line-height: 1;
}
</style>
