<script setup>
import { ref } from 'vue'
import { SystemDropdownIcon } from '@/components/base/icons'
import ImportIcon from "@/components/base/icons/ImportIcon";
import ExportIcon from "@/components/base/icons/ExportIcon";
import ExportCompetitorProductsPopup from "@/components/Product/ExportCompetitorProductsPopup";

const emit = defineEmits(['showIngredientModal'])

const isMenuOpen = ref(false)
const isImportPopupVisible = ref(false);
const isExportPopupVisible = ref(false);

const hideMenu = () => {
  isMenuOpen.value = false
}

const importHandler = () => {
  isImportPopupVisible.value = true;
}

const exportHandler = () => {
  isExportPopupVisible.value = true;
}
</script>

<template>
  <div>
    <div v-click-outside="hideMenu" class="option-show">
      <span class="icon-dropdown" @click.prevent="isMenuOpen = !isMenuOpen">
        <SystemDropdownIcon />
      </span>
      <div v-show="isMenuOpen" class="list-actions">
        <ul>
          <li class="d-flex align-center" @click.prevent="importHandler">
            <ImportIcon class="mr-1 icon" />
            Importa prodotti da file excel
          </li>
          <li class="d-flex align-center" @click.prevent="exportHandler">
            <ExportIcon class="mr-1 icon" />
            Esporta prodotti
          </li>
        </ul>
      </div>
    </div>

    <ExportCompetitorProductsPopup
      :show="isExportPopupVisible"
      @modal-close="isExportPopupVisible = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.option-show {
  position: relative;
  height: 26px;
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
  width: max-content;

  ul {
    list-style-type: none;

    li {
      cursor: pointer;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background-color: var(--background-blue);
      }

      .icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
