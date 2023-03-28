<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
// components
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop.vue'
// services
import SocialWallService from '@/services/SocialWall/SocialWallService'

const store = useStore()
const route = useRoute()

const profile = computed(() => store.state.social_wall.viewProfile)
const breadCrumbTitles = computed(() => route.name === 'Social Wall Profilo' ? profile?.fullName : null)
const isLoading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

const friendShip = [
  {
    status: 'FRIEND',
    text: 'Rimuovi dagli amici',
    class: 'hubber-btn-rosso'
  },
  {
    status: 'NOT_FRIEND',
    text: 'Aggiungi',
    class: 'hubber-btn-primary'
  },
  {
    status: 'REQUEST_SENT',
    text: 'Richiesta inviata',
    class: 'hubber-btn-dark prevent-click'
  }
]

const onFriendAction = async (status) => {
  let newStatus
  isLoading.value = true

  try {
    switch (status) {
      case 'FRIEND':
        newStatus = 'NOT_FRIEND'
        await store.dispatch('social_wall/deleteFriendShip', { friendId: profile.value?.id, type: status })
        store.commit('social_wall/setViewProfile', { ...profile.value, friendshipStatus: newStatus })
        // Notification
        snackbar.value = true
        snackbarText.value = 'Removed!'
        break

      case 'NOT_FRIEND':
        newStatus = 'REQUEST_SENT'
        await new SocialWallService().requestFriendShip(profile.value?.id)
        store.commit('social_wall/setViewProfile', { ...profile.value, friendshipStatus: newStatus })
        // Notification
        snackbar.value = true
        snackbarText.value = 'Sent!'
        break

      case 'REQUEST_SENT':
        newStatus = 'FRIEND'
        store.commit('social_wall/setViewProfile', { ...profile.value, friendshipStatus: newStatus })
        break

      default:
        break
    }
    isLoading.value = false
  } catch (e) {
    console.log(e)
    isLoading.value = false
    await Swal.fire({
      icon: 'error',
      titleText: 'Something went wrong!',
      customClass: {
        popup: 'hubber-swal-popup'
      }
    })
  }
}

</script>
<template>
  <v-app class='c-app'>
    <TopBar />
    <SideBar />
    <v-layout>
      <v-container class='main-container' fluid>
        <div class='d-flex justify-space-between align-center'>
          <BreadCrumb :title=breadCrumbTitles />
          <div>
            <div v-for='f in friendShip' :key='f.status'>
              <ButtonPrimaryDesktop v-if='f.status === profile?.friendshipStatus' :class="['hubber-btn', f.class]"
                :disabled='isLoading' @click='onFriendAction(f.status)'>
                {{ f.text }}
              </ButtonPrimaryDesktop>
            </div>
          </div>
        </div>
        <div class='content'>
          <router-view />
        </div>
        <v-snackbar v-model="snackbar" timeout='3000' color="white" rounded='pill' elevation="24">
          {{ snackbarText }}
        </v-snackbar>
      </v-container>
    </v-layout>
  </v-app>
</template>
<style lang='scss'>
.hubber-btn {
  .button-label {
    letter-spacing: 0.78px;
  }

  &.hubber-btn-primary {
    box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3) !important;
    background-image: linear-gradient(to top, var(--primary), var(--primary-dark)) !important;
  }

  &.hubber-btn-rosso {
    box-shadow: 0 18px 40px -6px rgba(255, 81, 110, 0.2) !important;
    background-image: none !important;
    background-color: var(--rosso);
  }

  &.hubber-btn-dark {
    box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3) !important;
    background-image: none !important;
    background-color: var(--greyish-brown);
  }

  &.disabled {
    opacity: 0.5;
    cursor: default;
  }

  &.prevent-click {
    cursor: default;
    pointer-events: none;
  }
}
</style>
