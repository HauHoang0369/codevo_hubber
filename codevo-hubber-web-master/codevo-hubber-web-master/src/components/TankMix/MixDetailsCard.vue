<script setup>
import { computed, onMounted } from 'vue'
import WaterIcon from '@/assets/icons/icon-application-water@2x.png'
import AuthImage from '@/components/base/AuthImage/AuthImage'

const props = defineProps({
  mix: Object,
})

const types = [
  {
    id: 0,
    name: 'Miscibile con cautela',
    value: 'feasible',
    colour: '#ffdb72',
  },
  {
    id: 1,
    name: 'Miscibile',
    value: 'not feasible',
    colour: '#00b899',
  },
  {
    id: 2,
    name: 'Non miscibile',
    value: 'feasibile with caution',
    colour: '#ff516e',
  },
]

onMounted(async () => {})

const getType = (id) => {
  return types.find((value) => {
    return value.id === id
  })
}

const type = computed({
  get() {
    return getType(props.mix.type)
  },
})
</script>
<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-space-between mb-5">
      <div class="d-flex flex-row align-center">
        <div
          class="type-icon rounded-circle"
          :style="{ 'background-color': type.colour }"
        ></div>
        <div class="ml-3 text-h6" :style="{ color: type.colour }">
          {{ type.name }}
        </div>
      </div>
    </div>

    <div class="d-flex align-start">
      <div class="number-indicators">
        <div
          v-for="(_, index) in mix.products" :key="index"
          class="number-indicators__item"
        >
          <div
            class="number-indicator"
            :style="{ 'background-color': type.colour }"
          >
            {{ index + 1 }}
          </div>
          <div
            v-if="index !== mix.products.length - 1"
            class="number-line"
            :style="{ 'border-color': type.colour }"
          ></div>
        </div>
      </div>

      <div class="mix-product-list">
        <div
          v-for="(product, index) in mix.products" :key="index"
          class="mix-product-card"
        >
          <div class="d-flex align-center w-100 justify-space-between">
            <div>
              <p class="text-dark font-weight-light">{{product.producer}}</p>
              <p class="text-dark font-weight-bold text-xl mb-5">{{product.name}}</p>

              <div
                v-if="product.isCompetitor === false"
                class="mb-4 d-flex align-start"
              >
                <span class="text-dark mr-3">Ingredienti:</span>
                <div>
                  <p
                    v-for="(
                            ingredient, inredient_index
                          ) in product.ingredients"
                    :key="inredient_index"
                    class="font-weight-medium"
                  >
                    {{ ingredient }}
                  </p>
                </div>
              </div>

              <div>
                <span class="text-dark mr-2">Dosaggio:</span>
                <span class="font-weight-medium">
                  {{product.dosage.value}} {{product.dosage.unit}}
                </span>
              </div>
            </div>

            <div
              style="height: 85px; width: 63px"
              v-if="product.isCompetitor === true"
            >
              <AuthImage :path="product.imageUrl" :width="63" :height="85" ></AuthImage>
            </div>
          </div>
        </div>

        <div class="mix-product-card">
          <div class="d-flex align-start w-100">
            <img :src="WaterIcon" class="water-icon" alt="" />

            <div class="ml-3">
              <p class="font-weight-bold text-lg text-dark mb-4">
                Acqua
              </p>

              <div>
                <span class="text-dark mr-2">Dosaggio:</span>
                <span class="font-weight-medium">
                  {{mix.water.dosage.value}} {{mix.water.dosage.unit}}
                </span>
              </div>

              <div>
                <span class="text-dark mr-2">Ph:</span>
                <span class="font-weight-medium">
                  {{mix.water.ph}}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <span class="text-dark mr-1">
            Ph soluzione:
          </span>
          <span class="text-dark font-weight-medium">
            {{mix.water.ph}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.competitors_icon {
  height: 16px;
  width: 16px;
}

.type-icon {
  height: 30px;
  width: 30px;
}

.water-icon {
  height: 30px;
  width: 30px;
}

.product-number-container {
  height: 30px;
  width: 30px;
  padding-left: 6px;
  z-index: 10;
}

.product-number {
  height: 30px;
  width: 30px;
  color: white;
  text-align: center;
  padding-block: 3px;
  position: absolute;
}

.product-number:after {
  /*border-left: #0a3d31 dashed;*/
  /*border-radius: 40px;*/
  /*border-width: 1px;*/
  /*height: 150px;*/
  /*margin-top: 20px;*/
  /*content: '';*/
}

.number-indicators {
  margin-top: 55px;
  z-index: 2;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .number-indicator {
      width: 30px;
      height: 30px;
      color: white;
      border-radius: 100%;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .number-line {
      height: 125px;
      width: 1px;
      border-left: 1px dashed;
      opacity: 0.5;
    }
  }
}

.mix-product-list {
  flex-grow: 1;
  margin-left: -7px;

  .mix-product-card {
    padding: 23px 18px 23px 32px;
    border-radius: 20px;
    box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);
    background-color: var(--white);
    min-height: 131px;
    margin-bottom: 10px;
  }
}
</style>
