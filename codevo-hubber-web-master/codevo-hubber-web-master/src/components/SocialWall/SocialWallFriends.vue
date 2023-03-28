<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import IconAddContact from '@/assets/icons/icon-system-add-contact@2x.png'
import IconRemoveContact from '@/assets/icons/icon-system-remove-contact@2x.png'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import Observer from '@/components/base/Observer/Observer.vue'

const store = useStore()

const friends = computed(() => store.state.social_wall.friends)
const dataFriend = computed(() => store.state.social_wall.dataFriend)
const listFriendShipRequest = computed(() => store.state.social_wall.listFriendShipRequest)
const dataFriendShipRequest = computed(() => store.state.social_wall.dataFriendShipRequest)
const SIZE = 10

let isLoading = ref(false)

const getFriends = async (page) => {
  isLoading.value = true
  await store.dispatch('social_wall/getFriends', { page, hideLoader: true })
  isLoading.value = false
}

const getFriendShipRequest = async (page) => {
  isLoading.value = true
  await store.dispatch('social_wall/getListFriendShipRequest', { page, hideLoader: true })
  isLoading.value = false
}

const getListFriend = async () => {
  if (isLoading.value) {
    // Prevent load more data at the same time
    return
  }

  if (dataFriendShipRequest.value?.totalPages === 0
    || dataFriendShipRequest.value?.numberOfElements < SIZE
    || dataFriendShipRequest.value?.totalPages === dataFriendShipRequest.value?.number + 1) {
    // No more data for friend requests or last page
    if (dataFriend.value?.totalPages === 0
      || dataFriend.value?.numberOfElements < SIZE
      || dataFriend.value?.totalPages === dataFriend.value?.number + 1
    ) {
      // No data for friend list or last page
      return
    } else {
      // Get friends
      await getFriends((dataFriend.value?.number ?? -1) + 1)
    }
  } else {
    // Get friend request
    await getFriendShipRequest((dataFriendShipRequest.value?.number ?? -1) + 1)
    if (store.getters['social_wall/getDataFriendShipRequest']?.numberOfElements < SIZE) {
      // If last page get friend
      await getFriends((dataFriend.value?.number ?? -1) + 1)
    }
  }
}

const onAddContact = async (friendId) => {
  await store.dispatch('social_wall/acceptFriendShip', friendId)
  if (store.state.social_wall.viewProfile && store.state.social_wall.viewProfile.id === friendId) {
    // Check if staying selected profile
    store.commit('social_wall/setViewProfile', { ...store.state.social_wall.viewProfile, friendshipStatus: 'REQUEST_SENT' })
  }
}

const onRemoveContact = async (friendId, type) => {
  await store.dispatch('social_wall/deleteFriendShip', { friendId, type })
  if (store.state.social_wall.viewProfile && store.state.social_wall.viewProfile.id === friendId) {
    // Check if staying selected profile
    store.commit('social_wall/setViewProfile', { ...store.state.social_wall.viewProfile, friendshipStatus: 'NOT_FRIEND' })
  }
}

</script>

<template>
  <div>
    <v-card class="friends-card" :class="{ background_loadding: isLoading }">
      <div class="text-h6 font-weight-bold">Amici</div>
      <div class="friends-list mt-5">
        <!-- Friend request list -->
        <div class="friend-item d-flex flex-row justify-space-between mb-4 align-center"
          v-for="(item, idx) in listFriendShipRequest" :key="idx">
          <div class="d-flex flex-row flex-grow-1 align-center">
            <div class="friend-image">
              <AuthImage :path="item?.imageUrl" />
            </div>
            <div class="friend-name">
              {{ item.shownName }}
            </div>
          </div>
          <div class="friend-icon">
            <div v-on:click.prevent="onRemoveContact(item.id, 'FRIEND_SHIP_REQUEST')">
              <img class="icon-remove" :src="IconRemoveContact" />
            </div>
            <div v-on:click.prevent="onAddContact(item.id)">
              <img :src="IconAddContact" />
            </div>
          </div>
        </div>

        <!-- Friend list -->
        <div class="friend-item d-flex flex-row justify-space-between mb-4 align-center"
          v-for="(item, index) in friends" :key="index">
          <div class="d-flex flex-row flex-grow-1 align-center">
            <div class="friend-image">
              <AuthImage :path="item?.imageUrl" />
            </div>
            <div class="friend-name">
              {{ item?.shownName }}
            </div>
          </div>
          <div class="friend-icon">
            <div v-on:click.prevent="onRemoveContact(item.id, 'FRIEND')">
              <img class="icon-remove" :src="IconRemoveContact" />
            </div>
          </div>
        </div>

        <Observer @intersect="getListFriend" />
        <div v-if="isLoading" class="spinning justify-center align-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style lang='scss' scoped>
.friends-card {
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);

  &.background_loadding {
    opacity: .7;

    .spinning {
      position: absolute;
      width: 100%;
      height: 100%;
      text-align: center;
      bottom: 0;
    }
  }
}

.friends-list {
  min-height: 100px;
  max-height: 240px;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
    padding-right: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7.5px;
    background-color: var(--grey);
  }
}

.friend-name {
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.friend-image {
  width: 45px;
  height: 45px;
  margin: 0 9px 0 0;
  border-radius: 10px;
}

.friend-image img {
  border-radius: 10px;
}

.friend-icon {
  cursor: pointer;
  display: flex;
  margin-right: 0.5rem;
  gap: 12px;

  img {
    width: 20px;
    height: 20px;
  }
}

.disable-action {
  cursor: default;
  opacity: 0.8;
}

.friends-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
}
</style>
