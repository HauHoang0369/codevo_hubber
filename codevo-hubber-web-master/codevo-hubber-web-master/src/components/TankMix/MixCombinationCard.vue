<script setup>
// eslint-disable-next-line no-unused-vars,no-undef
import AuthImage from '@/components/base/AuthImage/AuthImage'
import FavouriteIcon from '@/components/base/icons/FavouriteIcon'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import { PlusIcon } from '@/components/base/icons';
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: Object,
  type: Object,
})
const router = useRouter()

let isFavourite = ref()

onMounted(async () => {
  isFavourite.value = props.product.isFavourite
})

// const typeName = computed({
//   get() {
//     let typename = ""
//     console.log(props.product)
//     switch (props.product.type) {
//       case 'feasible':
//         typename = "Miscibile con cautela"
//         break
//       case 'not feasible':
//         typename = "Miscibile"
//         break
//       case 'feasibile with caution':
//         typename = "Non miscibile"
//         break
//     }
//     return typename
//   },
// });

const manufacturerProducts = computed({
  get() {
    return props.product.products.join(' + ')
  },
})

const markets = computed({
  get() {
    return props.product.markets.join(', ')
  },
})

const onFavourite = () => {
  isFavourite.value = !isFavourite.value
  // TODO: Call service for favourite toggle
}

const onDetails = () => {
  console.log('onDetails')
  router.push('/tank-mix/' + props.product.id)
}
</script>
<template>
  <div class="mix-combination-card">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-space-between">
        <div class="d-flex flex-row align-center">
          <div
            class="type-icon rounded-circle"
            :style="{ 'background-color': type.colour }"
          ></div>
          <div class="mix-card-type text-clamp-1" :style="{ color: type.colour }">
            {{ $t(type.name) }}
          </div>
        </div>
        <div class="favourite-icon">
          <FavouriteIcon
          :is-favourite="isFavourite"
          @click.prevent="onFavourite"
        />
        </div>
      </div>
      <div class="product-producer text-clamp-1">
        {{ product.producer }}
      </div>
      <div class="mt-1 manufacturer-products text-clamp-1">
        {{ manufacturerProducts }}
      </div>

      <div class="mt-6 d-flex flex-row">
        <div>
          <PlusIcon class="plus-icon" />
        </div>
        <div class="flex-grow-1 ml-4">
          <div
            v-for="(item, index) in product.competitor_products"
            :key="index"
          >
            <div class="product-competitor">
              {{ item.competitor }}
            </div>
            <div class="mt-2 product-name">
              {{ item.name }}
            </div>
            <div class="mt-2">
              <div
                v-for="(ingredient, ingredients_index) in item.ingredients"
                :key="ingredients_index"
                class="product-ingredient"
              >
                {{ ingredient }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-9 d-flex align-center flex-wrap">
        <span class="text-dark mr-1 text-clamp-1">
          {{ $t('TANK_MIX_DETAIL_VIEW_MARKET_CAPTION') }}:
        </span>
        <span class="font-weight-medium text-clamp-1">
          {{ markets }}
        </span>
      </div>

      <div class="mt-5 d-flex flex-row align-center flex-wrap">
        <span class="text-dark mr-1 text-clamp-1">
          {{ $t('TANK_MIX_CONTRIBUTOR_CREATED_BY_LABEL') }}:
        </span>
        <div class="">
          <AuthImage
            :path="product.created_by.imageUrl"
            :filename="product.created_by.name"
            :show-avatar="true"
          ></AuthImage>
        </div>
        <span class="ml-2 font-weight-medium text-clamp-1">{{ product.created_by.name }}</span>
      </div>

      <div class="mt-7 align-self-center text-clamp-1">
        <ButtonPrimaryDesktop @click="onDetails">
          {{ $t('TANK_MIX_DETAIL_CAPTION') }}
        </ButtonPrimaryDesktop>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.mix-combination-card {
  width: 100%;
  padding: 21px 20px 30px 19px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);

  @media (min-width: 520px) {
    width: 360px;
  }
}

.competitors_icon {
  height: 16px;
  width: 16px;
}

.type-icon {
  height: 30px;
  width: 30px;
}
.mix-card-type {
  height: 22px;
  margin: 3px 0 5px 13px;
  font-size: 16px;
  font-weight: bold;
  color: var(--fuel-yellow);
}

.product-producer {
  margin-top: 20px;
  font-size: 16px;
  color: $color-text;
  font-weight: 300;
}

.manufacturer-products {
  font-size: 20px;
  font-weight: bold;
  color: $color-text;
  margin-top: 4px;
}

.product-competitor {
  font-size: 16px;
  font-weight: 300;
  color: $color-text;
}

.product-name {
  font-size: 20px;
  font-weight: bold;
  color: $color-text;
}

.product-ingredient {
  font-size: 18px;
  line-height: 1.22;
  color: $color-text;
}

.markets-label {
  font-size: 16px;
  color: $color-text;
}
.favourite-icon {
   width: 30px;
   height: 30px;
 }

::v-deep {
  .plus-icon {
    width: 16px;
    height: 16px;

    path {
      color: $color-grey-dark;
    }
  }
}
</style>
