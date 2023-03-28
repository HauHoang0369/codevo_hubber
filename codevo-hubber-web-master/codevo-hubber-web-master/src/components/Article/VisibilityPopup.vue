<template>
  <DynamicPopup v-if="show" @closePopup="closeModal">
    <template #header>
      <span class="modal-title"> Chi può vedere il tuo contenuto? </span>
    </template>

    <template #body>
      <div class="visibility-list">
        <base-radio
          v-for="item in visibilities"
          :key="item.id"
          :value="item"
          v-model="visibility"
        >
          <span class="visibility-item">
            <img :src="item.icon" :alt="item.title" />&nbsp;
            <span class="visibility-details">
              <span class="visibility-title">{{ item.title }}</span>
              <span class="visibility-desc">{{ item.desc }}</span>
            </span>
          </span>
        </base-radio>
      </div>

      <div class="visibility-dropdowns" v-if="visibilityChildrenDropped">
        <base-input
          solo
          label="Cerca un profilo"
          append-inner-icon="mdi-magnify"
          v-model="filterText"
        />

        <div class="extend-container" v-if="visibility.system === 'FRIENDS'">
          <v-checkbox
            v-for="item in filterFriendships"
            false-icon="mdi-checkbox-blank-circle-outline"
            true-icon="mdi-check-circle"
            :key="item.id"
            v-model="friend"
            @change="onFriendSelect"
            :value="item"
          >
            <div class="extend-list">
              <div class="extend-initials">
                <AuthImage
                  v-if="item.imageUrl"
                  :width="40"
                  :height="40"
                  :path="item.imageUrl"
                />
                <span v-else>
                  {{ getInitialsFromName(item.shownName) }}
                </span>
              </div>
              <span class="extend-name">{{ item.shownName }}</span>
            </div>
          </v-checkbox>
        </div>

        <div
          class="extend-container"
          v-else-if="visibility.system === 'MARKETS'"
        >
          <v-checkbox
            v-for="item in filterMarkets"
            false-icon="mdi-checkbox-blank-circle-outline"
            true-icon="mdi-check-circle"
            :key="item.id"
            v-model="market"
            :value="item"
          >
            <div class="extend-list">
              <div class="extend-initials">
                <AuthImage
                  v-if="item.imageUrl"
                  :width="40"
                  :height="40"
                  :path="item.imageUrl"
                />
                <span v-else>
                  {{ getInitialsFromName(item.name) }}
                </span>
              </div>
              <span class="extend-name">{{ item.name }}</span>
            </div>
          </v-checkbox>
        </div>
      </div>
    </template>

    <template #footer>
      <button @click="onSubmit" class="modal-confirm">
        <span>{{ $t('PORTAL_CONFIRM_TITLE') }}</span>
      </button>
    </template>
  </DynamicPopup>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import DynamicPopup from '@/components/Popup/DynamicPopup'
import { useStore } from 'vuex'
import { includesLowStr } from '@/utils/util'
import AuthImage from '@/components/base/AuthImage/AuthImage'
import BaseInput from '@/components/base/inputs/BaseInput'
import BaseRadio from '@/components/base/inputs/BaseRadio'

const props = defineProps({
  visibilities: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['visibility-change', 'friend-select', 'modal-close'])

const store = useStore()

const visibility = ref(props.visibilities[0])
const visibilityChildrenDropped = ref(false)

const friendships = ref([])
const markets = ref([])
const friend = ref(null)
const market = ref(null)
const filterText = ref('')

const filterFriendships = computed(() => {
  if (!filterText.value) {
    return friendships.value
  }

  return friendships.value.filter((visibilityFriendship) =>
    includesLowStr(visibilityFriendship.shownName, filterText.value)
  )
})

const filterMarkets = computed(() => {
  if (!filterText.value) {
    return markets.value
  }

  return markets.value.filter((market) =>
    includesLowStr(market.name, filterText.value)
  )
})

const onFriendSelect = () => {
  emit('friend-select', friend.value)
}

const getFriendships = async () => {
  friendships.value = await store.dispatch('articles/getFriendships')
}

const getMarkets = async () => {
  markets.value = await store.dispatch('articles/getMarkets')
}

watch(visibility, async ({ system }) => {
  filterText.value = ''

  if (system === 'FRIENDS') {
    await getFriendships()
    visibilityChildrenDropped.value = true
  } else if (system === 'MARKETS') {
    await getMarkets()
    visibilityChildrenDropped.value = true
  } else {
    visibilityChildrenDropped.value = false
  }
})

const getInitialsFromName = (name) => {
  name = name.split(' ')
  return `${name[0].charAt(0)}${name[1] ? name[1].charAt(0) : ''}`
}

const closeModal = () => {
  emit('modal-close')
}

const onSubmit = () => {
  emit('visibility-change', visibility.value)
  closeModal()
}
</script>

<style lang="scss">
.visibility-list {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 20px 0 35px;

  .visibility-item {
    display: flex;
    width: 100%;

    .visibility-details {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      margin-left: 9px;
      width: 100%;

      .visibility-title {
        margin-bottom: 1px;
        font-family: Ubuntu, serif;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--text);
      }

      .visibility-desc {
        font-family: Helvetica, serif;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--text);
      }
    }
  }
}

.visibility-confirm {
  display: block;
  width: 183px;
  height: 54.6px;
  margin: 0 auto;
  padding: 10px 51px;
  border-radius: 24px;
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
  background-image: linear-gradient(to top, #0a3d31, #00604b);

  span {
    width: 81px;
    height: 16px;
    font-family: Ubuntu, serif;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: 0.78px;
    text-align: center;
    color: var(--white);
  }
}

.v-selection-control {
  margin-top: 10px;
}

.extend-container {
  height: 200px;
  margin-bottom: 35px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  .friendships-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .v-input--horizontal {
    flex: 0;
  }

  .v-input__details {
    display: none;
  }

  .v-selection-control {
    width: 100%;
    margin: 0;
    height: auto;
  }

  .v-selection-control__wrapper {
    width: 100%;
  }

  .extend-list {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    img {
      border-radius: 10px;
    }
  }

  .extend-initials {
    border-radius: 10px;
    background-color: var(--opal);
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-family: Ubuntu, serif;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--primary);
    }
  }

  .extend-name {
    font-family: Ubuntu, serif;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--text);
  }
}
</style>
