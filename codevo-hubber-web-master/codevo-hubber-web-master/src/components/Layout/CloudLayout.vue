<script setup>
import { ref, provide } from 'vue';
import TopBar from '@/components/TopBar/TopBar';
import SideBar from '@/components/SideBar/SideBar';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop';

const breadCrumbTitle = ref(null);

const setBreadcrumbTitle = (title) => {
  breadCrumbTitle.value = title;
};

provide('setBreadcrumbTitle', setBreadcrumbTitle);

</script>

<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout class="cloud-layout-container">
      <v-container fluid class="main-container">
        <div class="cloud-layout">
          <BreadCrumb :title="breadCrumbTitle" />
          <div class="content">
            <router-view />
          </div>
        </div>
      </v-container>
    </v-layout>
    <FooterDesktop></FooterDesktop>
  </v-app>
</template>

<style lang="scss" scoped>
.cloud-layout {
  max-width: 1160px;
  margin: 0 auto;

  .main-container {
    padding: 130px 0 40px;
  }

  .content {
    padding-top: 30px;
  }
}
</style>
