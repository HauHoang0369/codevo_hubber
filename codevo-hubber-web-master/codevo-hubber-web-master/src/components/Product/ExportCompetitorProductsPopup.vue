<template>
  <DynamicPopup v-if="show" @closePopup="closeModal">
    <template #header>
      <span class="modal-title">
        Esporta dati prodotti competitor
      </span>
    </template>

    <template #body>
      <div class="mt-10">
        <MarketDropdown />
      </div>
    </template>

    <template #footer>
      <div class="d-flex flex-column align-center">
        <button class="modal-confirm" @click.prevent="onSubmit">
          <span>Conferma</span>
        </button>

        <div
          v-if="selectedItems.length"
          class="deselect-btn mt-9"
          @click="toggleAllItems(false)"
        >
          Deseleziona
        </div>
        <div v-else class="deselect-btn mt-9" @click="toggleAllItems(true)">
          Seleziona tutto
        </div>
      </div>
    </template>
  </DynamicPopup>
</template>

<script setup>
import DynamicPopup from '@/components/Popup/DynamicPopup'
import CategoryDropdown from '@/components/NewArticle/CategoryDropdown'
import {ref} from "vue";
import MarketDropdown from "@/components/Product/Dropdowns/MarketDropdown";

// eslint-disable-next-line
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

// const show = ref(props.show)
const emit = defineEmits(['modal-close'])

const selectedItems = ref([])

const closeModal = () => {
  emit('modal-close')
}

const onSubmit = async () => {
  //todo
}
</script>

<style lang="scss" scoped>
.modal-confirm {
  margin-top: 32px;
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

:deep(.popup-main) {
  max-width: 534px;
}
</style>
