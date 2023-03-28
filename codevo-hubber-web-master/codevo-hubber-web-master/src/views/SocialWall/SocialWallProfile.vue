<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
// views
import MainError from '@/views/Errors/MainError.vue'
// services
import SettingsService from '@/services/Settings/SettingsService'
// components
import SocialWallFriends from '@/components/SocialWall/SocialWallFriends'
import SocialWallProfileCard from '@/components/SocialWall/SocialWallProfileCard.vue'

const route = useRoute()
const profile = ref()

onMounted(async () => {
  store.commit('setLoading', true)
  profile.value = await SettingsService().getUser(route.params.id)
  store.commit('social_wall/setViewProfile', profile.value)
  store.commit('setLoading', false)
})

</script>

<template>
  <div class='content'>
    <v-container v-if='profile'>
      <v-row no-gutters>
        <v-col class='pr-lg-10' lg='8'>
          <div>
            <SocialWallProfileCard :data='profile' />
          </div>
        </v-col>
        <v-col class='hidden-md-and-down' lg='4'>
          <div class=''>
            <SocialWallFriends />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div v-if='!profile && !store.state.loading'>
      <MainError />
    </div>
  </div>
</template>
