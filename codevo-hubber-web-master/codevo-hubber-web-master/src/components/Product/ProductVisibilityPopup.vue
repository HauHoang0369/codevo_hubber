<script setup>
import { reactive, ref } from 'vue'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import UserDropdown from '@/components/Product/Dropdowns/UserDropdown.vue'
import GroupDropdown from '@/components/Product/Dropdowns/GroupDropdown.vue'

const emit = defineEmits(['close'])

const props = defineProps({
  product: Object,
})

const childRef = ref(null)
const dropdownOption = reactive({
  type: '',
  value: [],
})
const productData = ref({ ...props.product })

const onClose = () => {
  emit('close')
}

const onSelectItem = (items) => {
  dropdownOption.value = items
}

const toggleAllItems = (checkAll = true) => {
  childRef.value.onSelect(null, checkAll)
}

const onShowDropdown = (type) => {
  if (dropdownOption.type === type) {
    // Close dropdown
    dropdownOption.type = ''
  } else {
    dropdownOption.type = type
  }

  // Reset selected value after click
  dropdownOption.value = []
}

const confirmData = () => {
  onClose()
}
</script>

<template>
  <div class="hubber-dialog-box">
    <v-card-title>
      <div class="dialog-close" v-on:click="onClose">
        <img :src="IconClose" alt="Close" class="close-icon" />
      </div>
      <div class="title-container d-flex flex-row justify-center">
        <div class="title">
          Configura <br />
          visibilità prodotto
        </div>
      </div>
    </v-card-title>

    <v-card-text>
      <div
        class="d-flex align-center justify-center product-visibility-popup-content"
      >
        <div>
          <v-switch
            v-model="productData.visibleNotPublicMarkets"
            class="custom-switcher"
            dense
            hide-details
            inset
            @change="dropdownOption.type = ''"
          >
            <template #prepend>
              <v-label style="color: var(--text)">Rendi protetto</v-label>
            </template>
          </v-switch>
        </div>
      </div>
      <div class="list-dropdowns">
        <!--User-->
        <div
          v-if="dropdownOption.type !== 'group'"
          :class="{
            'prevent-click disabled': !productData.visibleNotPublicMarkets,
          }"
        >
          <base-input
            label="Rendi visibile a utenti"
            readonly
            @click="onShowDropdown('user')"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="onShowDropdown('user')"
              />
            </template>
          </base-input>
          <UserDropdown
            v-if="dropdownOption.type === 'user'"
            ref="childRef"
            :selected-items="dropdownOption.value ? [dropdownOption.value] : []"
            class="visibility-options position-relative"
            @updateTag="onSelectItem"
          />
        </div>

        <!--Group-->
        <div
          v-if="dropdownOption.type !== 'user'"
          :class="{
            'prevent-click disabled': !productData.visibleNotPublicMarkets,
          }"
        >
          <base-input
            label="Rendi visibile a gruppi"
            readonly
            @click="onShowDropdown('group')"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="
                  dropdownOption.type = dropdownOption.type ? '' : 'group'
                "
              />
            </template>
          </base-input>
          <GroupDropdown
            v-if="dropdownOption.type === 'group'"
            ref="childRef"
            :selected-items="dropdownOption.value ? [dropdownOption.value] : []"
            class="visibility-options position-relative"
            @updateTag="onSelectItem"
          />
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="mb-5 publish d-flex justify-center flex-column">
      <ButtonPrimaryDesktop
        class="hubber-btn hubber-btn-primary"
        @click="confirmData"
      >
        {{ $t('PORTAL_CONFIRM_TITLE') }}
      </ButtonPrimaryDesktop>
      <div v-if="dropdownOption.type">
        <div
          v-if="dropdownOption.value.length"
          class="deselect-btn mt-9"
          @click="toggleAllItems(false)"
        >
          {{ $t('TANK_MIX_DESELECT_PRODUCT_CAPTION') }}
        </div>
        <div v-else class="deselect-btn mt-9" @click="toggleAllItems(true)">
          Seleziona tutto
        </div>
      </div>
    </v-card-actions>
  </div>
</template>

<style lang="scss">
.product-visibility-popup-content {
  .custom-switcher .v-switch__track {
    color: var(--grey-dark);
  }

  .custom-switcher .v-selection-control--dirty .v-switch__track {
    color: var(--primary);
    opacity: initial;
  }
}
</style>

<style lang="scss" scoped>
.disabled {
  opacity: 0.5;
  cursor: default;
}

.prevent-click {
  cursor: default;
  pointer-events: none;
}

.custom-switcher.v-input--density-default {
  --v-input-padding-top: 10px;
}

.hubber-dialog-box {
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

  .v-card-text {
    max-height: 600px;
    overflow: hidden auto;
  }

  .dialog-close {
    position: absolute;
    right: 20px;

    .close-icon {
      width: 30px;
      height: 30px;
      object-fit: contain;
      cursor: pointer;
    }
  }

  .title-container {
    .title {
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-align: center;
      color: var(--primary);
      white-space: normal;
    }
  }

  .dialog-content {
    font-size: 20px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--text);
  }

  .hubber-btn-primary {
    min-width: 183px;
  }

  .deselect-btn {
    cursor: pointer;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: 0.78px;
    color: var(--primary);
  }
}

.list-dropdowns {
  margin: 30px auto 0;
  max-width: 380px;
}

.extend-items {
  position: absolute;
  width: 100%;
  z-index: 1;
  margin-top: -20px;
  padding: 18px 0 20px;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgb(0 0 0 / 10%);
  background-color: var(--white);

  .item {
    height: 41px;
    padding: 12px 16px;

    .item-name {
      color: var(--text);
    }

    &:hover {
      background-color: var(--background-blue);
      cursor: pointer;
    }

    .tick-icon {
      height: 23px;
      width: 23px;
      background-image: linear-gradient(to bottom, #009982, var(--primary));
    }
  }
}
</style>
