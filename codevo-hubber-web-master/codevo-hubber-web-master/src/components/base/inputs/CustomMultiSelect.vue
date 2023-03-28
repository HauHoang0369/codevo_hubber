<script setup>
import {computed, ref, watch, watchEffect} from 'vue';
import { ArrowDownIcon } from '@/components/base/icons';
import AuthImage from '@/components/base/AuthImage/AuthImage';
import SearchInput from '@/components/base/inputs/SearchInput';
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop';

const emit = defineEmits(['select']);

const props = defineProps({
  options: {
    type: Array,
    default: () => ([])
  },
  label: {
    type: String,
    default: () => 'Select'
  },
  selectedItems: {
    type: Array,
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
  }
})

const selected = ref([]);
const search = ref('');
const showDropdown = ref(false);

const openMenu = () => {
  search.value = '';
  showDropdown.value = true;
}

const closeMenu = () => {
  search.value = '';
  showDropdown.value = false;
}

const onSelect = (option) => {
  const { itemKey } = props;

  if (selected.value.find((item) => item[itemKey] === option[itemKey])) {
    selected.value = selected.value.filter((item) => item[itemKey] !== option[itemKey]);
  } else {
    selected.value = [...selected.value, option];
  }
}

const isSelected = (option) => {
  const { itemKey } = props;
  return selected.value.some((item) => item[itemKey] === option[itemKey]);
}

const deselect = () => {
  selected.value = [];
};

const confirm = () => {
  emit('select', selected.value);
  closeMenu();
}

const cancel = () => {
  selected.value = props.selectedItems;
  closeMenu();
}

const filteredOptions = computed(() => {
  return props.options.filter((item) => item.name.toLowerCase().includes(search.value.toLowerCase()))
});

const onChange = (value) => {
  search.value = value;
}

watch(showDropdown.value, () => {
  search.value = ''
});

watchEffect(() => {
  selected.value = props.selectedItems;
}, [props.selectedItems]);

</script>

<template>
  <div class="custom-multi-select-container">
    <div class="custom-select-box" :class="{ disabled: disabled }" @click="openMenu">
      <div class="">
        <p class="select-label text-clamp-1">
          {{ label }}
        </p>
      </div>

      <span class="dropdown-icon" :class="{ open: showDropdown }">
        <ArrowDownIcon />
      </span>
    </div>

    <div v-if="showDropdown" class="dropdown-menu-container" v-click-outside="cancel">
      <div class="dropdown-menu-wrapper">
        <div v-if="options.length > 0">
          <div class="pl-4 mb-5">
            <SearchInput
              placeholder="Seleziona mercati"
              v-model="search"
              @updated="onChange"
            />
          </div>

          <div class="menu-list">
            <div
              v-for="item in filteredOptions"
              :key="item[itemKey]"
              class="dropdown-menu-item text-clamp-1"
              @click="onSelect(item)"
            >
              <div class="d-flex align-center">
                <AuthImage
                  v-if="!!prefixIcon"
                  :path="item[prefixIcon]"
                  class="label-prefix-img"
                ></AuthImage>

                <span class="dropdown-menu-item__title">
                {{item[itemTitle]}}
              </span>
              </div>

              <div>
                <div class="check-mark-container" v-if="isSelected(item)">
                  <img src="@/assets/icons/icon-system-check.png"
                       srcset="@/assets/icons/icon-system-check@2x.png 2x,
                     @/assets/icons/icon-system-check@3x.png 3x"
                       class="check-mark" alt="" >
                </div>
              </div>
            </div>
          </div>

          <div class="shadow-box"></div>

          <div class="d-flex flex-column align-center justify-center mt-5">
            <ButtonPrimaryDesktop
              class="confirm-btn mb-5"
              @click="confirm"
            >
              Conferma
            </ButtonPrimaryDesktop>

            <span class="cancel-btn" @click="deselect">
              Deseleziona
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
.custom-multi-select-container {
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

    &:hover {
      cursor: pointer;
    }

    .select-label {
      font-size: 16px;
      color: $color-text;
      transition: all ease-in 0.2s;

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

      ::v-deep(.search-input-container) {
        background-color: var(--background-blue);

        .custom-input {
          background: transparent;
        }
      }

      .menu-list {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 40px;

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
        justify-content: space-between;
        width: 100%;

        &:hover {
          cursor: pointer;
          background-color: var(--background-blue);
        }

        &.selected {
          background-color: var(--background-blue);
        }

        .check-mark-container {
          width: 23px;
          height: 23px;
          background-image: linear-gradient(to bottom, #009982, var(--primary));
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .confirm-btn {
    width: 160px;
  }

  .cancel-btn {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}

.label-prefix-img {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 10px;
}

.shadow-box {
  position: relative;
  top: -40px;
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      var(--white) 82%
  );
}
</style>
