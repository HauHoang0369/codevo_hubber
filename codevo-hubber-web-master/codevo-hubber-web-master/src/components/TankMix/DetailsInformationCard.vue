<script setup>
// eslint-disable-next-line no-unused-vars,no-undef
import { computed, onMounted, ref } from 'vue'
import FavouriteIcon from '@/components/base/icons/FavouriteIcon'
import PlusIcon from '@/assets/icons/icon-system-plus@2x.png'
import AuthImage from '@/components/base/AuthImage/AuthImage'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import { useRouter } from 'vue-router'
import Chip from '@/components/base/buttons/Chip'

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
  <div class="detail-info-card">
    <div class="d-flex flex-column">
      <div class="d-flex justify-end w-100 mb-5">
        <FavouriteIcon
          class="favorite-btn"
          :is-favourite="isFavourite"
          @click.prevent="onFavourite"
        ></FavouriteIcon>
      </div>
      <div class="d-flex flex-row align-center">
        <div class="detail-card-grid w-100 ">
          <div class="">
            <div class="text-dark">
              {{$t('TANK_MIX_DETAIL_VIEW_DATE_OF_TRIAL_CAPTION')}}:&nbsp;
              <span class="font-weight-medium text-dark">{{ product.trial_date }}</span>
            </div>
          </div>

          <div>
            <div class="d-flex flex-row">
              <span class="text-dark mr-2 pt-1">{{$t('TANK_MIX_DETAIL_VIEW_CROP_CAPTION')}}:&nbsp;</span>

              <div class="crop-item-list">
                <span class="crop-item" v-for="(item, index) in product.crops" :key="index">
                  {{ item.name }}
                </span>
              </div>

            </div>
          </div>

          <div>
            <div class="d-flex flex-row align-center">
              <span class="text-dark mr-2">{{$t('MAIN_MENU_MARKET_TITLE')}}:</span>

              <span class="text-dark font-weight-medium">
                {{ markets }}
              </span>
            </div>
          </div>

          <div>
            <div class="d-flex flex-row align-center">
              <span class="text-dark mr-2">{{$t('TANK_MIX_CONTRIBUTOR_CREATED_BY_LABEL')}}:</span>
              <div class="mr-2">
                <AuthImage :path="product.created_by.imageUrl"></AuthImage>
              </div>
              <span class="text-dark font-weight-medium">
                {{ product.created_by.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-info-card {
  padding: 19px 20px 24px 19.7px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);
  background-color: var(--white);

  .favorite-btn {
    width: 30px;
    height: 30px;
  }

  .crop-item-list {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .crop-item {
    border-radius: 16px;
    color: $color-text;
    padding: 4px 21px;
    background-color: var(--white);
    box-shadow: 0 6px 25px -6px rgba(0, 0, 0, 0.3);
  }
}

.detail-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px 60px;

  @media (min-width: 800px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 1400px) {
    grid-template-columns: 1fr 2fr;
  }
}

.parent {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 30px;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
}

.div2 {
  grid-area: 1 / 2 / 2 / 3;
}

.div3 {
  grid-area: 2 / 1 / 3 / 2;
}

.div4 {
  grid-area: 2 / 2 / 3 / 3;
}

.competitors_icon {
  height: 16px;
  width: 16px;
}

.type-icon {
  height: 30px;
  width: 30px;
}
</style>
