<template>
  <div class="d-flex crop-card" @click="onCropSelected">
    <div class="d-flex align-center">
      <div class="crop-card__image">
        <AuthImage
          :path="crop.backgroundImageUrl"
          :height="169"
          :width="128"
          class="product-image flex-shrink-0"
        />
      </div>
      <div class="py-5 d-flex flex-grow-1">
        <div class="ml-5 Titolo-card-M align-self-center pr-3">
          {{ crop.name }}
        </div>
      </div>
    </div>

    <div class="ml-auto crop-card__actions">
      <FavouriteIcon
        @click.stop="favouriteHandler"
        :is-favourite="isFavorite"
      />
    </div>
  </div>
</template>

<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import FavouriteIcon from '@/components/base/icons/FavouriteIcon'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const props = defineProps({
  crop: {
    type: Object,
    required: true,
  },
  isFavorite: { type: Boolean, default: false },
})

const favouriteHandler = () => {}

const onCropSelected = () => {
  store.commit('global_solutions/setChosenCrop', props.crop)
  router.push({
    name: 'Soluzioni Globali',
  })
}
</script>

<style lang="scss" scoped>
.crop-card {
  padding: 0 16px 0 0;
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  background-color: var(--white);
  cursor: pointer;
}
.crop-card__image {
  width: 80px;
  height: 80px;
  aspect-ratio: 1;
  overflow: hidden;

  img {
    object-fit: fill;
    width: 100%;
    height: 100%;
    border-radius: 20px 50% 50% 20px;
    box-shadow: 0 7px 7px 0 rgba(0, 0, 0, 0.2);
  }
}
.crop-card__actions {
  margin-top: 12px;
  svg {
    width: 30px;
    height: 30px;
  }
}
</style>
