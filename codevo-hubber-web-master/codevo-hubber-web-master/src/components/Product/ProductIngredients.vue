<template>
  <div class="ingredients-grid d-flex justify-space-between">
    <div class="ingredients">
      <div class="d-flex align-center justify-space-between">
        <div class="ingredient-title">
          {{ $t('PRODUCT_DETAIL_INGREDIENTI_TITLE') }} *
        </div>
        <div
          class="add-ingredient d-flex align-center font-weight-medium"
          @click="onOpenIngredientModal"
        >
          <plus-icon class="mr-2" path-color="currentColor" />
          {{ $t('PRODUCT_ADD_INGREDIENT_CAPTION') }}
        </div>
      </div>
      <grid
        v-if="productObjectives.length"
        :column-gap="40"
        :row-gap="30"
        class="ingredients-container"
        :col="1"
      >
        <div
          class="ingredient-item position-relative"
          v-for="(objective, idx) in productObjectives"
          :key="idx"
        >
          <div class="ingredient-item-title">
            {{ capitalize(objective.description) }}
          </div>
          <div
            class="ingredient-item-description"
            v-for="ing in objective.ingredients"
            :key="ing.id"
          >
            {{ capitalize(ing.name) }}
          </div>

          <ingredient-actions
            :index="idx"
            class="position-absolute ingredient-actions"
            @remove-objective="onRemoveIngredient"
            @show-objective="onEditIngredient"
          />
        </div>
      </grid>
    </div>

    <div class="ingredients" v-if="systemLanguageProduct">
      <div class="d-flex align-center justify-space-between">
        <div class="ingredient-title">Ingredients *</div>
      </div>
      <grid
        :column-gap="40"
        :row-gap="30"
        :col="1"
        class="ingredients-container"
      >
        <div
          class="ingredient-item position-relative"
          v-for="(objective, idx) in systemLanguageProductObjectives"
          :key="idx"
        >
          <div class="ingredient-item-title">
            {{ capitalize(objective.description) }}
          </div>
          <div
            class="ingredient-item-description"
            v-for="ing in objective.ingredients"
            :key="ing.id"
          >
            {{ capitalize(ing.name) }}
          </div>

          <ingredient-actions
            :index="idx"
            class="position-absolute ingredient-actions"
            @remove-objective="onRemoveIngredient"
            @show-objective="onEditIngredient"
          />
        </div>
      </grid>
    </div>

    <add-ingredient-popup
      v-if="showAddIngredientsModal"
      :show="showAddIngredientsModal"
      :selected-item="selectedObjective"
      :selected-index="selectedObjectiveIndex"
      @modal-close="showAddIngredientsModal = false"
      @modal-submit="onAddIngredients"
    />
  </div>
</template>

<script setup>
import AddIngredientPopup from '@/views/GlobalProducts/AddIngredientPopup.vue'
import Grid from '@/components/base/Grid/Grid'
import IngredientActions from '@/components/Product/IngredientActions.vue'
import PlusIcon from '@/components/base/icons/PlusIcon'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { capitalize } from '@/utils/util'

const store = useStore()

// const user = computed(() => store.getters.getUser)
const currentProduct = computed(() => store.state.products.currentProduct)
const systemLanguageProduct = computed(
  () => store.state.products.systemLanguageProduct
)

const selectedObjective = ref({
  systemLanguageDescription: '',
  contentLanguageDescription: '',
  ingredients: [],
})
const selectedObjectiveIndex = ref(null)
const showAddIngredientsModal = ref(false)
const productObjectives = computed({
  get() {
    return currentProduct.value?.productObjectives || []
  },
  set(value) {
    store.commit('products/updateCurrentProduct', { productObjectives: value })
  },
})
const systemLanguageProductObjectives = computed({
  get() {
    return systemLanguageProduct.value?.productObjectives || []
  },
  set(value) {
    store.commit('products/updateSystemLanguageProduct', {
      productObjectives: value,
    })
  },
})

const onOpenIngredientModal = () => {
  selectedObjective.value = {
    systemLanguageDescription: '',
    contentLanguageDescription: '',
    ingredients: [],
  }
  selectedObjectiveIndex.value += 1
  showAddIngredientsModal.value = true
}

const onRemoveIngredient = (id) => {
  productObjectives.value.splice(id, 1)

  if (systemLanguageProductObjectives.value.length) {
    systemLanguageProductObjectives.value.splice(id, 1)
  }
}

const onAddIngredients = ({
  ingredients: values,
  contentLanguageDescription,
  systemLanguageDescription,
}) => {
  setProductObjectives({
    ingredients: values,
    description: contentLanguageDescription,
    objectives: productObjectives,
  })

  if (systemLanguageProduct.value) {
    setProductObjectives({
      ingredients: values,
      description: systemLanguageDescription,
      objectives: systemLanguageProductObjectives,
    })
  }

  showAddIngredientsModal.value = false
}

const setProductObjectives = ({ ingredients, description, objectives }) => {
  const productObjective = {
    description: description,
    ingredients: [...ingredients],
  }

  if (selectedObjectiveIndex.value < productObjectives.value.length) {
    objectives.value[selectedObjectiveIndex.value] = {
      ...objectives.value[selectedObjectiveIndex.value],
      ...productObjective,
    }
  } else {
    objectives.value = [...objectives.value, productObjective]
  }
}

const onEditIngredient = (id) => {
  const { description: contentLanguageDescription, ingredients } =
    productObjectives.value.find((item, idx) => idx === id)

  let systemLanguageDescription = ''
  if (systemLanguageProductObjectives.value.length) {
    const { description } = systemLanguageProductObjectives.value.find(
      (item, idx) => idx === id
    )

    systemLanguageDescription = description
  }

  selectedObjective.value = {
    systemLanguageDescription,
    contentLanguageDescription,
    ingredients: [...ingredients],
  }
  selectedObjectiveIndex.value = id
  showAddIngredientsModal.value = true
}
</script>

<style lang="scss">
.ingredients {
  flex: 1;

  &-grid & {
    max-width: 459px;
  }

  .ingredient-title {
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: var(--primary);
  }

  .add-ingredient {
    cursor: pointer;
  }

  .ingredients-container {
    margin-top: 30px;

    .ingredient-item {
      padding: 20px 20px 9px;
      border-radius: 10px;
      box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
      background-color: var(--white);
      min-height: 100px;
      max-width: content-box;
      position: relative;

      .ingredient-item-title {
        margin: 0 0 10px;
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--text);
      }

      .ingredient-item-description {
        margin: 10px 0 0;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: var(--text);
      }

      .ingredient-actions {
        right: 10px;
        top: 15px;
      }
    }
  }
}
</style>
