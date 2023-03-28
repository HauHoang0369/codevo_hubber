<script setup>
import { computed } from 'vue';
import DetailsInformationCard from '@/components/TankMix/DetailsInformationCard';
import MixDetailsCard from '@/components/TankMix/MixDetailsCard';
import DocumentList from '@/components/DocumentList/DocumentList';
import IconWarning from '@/assets/icons/svg/icon-detailed-warning.svg';
import { CloneIcon, DownLoadIcon, EditIcon } from '@/components/base/icons';

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

const tankMixData = {
  id: 1,
  type: 0,
  producer: 'Valagro',
  product_name: 'Lorem ipsum SpA',
  mixes: [
    {
      type: 1,
      ph: 'X',
      water: {
        dosage: {
          value: 10,
          unit: 'l',
        },
        ph: 7,
      },
      products: [
        {
          producer: 'Valagro',
          name: 'Nome Prodotto 1',
          isCompetitor: true,
          dosage: {
            value: 10,
            unit: 'l',
          },
          ingredients: [],
          imageUrl: '',
        },
        {
          producer: 'Valagro',
          name: 'Nome Prodotto 2',
          isCompetitor: true,
          dosage: {
            value: 50,
            unit: 'l',
          },
          ingredients: [],
          imageUrl: '',
        },
        {
          producer: 'Valagro',
          name: 'Nome Prodotto 2',
          isCompetitor: false,
          dosage: {
            value: 5,
            unit: 'l',
          },
          ingredients: ['Calcio', 'Nitrogeno', 'Polisaccaridi'],
          imageUrl: '',
        },
      ],
    },
    {
      type: 2,
      ph: 'X',
      water: {
        dosage: {
          value: 10,
          unit: 'l',
        },
        ph: 7,
      },
      products: [
        {
          producer: 'Valagro',
          name: 'Nome Prodotto 1',
          isCompetitor: true,
          dosage: {
            value: 10,
            unit: 'l',
          },
          ingredients: [],
          imageUrl: '',
        },
        {
          producer: 'Valagro',
          name: 'Nome Prodotto 2',
          isCompetitor: true,
          dosage: {
            value: 50,
            unit: 'l',
          },
          ingredients: [],
          imageUrl: '',
        },
        {
          producer: 'Valagro',
          name: 'Nome Prodotto 2',
          isCompetitor: false,
          dosage: {
            value: 5,
            unit: 'l',
          },
          ingredients: ['Calcio', 'Nitrogeno', 'Polisaccaridi'],
          imageUrl: '',
        },
      ],
    },
  ],
  competitor_products: [
    {
      competitor: 'Lorem ipsum SpA',
      name: 'Lorem ipsum',
      ingredients: ['Calcio', 'Nitrogeno', 'Polisaccaridi'],
    },
  ],
  markets: ['ITALIA', 'SPAGNA', 'KENIA', 'USA', 'INDIA'],
  created_by: {
    name: 'Valagro',
    imageUrl: '',
  },
  isFavourite: false,
  trial_date: '07/05/2021',
  crops: [
    {
      id: 0,
      name: 'Coltura',
    },
    {
      id: 1,
      name: 'Coltura',
    },
    {
      id: 2,
      name: 'Coltura',
    },
    {
      id: 3,
      name: 'Coltura',
    },
    {
      id: 4,
      name: 'Coltura',
    }
  ],
  documents: [
    { id: 1, name: 'Documento', description: 'nomedocumento.pdf' },
    { id: 2, name: 'Documento', description: 'nomedocumento.pdf' },
    { id: 3, name: 'Documento', description: 'nomedocumento.pdf' },
  ]
}

const getType = (id) => {
  return types.find((value) => {
    return value.id === id
  })
}

const type = computed({
  get() {
    return getType(tankMixData.type)
  },
})
</script>

<template>
  <div class="tank-mix-detail-page">
    <div class="d-flex align-center mb-2">
      <p class="warning-title text-clamp-1 mr-5">
        {{$t('TANK_MIX_DETAIL_WARNING_TITLE')}}
      </p>

      <img class="warning-image" :src="IconWarning" alt="" />
    </div>
    <p class="text-dark text-md mb-8">
      {{$t('TANK_MIX_DETAIL_WARNING_BANNER')}}
    </p>
    <div class="d-flex flex-column w-100 justify-space-between flex-sm-row align-start align-sm-end mb-8">
      <h1 class="page-title">
        {{$t('TANK_MIX_SEARCH_RESULT_CAPTION')}}
      </h1>

      <div class="d-flex align-center align-self-end align-self-sm-center mt-4 mt-sm-0">
        <EditIcon class="action-icon-btn mr-9" />
        <CloneIcon class="action-icon-btn mr-9" />
        <DownLoadIcon class="action-icon-btn" />
      </div>
    </div>

    <div class="detail-card-container">
      <DetailsInformationCard
        :product="tankMixData"
        :type="type"
      ></DetailsInformationCard>
    </div>

    <div class="mb-8">
      <h1 class="page-title ma-0">
        {{$t('TANK_MIX_MIXING_ORDER_CAPTION')}}
      </h1>
    </div>

    <div class="mix-detail-list">
      <MixDetailsCard
        v-for="(mix, index) in tankMixData.mixes"
        :key="index"
        :mix="mix"
        class="mix-detail-card-container"
      >
      </MixDetailsCard>
    </div>

    <v-divider class="divider"></v-divider>

    <div class="">
      <DocumentList
        :documents="tankMixData.documents"
      ></DocumentList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tank-mix-detail-page {
  .warning-title {
    font-family: Ubuntu, sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: var(--orange);
  }

  .warning-image {
    width: 42px;
    height: 42px;
  }

  .page-title {
    margin: 0;
  }

  .action-icon-btn {
    width: 30px;
    height: 30px;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .detail-card-container {
    margin-bottom: 68px;
  }

  .mix-detail-list {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 100px;
    flex-wrap: wrap;
    gap: 30px;

    @media (min-width: 900px) {
      gap: 30px
    }

    @media (min-width: 1200px) {
      gap: 60px
    }

    @media (min-width: 1400px) {
      gap: 120px
    }

    .mix-detail-card-container {
      min-width: 100%;

      @media (min-width: 900px) {
        min-width: 400px;
      }
    }
  }

  .divider {
    color: rgba(165, 165, 165);
    margin-bottom: 60px;
  }
}
</style>
