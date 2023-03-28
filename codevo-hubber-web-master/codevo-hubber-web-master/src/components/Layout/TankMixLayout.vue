<script setup>
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import SideBar from '@/components/SideBar/SideBar';
import TopBar from '@/components/TopBar/TopBar';
import { ROUTE_NAMES } from "@/config/constants";
import { useRoute } from "vue-router";

const route = useRoute();

</script>

<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout class="tank-mix-layout-wrapper">
      <v-container fluid class="main-container">
        <div
          class="tank-layout"
          :class="{
            'layout-md': route.name === ROUTE_NAMES.TANK_MIX_DETAIL || route.name === ROUTE_NAMES.TANK_MIX_COMBINATION,
            'layout-sm': route.name === ROUTE_NAMES.TANK_MIX_ADVANCE_SEARCH
          }"
        >
          <BreadCrumb />

          <div class="content">
            <router-view />
          </div>
        </div>
      </v-container>
    </v-layout>

    <div class="footer-container">
      <FooterDesktop />
    </div>
  </v-app>
</template>

<style lang="scss" scoped>
.main-container {
  padding-bottom: 80px;
}

.tank-mix-layout-wrapper {
  overflow: visible !important;
}

.tank-layout {
  max-width: 780px;
  margin: 0 auto;

  &.layout-md {
    max-width: 1160px;
  }

  &.layout-sm {
    max-width: 560px;
  }

  .content {
    padding-top: 30px;
  }
}

.footer-container {
  margin-top: 80px;
}
</style>
