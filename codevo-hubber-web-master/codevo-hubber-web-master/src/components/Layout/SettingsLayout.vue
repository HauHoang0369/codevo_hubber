<script setup>
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop'

</script>

<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout class="setting-layout-container">
      <v-container fluid class="main-container">
        <div class="setting-layout">
          <div class="breadcrumb-container">
            <BreadCrumb :title="$t('MAIN_MENU_SETTINGS_TITLE')" />
          </div>

          <div class="layout-content">
            <router-view />
          </div>
        </div>
      </v-container>
    </v-layout>

    <FooterDesktop></FooterDesktop>
  </v-app>
</template>

<style lang="scss" scoped>
.setting-layout-container {
  overflow: visible !important;
}

.setting-layout {
  max-width: 560px;
  margin: 0 auto;

  .breadcrumb-container {
    margin-bottom: 30px;
  }

  .layout-content {

  }
}
</style>
