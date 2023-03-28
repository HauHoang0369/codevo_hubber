<script setup>
import ProductCard from '@/components/ProductCard/ProductCard'
import SolutionTabBar from '@/components/SolutionTabBar/SolutionTabBar'
import CheckIcon from '@/assets/icons/icon-system-check@2x.png'
import { computed, onMounted, reactive, ref } from 'vue'
import ProductService from '@/services/Product/ProductService'

import { useRoute } from 'vue-router'
import DocumentList from '@/components/DocumentList/DocumentList'
import CropListExtended from '@/components/CropList/CropListExtended'

const route = useRoute()

const tabBarItems = ref([
  'Generale',
  'Bisogni e marketing',
  'Soluzioni',
  'Documenti',
  'Correlati',
  'Testimonial',
])

const phenologicalPhases = ref([
  'Trapianto',
  'Sviluppo foliare',
  'Formazione di germogli laterali',
  'Emergenza infiorescenza',
])

let solutionData = ref([])
const id = ref()

onMounted(async () => {
  try {
    console.log(route.params)
    console.log(route.params.id)
    id.value = route.params.id
    solutionData.value = await new ProductService().service.getSolutionData(
      id.value
    )
  } catch (e) {
    console.error(e)
  }
})

const cropList = ref([
  {
    name: 'Zucchine0',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine1',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine2',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine3',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine4',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine5',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine6',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine7',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine8',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine9',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
  {
    name: 'Zucchine10',
    description: 'Benefici per la coltura',
    imageUrl: 'url',
  },
])

const product = {
  applicationList: ['Διαφυλλικά', 'Ρίζα'],
  certificate: 'AGR. BIOLOGICA',
  claim: 'Copper chelated with EDTA',
  description:
    'The presence of copper in chelated form and the soluble micro-granules form-factor, make VALAGRO EDTA Cu the ideal product for the prevention and treatment of copper microdeficiencies.',
  id: 652,
  imageUrl: 'images/VALAGRO EDTA Cu.jpg',
  isFavourite: true,
  name: 'VALAGRO EDTA Cu',
  newProduct: true,
  productFamily: {
    accentColor: '#b4458d',
    code: 'MIC',
    color: '#b4458d',
    id: 56,
    name: 'Ιχνοστοιχεία ',
    order: null,
  },
}
</script>

<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <div class="rounded-xl bg-white" style="height: 392px"></div>
        <v-card
          class="pa-6 rounded-xl border-0 ml-16 mr-16"
          style="top: -82px"
          height="auto"
          elevation="5"
        >
          <div class="d-flex flex-row">
            <ProductCard :product="product"></ProductCard>
            <ProductCard :product="product"></ProductCard>
            <ProductCard :product="product"></ProductCard>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="fluid-row">
      <div class="tab-bar-container">
        <v-row>
          <SolutionTabBar
            :items="tabBarItems"
            class="elevation-5"
          ></SolutionTabBar>
        </v-row>
      </div>
    </div>

    <div class="text-xl-h4 mt-16">Fasi fenologiche</div>
    <v-row class="mt-1" no-gutters>
      <v-col
        v-for="(item, index) in phenologicalPhases"
        :key="index"
        class="mt-5"
        cols="6"
      >
        <div class="d-flex flex-row align-center">
          <div><img :src="CheckIcon" class="check-icon" /></div>
          <div class="ml-2 text-xl-h6 font-weight-regular">{{ item }}</div>
        </div>
      </v-col>
      <v-col> </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-1 pt-12 pb-12" no-gutters>
      <v-col cols="6">
        <div class="text-xl-h4 mt-12">Tipo di campo</div>
        <div></div>
      </v-col>
      <v-col cols="6">
        <div class="text-xl-h4 mt-12">Livello di conoscenze</div>
        <div>Tachometer!!!</div>
      </v-col>
    </v-row>

    <div class="fluid-row">
      <div class="fluid-container bg-white">
        <v-row class="mt-1 pt-12 pb-12 v-container">
          <v-col cols="6">
            <div class="pr-16">
              <div class="text-xl-h4 mt-12">Analisi dei bisogni</div>
              <div class="mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas varius tortor nibh, sit amet tempor nibh finibus et.
                Aenean eu enim justo. Vestibulum aliquam hendrerit molestie.
                Mauris malesuada nisi sit amet augue accumsan tincidunt.
                Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros
                facilisis libero, vitae commodo nunc quam et ligula. Ut nec
                ipsum sapien. Interdum et malesuada fames ac ante ipsum primis
                in faucibus. Integer id nisi nec nulla luctus lacinia non eu
                turpis. Etiam in ex imperdiet justo tincidunt egestas
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="pr-16">
              <div class="text-xl-h4 mt-12">Posizionamento marketing</div>
              <div class="mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas varius tortor nibh, sit amet tempor nibh finibus et.
                Aenean eu enim justo. Vestibulum aliquam hendrerit molestie.
                Mauris malesuada nisi sit amet augue accumsan tincidunt.
                Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros
                facilisis libero, vitae commodo nunc quam et ligula. Ut nec
                ipsum sapien. Interdum et malesuada fames ac ante ipsum primis
                in faucibus. Integer id nisi nec nulla luctus lacinia non eu
                turpis. Etiam in ex imperdiet justo tincidunt egestas
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="mt-1 pt-12 pb-12 v-container--fluid">
      <DocumentList></DocumentList>
    </div>

    <v-divider></v-divider>

    <v-row class="mt-1 pt-12 pb-12 v-container--fluid" no-gutters>
      <v-col cols="12">
        <div class="text-xl-h4 mt-12">Questa soluzione è disponibile per</div>
      </v-col>
      <v-col cols="12">
        <CropListExtended :crops="cropList"></CropListExtended>
      </v-col>

      <v-col cols="12">
        <div class="mt-12">
          <div class="text-xl-h4 text-center">
            Hai bisogno di maggiori informazioni su Nome prodotto?
          </div>
          <div class="text-xl-h5 mt-3 text-center">
            Il nostro Tech&Sales team può aiutarti a trovare la migliore
            soluzione per le tue colture.
          </div>
          <div class="rounded-pill mt-5">{{$t('ASK_TO')}} {{ config.CUSTOMER_NAME }}</div>
        </div>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row class="mt-1 pt-12 pb-12 v-container--fluid" no-gutters>
      <v-col cols="9">
        <div class="text-xl-h4 mt-12">Testimonial</div>
      </v-col>
      <v-col cols="3">
        <div class="text-xl-h4 mt-12">AG Articles</div>
      </v-col>
    </v-row>
  </div>
</template>

<style type="text/css" scoped>
.check-icon {
  width: 30px;
  height: 32px;
}

.fluid-row {
  width: 100vw;
  position: relative;
  left: calc(-50vw + 50%);
}

.fluid-container {
  padding-left: 180px;
  padding-right: 180px;
}

.tab-bar-container {
  padding-left: 180px;
}
</style>
