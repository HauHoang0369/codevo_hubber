<template>
  <DynamicPopup v-if="show" @closePopup="closeModal">
    <template #header>
      <span class="modal-title"> Aggiungi un ingrediente </span>
    </template>

    <template #body>
      <ingredient-list
        v-if="!selectedIngredients.length"
        :selected-items="selectedIngredients"
        @list-shown="onListShown"
        @ingredients-selected="onIngredientsSelected"
      />

      <div v-if="!isListExpanded">
        <div class="ingredient-chip-list" v-if="selectedIngredients.length">
          <v-chip
            v-for="item in selectedIngredients"
            :key="item.id"
            close-icon="tag-close"
            class="ingredient-chip"
            closable
            size="small"
            @click="removeIngredient(item.id)"
          >
            {{ item.name }}
          </v-chip>
        </div>

        <custom-text-area
          v-if="user.contentLanguage.isoCode !== 'en'"
          class="mb-4"
          label="Aumenta la produttività"
          v-model="contentLanguageText"
          :is-required="false"
        />

        <custom-text-area
          label="Aggiungi contenuto"
          v-model="systemLanguageText"
          :is-required="false"
        />
      </div>
    </template>

    <template #footer>
      <button
        @click="onSubmit"
        class="modal-confirm hubber-btn"
        :class="{ disabled: !selectedIngredients.length }"
        :disabled="!selectedIngredients.length"
      >
        Salva
      </button>
    </template>
  </DynamicPopup>
</template>

<script setup>
import DynamicPopup from '@/components/Popup/DynamicPopup.vue'
import IngredientList from '@/views/GlobalProducts/IngredientList.vue'
import { computed, ref } from 'vue'
import CustomTextArea from '@/components/base/inputs/CustomTextArea.vue'
import { cloneDeep } from 'lodash'
import { useStore } from 'vuex'

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  selectedItem: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const store = useStore()
const user = computed(() => store.getters.getUser)

const emit = defineEmits(['modal-close', 'modal-submit'])
const selectedObjective = ref(cloneDeep(props.selectedItem))

const selectedIngredients = computed(() => {
  return selectedObjective.value?.ingredients ?? []
})

const onIngredientsSelected = (items) => {
  selectedObjective.value.ingredients = items
}

const removeIngredient = (id) => {
  selectedObjective.value.ingredients =
    selectedObjective.value.ingredients.filter((item) => item.id !== id)
}

const contentLanguageText = ref(props.selectedItem?.contentLanguageDescription)
const systemLanguageText = ref(props.selectedItem?.systemLanguageDescription)

const closeModal = () => {
  emit('modal-close')
}

const onSubmit = () => {
  const data = {
    ingredients: selectedObjective.value.ingredients,
    contentLanguageDescription: contentLanguageText.value,
    systemLanguageDescription: systemLanguageText.value,
  }

  emit('modal-submit', data)
}

const isListExpanded = ref(false)
const onListShown = (value) => {
  isListExpanded.value = value
}
</script>

<style lang="scss" scoped>
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

.popup-input-main svg {
  position: absolute;
  top: 15px;
  right: 15px;
}

::-webkit-scrollbar {
  width: 8px;
}

.ingredient-chip-list {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 22px;

  .ingredient-chip {
    font-size: 16px;
    color: $color-white;
    background-color: rgba($color-primary, 0.7);
    padding: 8px 14px 8px 8px;

    &.v-chip.v-chip--density-default {
      height: auto;
    }
  }
}
</style>
