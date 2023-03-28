<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout>
      <v-container fluid class="main-container">
        <BreadCrumb />
        <TopMenu :categories="categories" />
        <TopFilters />
        <div class="content">
          <router-view />
        </div>
        <FooterDesktop></FooterDesktop>
      </v-container>
    </v-layout>
  </v-app>
</template>

<script>
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import TopMenu from '@/components/TopMenu/TopMenu'
import TopFilters from '@/components/TopFilters/TopFilters'
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop'

export default {
  name: 'MainLayout',
  components: {
    FooterDesktop,
    TopBar,
    SideBar,
    BreadCrumb,
    TopMenu,
    TopFilters,
  },
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Tutte',
        },
        {
          id: 2,
          name: 'Biostimolanti',
        },
        {
          id: 3,
          name: 'Micronutrienti',
        },
      ],
      initialCategory: 1,
      activeCategoryId: 1,
    }
  },
}
</script>

<style type="scss">
.c-app {
  background: white;
}
</style>
