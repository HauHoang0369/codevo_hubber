<template>
  <v-app class="c-app mt-1">
    <TopBar />
    <SideBar />
    <DashboardHeader />
    <v-layout>
      <v-container fluid class="main-container">
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
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader'

export default {
  name: 'MainLayout',
  components: {
    TopBar,
    SideBar,
    DashboardHeader,
  },
  created() {
    console.log(this.$store.state.user)
    console.log(this.$store.state.user.oldAccessToken)
  },
}
</script>

<style type="text/css"></style>
