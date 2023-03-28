<script setup>
import { computed, ref } from 'vue'
import BaseRadio from '@/components/base/inputs/BaseRadio'
import CloseIcon from '@/assets/icons/icon-system-close2@2x.png'
import { visibilities } from './composables/visibilities'
import { MarketsDropdown, GroupsDropdown, UsersDropdown } from './Dropdowns'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  selectedVisibility: {
    type: Object,
    default: visibilities[0],
  },
  selectedMarkets: Array,
  visibilityOptions: Object,
})

const emit = defineEmits(['visibility-change', 'modal-close'])

const showDialog = computed(() => props.show)
const visibility = ref(props.selectedVisibility)
const visibilityOptions = ref(props.visibilityOptions)
const currentMarkets = ref(props.selectedMarkets ?? [])

const closeModal = () => {
  emit('close')
}

const onSubmit = () => {
  // Update market if visibility is MARKET, otherwise remove all markets
  emit(
    'updateMarket',
    visibility.category === 'MARKET' ? currentMarkets.value : []
  )
  emit('visibility-change', visibility, visibilityOptions)
}

const onMarketChange = (tag, remove = true) => {
  if (remove) {
    const index = visibilityOptions.value.enabledMarkets.indexOf(tag.id)
    if (index > -1) {
      visibilityOptions.value.enabledMarkets.splice(index, 1)
    }
  } else {
    visibilityOptions.value.enabledMarkets.push(tag.id)
  }
}

const onSelectedUsers = (user, remove = true) => {
  if (remove) {
    const index = visibilityOptions.value.enabledUsers.indexOf(user.id)
    if (index > -1) {
      visibilityOptions.value.enabledUsers.splice(index, 1)
    }
  } else {
    visibilityOptions.value.enabledUsers.push(user.id)
  }
}

const onSelectUserGroup = (userGroup, remove = true) => {
  if (remove) {
    const index = visibilityOptions.value.enabledGroups.indexOf(userGroup.id)
    if (index > -1) {
      visibilityOptions.value.enabledGroups.splice(index, 1)
    }
  } else {
    visibilityOptions.value.enabledGroups.push(userGroup.id)
  }
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="534px"
    scrollable
    v-on:click:outside="closeModal"
  >
    <v-card style="border-radius: 30px" class="pa-5">
      <v-card-title class="pa-0">
        <div class="d-flex flex-row justify-space-between align-start">
          <div class="title">A chi vuoi rendere visibile il tuo contenuto?</div>
          <div v-on:click="closeModal">
            <img
              :src="CloseIcon"
              alt="Close dialog"
              class="close-button align-self-end"
            />
          </div>
        </div>
      </v-card-title>
      <v-card-text class="visibility-list">
        <base-radio
          v-for="item in visibilities"
          :key="item.id"
          v-model="visibility"
          :value="item"
        >
          <span class="visibility-item align-center">
            <img :alt="item.title" :src="require(`@/assets${item.icon}`)" />
            <span class="visibility-details">
              <span class="visibility-title">{{ item.title }}</span>
              <span class="visibility-desc">{{ item.desc }}</span>
            </span>
          </span>
        </base-radio>
        <UsersDropdown
          v-if="['SELECTEDUSERS'].includes(visibility.system)"
          :selectedItems="visibilityOptions.enabledUsers"
          class="visibility-options"
          @onSelectUser="onSelectedUsers"
        />
        <GroupsDropdown
          v-if="visibility.system === 'GROUPS'"
          :selectedItems="visibilityOptions.enabledGroups"
          class="visibility-options"
          @onSelectUserGroup="onSelectUserGroup"
        />
        <MarketsDropdown
          v-if="visibility.system === 'MARKETS'"
          :selectedItems="visibilityOptions.enabledMarkets"
          class="visibility-options"
          @onMarketChange="onMarketChange"
        />
      </v-card-text>
      <v-card-actions>
        <button class="modal-confirm" @click="onSubmit">
          <span>{{ $t('PORTAL_CONFIRM_TITLE') }}</span>
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.dialog {
  padding: 20px 20px 50px;
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
}

.close-button {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.title {
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  padding: 30px 0 0 30px;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
  white-space: normal;
}

.visibility-list {
  display: flex;
  flex-direction: column;
  row-gap: 22px;
  padding: 56px 66px 36px !important;

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

  .visibility-options {
    margin-top: 18px;
    padding-top: 40px;
    border-top: solid 1px rgba(165, 165, 165, 0.2);
  }
}

.modal-confirm {
  margin-bottom: 30px;
}
</style>
