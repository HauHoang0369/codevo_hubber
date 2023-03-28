<template>
  <div class="ingredient-list">
    <div class="popup-input-main">
      <base-input
        v-model="ingredientName"
        label="Seleziona uno o più ingredienti"
        readonly
        @click="onOpenPopup"
      >
        <template #append-inner>
          <base-icon
            class="base-select__icon"
            height="20"
            name="chevronDown"
            width="20"
          />
        </template>
      </base-input>
    </div>

    <div ref="popup" class="popup-body" id="popup" v-if="showPopup">
      <div
        class="ingredient-content"
        v-for="item in ingredients"
        :key="item.id"
        @click="item.selected = !item.selected"
      >
        <div class="ingredient-info">
          <p class="ingredient-info-name">{{ item.name }}</p>
        </div>

        <div v-if="item.selected" class="ingredient-selected">
          <svg
            width="24"
            height="23"
            viewBox="0 0 24 23"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.667 5.31c.606.591.617 1.562.025 2.168l-9.334 9.558a1.533 1.533 0 0 1-2.07.113l-.099-.088-4.254-4.16a1.533 1.533 0 0 1 2.143-2.192l3.157 3.086 8.263-8.46a1.533 1.533 0 0 1 2.169-.026z"
              fill="#FFF"
              fill-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div class="popup-loading" v-if="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </div>
    </div>

    <div
      v-if="!isLoading && showPopup"
      class="ingredient-buttons d-flex flex-column"
    >
      <button class="modal-confirm" @click="onConfirm">
        {{ $t('PORTAL_CONFIRM_TITLE') }}
      </button>
      <button
        class="deselect-button"
        v-if="selectedIngredients.length"
        @click="onDeselectAll"
      >
        {{ $t('TANK_MIX_DESELECT_PRODUCT_CAPTION') }}
      </button>
      <button class="deselect-button" v-else @click="onSelectAll">
        Seleziona tutto
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import ProductService from '@/services/Product/ProductService'
import { chain } from 'lodash'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import BaseInput from '@/components/base/inputs/BaseInput.vue'

const props = defineProps({
  selectedItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['ingredients-selected', 'list-shown'])

// Search ingredients
const ingredientName = ref(null)
const ingredients = ref([])
const isLoading = ref(false)
const showPopup = ref(false)
onMounted(() => getProductIngredients())
const getProductIngredients = async () => {
  isLoading.value = true
  const data = await new ProductService().getProductIngredients(1, true)
  ingredients.value = chain(props.selectedItems)
    .unionBy(data, 'id')
    .sortBy('id')
    .value()
  isLoading.value = false
}

const selectedIngredients = computed(() =>
  ingredients.value.filter((item) => item.selected)
)

const onConfirm = () => {
  emit('ingredients-selected', selectedIngredients.value)
  emit('list-shown', false)
}

const onSelectAll = () => {
  ingredients.value.map((item) => (item.selected = true))
}

const onDeselectAll = () => {
  ingredients.value.map((item) => (item.selected = false))
}

watch(showPopup, (value) => {
  emit('list-shown', value)
})
const onOpenPopup = () => {
  showPopup.value = true
}
</script>

<style scoped>
input {
  width: 100%;
  outline: none;
  border: none;
  padding: 15px 20px;
  border-radius: 17px;
  background-color: var(--background-blue);
}

input::placeholder {
  font-size: 16px;
  font-weight: normal;
  color: var(--grey-dark);
}

.popup-input-main {
  margin-top: 56px;
  position: relative;
}

.popup-input-main svg {
  position: absolute;
  top: 15px;
  right: 15px;
}

.popup-body {
  padding-right: 17px;
  margin-top: 38px;
  height: 317px;
  overflow: auto;
}
::-webkit-scrollbar {
  width: 8px;
}

.popup-body .popup-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 30px;
}

.popup-body::-webkit-scrollbar-thumb {
  background-color: var(--grey);
  border-radius: 100px;
}

.popup-body::-webkit-scrollbar-track {
  background: unset;
  margin-bottom: 5px;
}

.ingredient-content {
  display: flex;
  cursor: pointer;
  position: relative;
  width: 344px;
  padding: 10px 0;
  border-bottom: solid 1px var(--grey);
}

.ingredient-info {
  margin-left: 12px;
}

.ingredient-info-name {
  margin-top: 7px;
  font-size: 16px;
  font-weight: bold;
  color: var(--text);
}

.ingredient-selected {
  position: absolute;
  width: 23px;
  height: 23px;
  background-image: linear-gradient(
    to bottom,
    var(--persian-green),
    var(--primary)
  );
  border-radius: 50%;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.ingredient-selected svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.deselect-button {
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
  margin-top: 36px;
}
</style>
