<script setup>
import FavouriteIcon from '@/components/base/icons/FavouriteIcon.vue'
import AuthImage from '@/components/base/AuthImage/AuthImage'
import { ref, onMounted, computed } from 'vue'
import ProductService from '@/services/Product/ProductService'
import Carousel from '@/components/base/Carousel/Carousel'
import BaseCard from '@/components/base/BaseCard.vue'
import Chip from '@/components/base/buttons/Chip.vue'
import SystemEnabledIcon from '@/components/base/icons/SystemEnabledIcon.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'

const props = defineProps({
  solutionData: Object,
})

const isFavourite = ref(false)

onMounted(async () => {
  isFavourite.value = props.solutionData.isFavourite
})

let favourite = async () => {
  try {
    const data = await new ProductService().service.toggleSolutionFavourite(
      props.solutionData.id
    )
    isFavourite.value = data
  } catch (e) {
    console.error(e)
  }
}

const otherCrops = computed(() => {
  return props.solutionData?.otherCrops.map((item) => ({
    imageUrl: item?.iconImageUrl ?? '',
    description: item?.name ?? '',
  }))
})
</script>

<template>
  <base-card class="solution-card">
    <div class="d-flex">
      <v-col cols="1" class="solution-card-actions">
        <favourite-icon
          class="favourite-icon"
          :is-favourite="isFavourite"
          @click="favourite"
        />

        <v-tooltip :text="$t('SOLUTION_ENABLE_TOOLTIP')">
          <template v-slot:activator="{ props }">
            <system-enabled-icon v-bind="props" :isActive="true" />
          </template>
        </v-tooltip>

        <v-tooltip :text="$t('SOLUTION_ENABLE_EXPERIENCE')">
          <template #activator>
            <base-icon name="experience" />
          </template>
        </v-tooltip>

        <v-tooltip :text="$t('SOLUTION_VISIBILITY_PROTECTED_PRODUCTS')">
          <template #activator>
            <base-icon name="solutionVisibility" />
          </template>
        </v-tooltip>
      </v-col>

      <v-col cols="11">
        <v-row no-gutters>
          <v-col class="d-flex">
            <div class="solution-name">
              {{ solutionData.name }}
            </div>
          </v-col>
          <v-col align-self="end">
            <router-link
              :to="`/solutions/` + solutionData.id"
              class="text-decoration-none"
            >
              <div
                class="solution-detail-button font-weight-bold text-end"
                @click="viewSolution"
              >
                Dettaglio soluzione
              </div>
            </router-link>
          </v-col>
        </v-row>
        <v-row class="mt-6" no-gutters>
          <v-col cols="4" class="pr-5">
            <div v-if="solutionData?.need" class="mb-7">
              <div class="">Bisogni:</div>
              <div class="solution-need">{{ solutionData.need }}</div>
            </div>
            <div v-if="solutionData?.crop">
              <div class="mb-1">Soluzione per:</div>
              <div class="d-flex flex-row align-center">
                <AuthImage
                  v-if="solutionData.crop?.iconImageUrl"
                  :path="solutionData.crop?.iconImageUrl"
                  :height="100"
                  :width="100"
                  class="crop-image"
                ></AuthImage>

                <div class="font-weight-bold pl-4">
                  {{ solutionData.crop?.name }}
                </div>
              </div>
            </div>
          </v-col>

          <v-divider vertical></v-divider>

          <v-col
            v-if="solutionData?.knowledgeLevel"
            cols="3"
            class="solution-knowledge text-center pl-5 pr-5"
          >
            <div class="mb-2">Livello di conoscenze:</div>
            <auth-image
              :path="solutionData.knowledgeLevel?.imageUrl"
              :height="150"
              :width="150"
            />
            <div class="solution-knowledge-name font-weight-bold">
              {{ solutionData.knowledgeLevel?.name }}
            </div>
          </v-col>

          <v-divider vertical></v-divider>
          <v-col cols="5" class="pl-5">
            <div class="mb-4" v-if="otherCrops.length">
              <div>Anche disponibile per:</div>
              <div>
                <Carousel :data="otherCrops"></Carousel>
              </div>
            </div>

            <div v-if="solutionData?.soils">
              <div class="mb-3">Applicazione:</div>
              <div class="d-flex">
                <Chip
                  class="chip rounded-pill"
                  v-for="item in solutionData.soils"
                  :key="item.id"
                >
                  {{ item.name }}
                </Chip>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </base-card>
</template>

<style lang="scss">
.solution-card {
  border-radius: 30px;
  padding: 30px;
  margin-bottom: 20px;
  * {
    color: var(--text);
  }

  .solution-name {
    font-size: 24px;
    font-weight: bold;
  }

  .crop-image {
    width: 61px;
    height: 61px;
  }

  .favourite-icon {
    height: 30px;
    width: 30px;
  }

  .solution-need {
    color: var(--primary);
  }

  .solution-knowledge {
    img {
      height: 120px;
    }

    &-name {
      font-size: 14px;
    }
  }

  .solution-detail-button {
    color: var(--primary);
  }

  .chip {
    color: var(--primary);
    box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
    font-size: 14px;
  }

  .solution-card-actions {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-right: 20px;

    .favourite-icon {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
