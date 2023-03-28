<script setup>
import { useRoute } from "vue-router/dist/vue-router";
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import {ROUTE_NAMES} from "@/config/constants";

const route = useRoute();

</script>

<template>
  <v-app class='c-app'>
    <TopBar />
    <SideBar />
    <v-layout>
      <v-container class='main-container' fluid>
        <div
          class='producer-layout'
          :class="{
            'layout-sm': route.name === ROUTE_NAMES.PRODUCER_LIST,
            'layout-md': route.name === ROUTE_NAMES.PRODUCER_DETAIL || route.name === ROUTE_NAMES.PRODUCER_CREATE
          }"
        >
          <div
            v-if="route.name === 'PARTY_VIEW_COMPETITORS_TITLE'"
            class='d-flex justify-space-between align-center'
          >
            <BreadCrumb />
          </div>
          <div class='layout-content'>
            <router-view />
          </div>
        </div>
      </v-container>
    </v-layout>
  </v-app>
</template>

<style lang='scss' scoped>
.producer-layout {
  max-width: 560px;
  margin: 0 auto;

  &.layout-sm {
    max-width: 560px;
  }

  &.layout-md {
    max-width: 1160px;
  }
}

.layout-content {
  padding-top: 30px;
}

.main-container {
  padding-top: 130px;
}
</style>
