<template>
  <v-app-bar color="light" class="px-3 px-sm-7 top-bar" height="auto">
    <template #prepend>
      <router-link to="/" class="text-decoration-none">
        <HubberLogoWide />
        <span class="logo-text">{{ config.APP_ALIAS }}</span>
      </router-link>
    </template>

    <template #append>
      <div class="d-flex align-center top-bar-right">
        <v-btn icon class="top-bar-btn">
          <SearchIcon />
        </v-btn>
        <v-btn icon class="top-bar-btn">
          <NotificationIcon />
        </v-btn>
        <div class="user-image">
          <AuthImage :path="userImage" :width="74" :height="74" />
        </div>
        <div
          id="menu-activator"
          class="d-flex align-center justify-center top-bar-menu-item"
        >
          <p class="text-md top-bar-menu-item-text">Mondo valagro</p>
          <ChevronDownIcon :fill="'#a6acb5'" />

          <v-menu
            origin="auto"
            location="bottom center"
            activator="#menu-activator"
            class="list"
            width="234px"
          >
            <v-list>
              <v-list-item class="list-item">
                <v-list-item-title class="list-item-title">
                  {{ $t('MODULE_VALAGRO_WORLD') }}</v-list-item-title
                >
              </v-list-item>
              <v-list-item class="list-item">
                <router-link :to="'/myActivities'" class="router-link">
                  <v-list-item-title class="list-item-title">
                    {{ $t('MAIN_MENU_MYACTIVITIES') }}</v-list-item-title
                  ></router-link
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-divider class="ms-3" inset vertical></v-divider>
        <v-btn icon class="top-bar-btn" @click="logout">
          <LogoutIcon />
        </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script>
import HubberLogoWide from '@/components/base/Logo/HubberLogoWide.vue'

import SearchIcon from '@/components/base/icons/SearchIcon.vue'
import NotificationIcon from '@/components/base/icons/NotificationIcon.vue'
import LogoutIcon from '@/components/base/icons/LogoutIcon.vue'
import { mapGetters } from 'vuex'
import AuthImage from '@/components/base/AuthImage/AuthImage'
import ChevronDownIcon from '@/components/base/icons/ChevronDownIcon.vue'

// Components
export default {
  components: {
    AuthImage,
    HubberLogoWide,
    SearchIcon,
    NotificationIcon,
    LogoutIcon,
    ChevronDownIcon,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['isLoggedIn', 'userImage', 'userName']),
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push({ name: 'Login' })
    },
  },
}
</script>

<style type="text/css">
.top-bar {
  padding: 8px 0;
}

.top-bar-inner {
  width: 100%;
  display: flex;
  background-color: red;
  text-align: center;
}

.top-bar-inner ul {
  display: flex;
  align-items: center;
  justify-content: end;
}

.top-bar-inner ul li {
  display: flex;
}

.top-bar-right {
  display: flex;
  gap: 40px;
}

.top-bar-right .user-image {
  width: 74px;
  height: 74px;
}

.top-bar-right .user-image img {
  border-radius: 17px;
}

.top-bar-btn svg {
  width: 30px;
}

.top-bar-menu-item {
  position: relative;
  gap: 10px;
  cursor: pointer;
}

.top-bar-menu-item-text {
  font-weight: 500;
  color: var(--text);
}

.list .v-list {
  padding: 18px 0 12px;
}

.list .v-overlay__content {
  padding-top: 22px;
  border-radius: 20px;
}

.list-item {
  min-height: 41px;
  cursor: pointer;
}

.list-item:hover {
  background-color: var(--background-blue);
}

.list-item-title {
  color: var(--text);
}

.router-link {
  text-decoration: none;
  color: var(--text);
}

.logo-text {
  font-size: 21px;
}
</style>
