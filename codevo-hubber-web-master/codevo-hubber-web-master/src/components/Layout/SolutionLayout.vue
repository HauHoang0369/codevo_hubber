<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout>
      <v-container class="main-container">
        <BreadCrumb />
        <div class="content">
          <router-view />
        </div>
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

export default {
  name: 'SolutionLayout',
  components: {
    TopBar,
    SideBar,
    BreadCrumb,
  },
}
</script>

<style type="text/css"></style>
