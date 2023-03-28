<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router/dist/vue-router';
import ProductService from '@/services/Product/ProductService';
import FooterDesktop from '@/components/base/FooterDesktop/FooterDesktop';
import MoreDropdown from '@/components/base/MoreDropdown/MoreDropdown';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import { DeleteIcon, EditIcon } from '@/components/base/icons';
import ProducerDeleteConfirm from '@/views/Producers/ProducerDeleteConfirm';
import { ProducerForm } from '@/components/Producers';

const router = useRouter();
const route = useRoute();
const store = useStore();
const { t } = useI18n()

const user = computed(() => store.getters.getUser);

const producer = ref(null);
const producerName = ref('');
const showDropdown = ref(false);
const showDeleteConfirm = ref(false);
const mode = ref('VIEW');

const links = computed(() => {
  return [
    { name: 'PARTY_VIEW_COMPETITORS_TITLE', path: 'producers' },
    { name: 'PARTY_VIEW_COMPETITORS_TITLE' },
  ];
});

const openDropdown = () => {
  showDropdown.value = true;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const removeProducer = () => {
  showDeleteConfirm.value = true;
  closeDropdown();
}

const fetchProducer = async () => {
  const producerId = route.params.id;

  try {
    store.commit('setLoading', true)

    const res = await new ProductService().service.getProducer({
      producerId,
      contentLanguage: user.value.contentLanguage.isoCode,
      marketId: user.value.market.id,
      hideLoader: true,
    });

    producer.value = res;
    producerName.value = res.name;
    store.commit('setLoading', false);
  } catch (e) {
    store.commit('setLoading', false)
  }
}

const onConfirmRemoveProducer = async () => {
  store.commit('setLoading', true);

  try {
    await new ProductService().service.deleteProducer({
      producerId: producer.value.id,
      hideLoader: true,
    });
    showDeleteConfirm.value = false;

    store.commit('notifications/setSnackBar', {
      show: true,
      content: t('DELETED_SUCCESSFULLY_CAPTION'),
      isError: false,
    })

    store.commit('setLoading', false);
    await router.push(`/producers`);
  } catch (err) {
    store.commit('setLoading', false);

    store.commit('notifications/setSnackBar', {
      show: true,
      content: err.message,
      isError: true,
    });
  }
};

const setEditMode = () => {
  mode.value = 'EDIT';
  closeDropdown();
};

onMounted(async () => {
  await fetchProducer();
});

</script>

<template>
  <div class="producer-detail-page">
    <div v-if="producer">
      <BreadCrumb
        :links="links"
        :title="producer.name"
      />

      <h1 class="page-title text-clamp-2">{{producerName}}</h1>

      <div class="producer-card">
        <div class="dropdown-container" v-if="mode === 'VIEW'">
          <MoreDropdown
            :show="showDropdown"
            @open="openDropdown"
            @close="closeDropdown"
          >
            <div class="menu-item d-flex align-center" @click="setEditMode()">
              <EditIcon />

              <span class="menu-title">Modifica</span>
            </div>

            <div class="menu-item d-flex align-center" @click="removeProducer">
              <DeleteIcon  />

              <span class="menu-title">Elimina</span>
            </div>

          </MoreDropdown>
        </div>

        <ProducerForm
          :producer="producer"
          :mode="mode"
          @cancel="mode = 'VIEW'"
          @updateProducerName="(value) => producerName = value"
        />
      </div>
      <div class="page-footer">
        <FooterDesktop></FooterDesktop>
      </div>
    </div>

    <v-dialog
      v-model="showDeleteConfirm"
      max-width="534"
      v-on:click:outside="showDeleteConfirm = false"
    >
      <v-card style="border-radius: 30px">
        <ProducerDeleteConfirm @close="showDeleteConfirm = false" @confirm="onConfirmRemoveProducer" />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 40px;
  font-weight: normal;
  line-height: 1.25;
  margin: 30px 0;
}

.producer-card {
  padding: 28px 30px 64px;
  border-radius: 30px;
  background: white;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  position: relative;

  .dropdown-container {
    position: absolute;
    right: 11px;
    top: 31px;
  }
}

.card-header {
  margin-bottom: 27px;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
}

.page-footer {
  margin-top: 166px;
}

::v-deep(.input-container) {
  margin: 0;
  width: 100%;
}

.menu-item {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid $color-background-blue;

  &:last-of-type {
    margin-bottom: 0;
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .menu-title {
    white-space: nowrap;
    margin-left: 5px;
    font-size: 16px;
    font-weight: 500;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.circle {
  width: 13px;
  height: 13px;
  border-radius: 100%;
  background: $color-ambra;
}

.producer-detail-page {
  ::v-deep(.breadcrumb-primary-label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: calc(100vw - 290px);
  }
}
</style>
