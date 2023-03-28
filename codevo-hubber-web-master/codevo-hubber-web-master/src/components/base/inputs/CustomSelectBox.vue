<script setup>
import { ref } from 'vue';
import {ArrowDownIcon} from '@/components/base/icons';
const emit = defineEmits(['select'])
import AuthImage from '@/components/base/AuthImage/AuthImage'

defineProps({
  options: {
    type: Array,
    default: () => ([])
  },
  label: {
    type: String,
    default: () => 'Select'
  },
  selectedItem: {
    required: false,
  },
  itemKey: {
    required: true,
    type: String,
  },
  itemTitle: {
    required: false,
    type: String,
  },
  prefixIcon: {
    required: false,
    type: String,
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
  readonly: {
    type: Boolean,
    default: () => false,
  },
})

const showDropdown = ref(false);

const openMenu = () => {
  showDropdown.value = true;
}

const closeMenu = () => {
  showDropdown.value = false;
}

const onSelect = (item) => {
  emit('select', item);
  closeMenu();
}

</script>

<template>
  <div class="custom-select-container">
    <div
      class="custom-select-box"
      :class="{ disabled: disabled, readonly: readonly }"
      @click="openMenu"
    >
      <div class="">
        <p class="select-label text-clamp-1" :class="{ 'option-selected': !!selectedItem }">
          {{ label }}
        </p>
        <div v-if="selectedItem" class="selected-option text-clamp-1">
          <AuthImage
            v-if="!!prefixIcon"
            :path="selectedItem[prefixIcon]"
            class="label-prefix-img"
          ></AuthImage>
          <span class="selected-option__title text-clamp-1">{{ selectedItem[itemTitle] }}</span>
        </div>
      </div>

      <span class="dropdown-icon" :class="{ open: showDropdown }">
        <ArrowDownIcon />
      </span>
    </div>

    <div v-if="showDropdown" class="dropdown-menu-container" v-click-outside="closeMenu">
      <div class="dropdown-menu-wrapper">
        <div v-if="options.length > 0" class="menu-list">
          <div
            v-for="item in options"
            :key="item[itemKey]"
            class="dropdown-menu-item text-clamp-1" :class="{ selected: selectedItem && item[itemKey] === selectedItem[itemKey] }"
            @click="onSelect(item)"
          >
            <AuthImage
              v-if="!!prefixIcon"
              :path="item[prefixIcon]"
              class="label-prefix-img"
            ></AuthImage>

            <span class="dropdown-menu-item__title">
              {{item[itemTitle]}}
            </span>
          </div>
        </div>

        <div v-if="options.length === 0" class="text-center py-2">
          No Data
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-select-container {
  .custom-select-box {
    padding: 0 20px;
    opacity: 0.7;
    border-radius: 17px;
    border: solid 1px var(--celeste);
    background-color: var(--white);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 55px;

    &.disabled {
      pointer-events: none;

      .select-label {
        color: $color-grey-light-1 !important;
      }

      .selected-option__title {
        color: $color-grey-dark;
      }
    }

    &.readonly {
      pointer-events: none;
    }

    &:hover {
      cursor: pointer;
    }

    .select-label {
      font-size: 16px;
      color: $color-text;
      transition: all ease-in 0.2s;
      text-transform: capitalize;

      &.option-selected {
        font-size: 12px;
        font-weight: 300;
        color: $color-text;
      }
    }

    .selected-option {
      display: flex;
      align-items: center;

      &__title {
        font-size: 16px;
        color: $color-text;
      }
    }

    .dropdown-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all ease-in 0.2s;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  .dropdown-menu-container {
    position: relative;
    width: 100%;

    .dropdown-menu-wrapper {
      position: absolute;
      width: 100%;
      padding: 28px 16px 24px 0;
      border-radius: 20px;
      box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
      background-color: var(--white);
      z-index: 99;

      .menu-list {
        max-height: 250px;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 7.5px;
          background-color: var(--grey);
        }
      }

      .dropdown-menu-item {
        padding: 10px 10px 11px 26px;
        border-radius: 9px;
        font-size: 18px;
        color: $color-text;
        display: flex;
        align-items: center;
        width: 100%;

        &:hover {
          cursor: pointer;
          background-color: var(--background-blue);
        }

        &.selected {
          background-color: var(--background-blue);
        }

        &__title {
          color: $color-text;
        }
      }
    }
  }
}

.label-prefix-img {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>
