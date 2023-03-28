<script setup>
import IconDocument from "@/assets/icons/icon-detailed-doc@2x.png"
import IconSelectedDocument from "@/assets/icons/components-alert-select@2x.png"
import {onMounted, ref, nextTick} from "vue";
import MoreDropdown from '@/components/base/MoreDropdown/MoreDropdown';

const props = defineProps({
  item: Object,
  isSelected: Boolean
})

const showDropdown = ref(false)

const openDropdown = () => {
  showDropdown.value = true
}

const closeDropdown = () => {
  showDropdown.value = false
}

const selectMenuItem = (e) => {
  e.stopPropagation();
  closeDropdown();
}

const contextMenuItems = ref([
  { label: "Voce 1" },
  { label: "Voce 2" },
  { label: "Voce 3" },
])

const showContextMenu = ref(false)
const onContextMenu = (id) => {
  console.log("Context Menu: " + id)
}


</script>

<template>
  <div class="document-card d-flex flex-row justify-space-between align-center">
    <div>
      <div class="position-relative" style="height: 76px; width: 76px">
        <img :src="IconDocument" style="height: 76px; width: 76px" class="position-absolute"/>
        <div v-if="isSelected" class="position-absolute">
          <img :src="IconSelectedDocument" style="height: 24px ; width: 24px;">
        </div>
      </div>
    </div>
    <div class="d-flex flex-column flex-fill document-information">
      <div class="document-title">{{ item.description }}</div>
      <div class="document-name">{{ item.name }}</div>
    </div>

    <MoreDropdown
      :show="showDropdown"
      @open="openDropdown"
      @close="closeDropdown"
      class="document-dropdown"
    >
      <div
        v-for="(item, index) in contextMenuItems"
        :key="index"
        class="menu-item d-flex align-center" @click="selectMenuItem">
        <span class="menu-title">{{item.label}}</span>
      </div>
    </MoreDropdown>

    <!-- <div class="align-self-start">
      <v-menu
        v-model="showContextMenu"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <img :src="IconDocument"
               id="menu-activator"
               v-bind="props"
               style="height: 30px; width: 20px;"
          />
        </template>

        <div class="context-menu">
          <v-list dense>
            <v-list-item link v-on:click="onContextMenu(index)"
            v-for="(menuItem,index) in contextMenuItems" :key="index"
            >
              <v-list-item-title>Voce 1</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

      </v-menu>
    </div> -->
  </div>
</template>


<style lang="scss" scoped>
.document-card {
  padding: 12px 12px 11px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  cursor: pointer;

  &::v-deep {
    .document-dropdown {
      align-self: flex-start;
      margin-top: 5px;

      .dropdown-menu .dropdown-menu-list {
        border-radius: 16px;
        box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
        cursor: pointer;
        background: white;
        padding: 0;
        overflow: hidden;
      }
    }
  }
}
.document-information {
  overflow: hidden;
  margin-left: 17px;
}

.document-title {
  font-family: Ubuntu;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-name {
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  margin-top: 10px;
}

.context-menu {
  border-radius: 10px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  cursor: pointer;
}


.menu-item {
  padding: 8px 16px;

  &:last-of-type {
    margin-bottom: 0;
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
    background: $color-background-blue;
  }

  .menu-title {
    white-space: nowrap;
    font-size: 16px;
    font-weight: 500;
    color: $color-text;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

</style>
