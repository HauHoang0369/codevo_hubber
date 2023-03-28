<script setup>
import DropdownIcon from '@/components/base/icons/DropdownIcon';

const props = defineProps({
  show: {
    type: Boolean,
    default: () => false,
  }
})

const emit = defineEmits(['open', 'close']);

const openDropdown = (e) => {
  e.stopPropagation();
  emit('open');
};

const closeDropdown = (e) => {
  e.stopPropagation();
  emit('close');
};

</script>

<template>
  <div class="dropdown-container">
    <span class="more-btn" @click="openDropdown">
      <DropdownIcon :pathColor="'#a6acb5'" />
    </span>

    <div v-if="show" class="dropdown-menu" v-click-outside="closeDropdown">
      <div class="dropdown-menu-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-container {
  .more-btn {
    color: $color-grey-dark;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .dropdown-menu {
    position: relative;

    .dropdown-menu-list {
      position: absolute;
      right: 0;
      top: 0;
      background: white;
      padding: 10px 19px 8px 10px;
      border-radius: 10px;
      box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
      border: solid 1px rgba(221, 233, 255, 0.27);
      z-index: 2;
    }
  }
}
</style>
