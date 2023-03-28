<script setup>
import { ref } from 'vue'
import SystemDropdownIcon from '@/components/base/icons/SystemDropdownIcon.vue'
import EditChannelPopup from '@/components/NewArticle/EditChannelPopup.vue'

const isOpen = ref(false)
const openModifyChannelPopup = ref(false)

const hideActions = () => {
  isOpen.value = false
}
const modifyChannelPopup = (val) => {
  hideActions()
  openModifyChannelPopup.value = val
}
</script>

<template>
  <div>
    <div class="option-show" v-click-outside="hideActions">
      <span @click="isOpen = !isOpen" class="icon-dropdown">
        <SystemDropdownIcon />
      </span>
      <div v-show="isOpen" class="list-actions">
        <ul>
          <li @click="modifyChannelPopup(true)">
            Cambia il canale del post e la categoria
          </li>
        </ul>
      </div>
    </div>
    <EditChannelPopup
      @modal-close="modifyChannelPopup(false)"
      :show="openModifyChannelPopup"
    />
  </div>
</template>

<style lang="scss" scoped>
.option-show {
  position: relative;
}
.icon-dropdown {
  cursor: pointer;
}
.list-actions {
  position: absolute;
  z-index: 2;
  top: 100%;
  right: 0;
  padding: 14px 0;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
  ul {
    list-style-type: none;
    li {
      cursor: pointer;
      padding: 0 17px;
      line-height: 31px;
      font-size: 14px;
      color: var(--text);
      text-align: center;
      &:hover {
        background-color: var(--background-blue);
      }
    }
  }
}
</style>
