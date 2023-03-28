<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { serialize } from 'object-to-formdata';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import CustomSelectBox from '@/components/base/inputs/CustomSelectBox';
import CustomMuliSelect from '@/components/base/inputs/CustomMultiSelect';
import CustomTextField from '@/components/base/inputs/CustomTextField';
import CustomTextArea from '@/components/base/inputs/CustomTextArea';
import AuthImage from '@/components/base/AuthImage/AuthImage'
import SettingsService from '@/services/Settings/SettingsService';
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop';
import ProductService from '@/services/Product/ProductService';

const { t } = useI18n();
const store = useStore();

const user = computed(() => store.getters.getUser);
const router = useRouter();

const emit = defineEmits(['cancel', 'updateProducerName']);
const props = defineProps({
  producer: {
    type: Object,
  },
  mode: {
    type: String,
  }
})

const producerImage = ref(null);
const imagePreview = ref('');
const input = ref(null);
const producerForm = ref({
  name: '',
  markets: []
});
const markets = ref([]);

const dimensions = ref([
  { title: t('PARTY_ORGANIZATION_SIZE_SMALL'), value: 'SMALL' },
  { title: t('PARTY_ORGANIZATION_SIZE_MEDIUM'), value: 'MEDIUM' },
  { title: t('PARTY_ORGANIZATION_SIZE_LARGE'), value: 'LARGE' },
]);
const statusOptions = ref([]);

const FORM_MODE = ref({
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
})

const fetchMarkets = async () => {
  markets.value = await SettingsService().getAvailableMarket();
}

watchEffect(() => {
  emit('updateProducerName', producerForm.value.name);
}, [producerForm.value.name]);

const initProducerForm = () => {
  const { producer } = props;

  if (producer) {
    if (
      producer.approvalStatus === 'PENDING'
      || producer.approvalStatus === 'APPROVED'
      || producer.approvalStatus === 'REJECTED'
    ) {
      statusOptions.value = [
        { title: t('PARTY_APPROVED_STATUS_REJECTED'), value: 'REJECTED' },
        { title: t('PARTY_APPROVED_STATUS_APPROVED'), value: 'APPROVED' },
      ];
    } else if (producer.approvalStatus === 'DRAFT') {
      statusOptions.value = [
        { title: t('PARTY_APPROVED_STATUS_PENDING'), value: 'PENDING' }
      ]
    }

    const organizationSize = dimensions.value.find((item) => item.value === producer.organizationSize);
    const approvalStatus = statusOptions.value.find((item) => item.value === producer.approvalStatus);

    producerForm.value = {
      ...producer,
      organizationSize,
      approvalStatus,
    };
  }
};

const updateProducer = async () => {
  try {
    store.commit('setLoading', true)

    const data = {
      ...producerForm.value,
      approvalStatus: producerForm.value.approvalStatus?.value,
      organizationSize: producerForm.value.organizationSize?.value
    };

    const formData = serialize(data);

    await new ProductService().service.updateProducer({
      marketId: user.value.market.id,
      data: formData,
      hideLoader: true,
    });

    store.commit('setLoading', false);

    emit('cancel');
  } catch (err) {
    store.commit('setLoading', false);
    store.commit('notifications/setSnackBar', {
      show: true,
      content: err.message,
      isError: true,
    });
  }
};

const createProducer = async () => {
  try {
    store.commit('setLoading', true)

    const data = {
      ...producerForm.value,
      approvalStatus: producerForm.value.approvalStatus?.value,
      organizationSize: producerForm.value.organizationSize?.value,
      markets: producerForm.value.markets,
      location: {
        address: producerForm.value.location,
      }
    };

    const formData = serialize(data);

    if (producerImage.value) {
      formData.append('file', producerImage.value);
    }

    await new ProductService().service.createProducer({
      marketId: user.value.market.id,
      data: formData,
      hideLoader: true,
    });
    store.commit('setLoading', false);

    await router.push(`/producers`);
  } catch (err) {
    store.commit('setLoading', false)
    store.commit('notifications/setSnackBar', {
      show: true,
      content: err.message,
      isError: true,
    });
  }
};


const onSave = () => {
  if (props.mode === FORM_MODE.value.CREATE) {
    createProducer();
  } else if (props.mode === FORM_MODE.value.EDIT) {
    updateProducer();
  }
};

const cancel = async () => {
  if (props.mode === FORM_MODE.value.EDIT) {
    emit('cancel');
    initProducerForm();
  } else {
    await router.push(`/producers`);
  }
}

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const handleChangeFile = async (e) => {
  const file = e.target.files[0];
  if (file) {
    producerImage.value = file;
    imagePreview.value = await toBase64(file);
  }
}

const handleClickAvatar = () => {
  if (props.mode === FORM_MODE.value.EDIT || props.mode === FORM_MODE.value.CREATE) {
    input.value.click();
  }
};

onMounted(() => {
  initProducerForm();
  fetchMarkets();
})

</script>

<template>
  <div class="producer-form">
    <div class="d-flex align-center mb-6 detail-header">
      <div class="producer-image-container"  @click="handleClickAvatar">
        <img v-if="!producer?.image?.url && !imagePreview"
             src="/images/common/icon-system-picture.svg"
             alt="">

        <img v-if="!producer?.image?.url && !!imagePreview"
             :src="imagePreview"
             class="producer-img" alt="">

        <img v-if="producer?.image?.url" class="producer-img" :src="producer?.image?.url" alt="" />

        <input type="file" ref="input" class="producer-image-input" @change="handleChangeFile" />
      </div>

      <h1 v-if="mode === 'VIEW'" class="producer-name text-clamp-2">{{producerForm.name}}</h1>

      <input
        v-else
        class="producer-name-input"
        v-model="producerForm.name"
        :placeholder="$t('INSERT_NAME_PLACEHOLDER')"
        :class="{ 'empty': !producerForm.name }"
      />
    </div>

    <div class="producer-details">
      <div>
        <CustomSelectBox
          :selected-item="producerForm.approvalStatus"
          :options="statusOptions"
          :label="$t('PARTY_APPROVAL_STATUS_CAPTION')"
          item-key="value"
          item-title="title"
          @select="(value) => producerForm.approvalStatus = value"
          :disabled="
            mode === FORM_MODE.VIEW ||
            mode === FORM_MODE.CREATE ||
            mode === FORM_MODE.EDIT && (producer.approvalStatus === 'APPROVED' || producer.approvalStatus === 'REJECTED')
          "
        />
      </div>
      <div>
        <CustomTextField
          :label="$t('PARTY_LOCAL_NAME_CAPTION')"
          v-model="producerForm.localName"
          :disabled="mode === FORM_MODE.VIEW"
        />
      </div>
      <div class="description-container">
        <CustomTextArea
          :label="$t('PARTY_DESCRIPTION_CAPTION')"
          v-model="producerForm.description"
          :disabled="mode === FORM_MODE.VIEW"
        />
      </div>
      <div>
        <CustomTextField
          :label="$t('PARTY_VAT_NUMBER_CAPTION')"
          v-model="producerForm.partyIdentifier"
          :disabled="mode === FORM_MODE.VIEW"
        />
      </div>
      <div>
        <CustomSelectBox
          :selected-item="producerForm.organizationSize"
          :options="dimensions"
          :label="$t('PARTY_ORGANIZATION_SIZE_CAPTION')"
          item-key="value"
          item-title="title"
          @select="(value) => producerForm.organizationSize = value"
          :disabled="mode === FORM_MODE.VIEW"
        />
      </div>
      <div>
        <CustomMuliSelect
          :selected-items="producerForm.markets"
          :options="markets"
          :label="$t('PARTY_MARKETS_CAPTION')"
          item-key="id"
          item-title="name"
          prefix-icon="imageUrl"
          :disabled="mode === FORM_MODE.VIEW"
          @select="(value) => producerForm.markets = value"
        />
      </div>
      <div>
        <CustomTextField
          :label="$t('PARTY_ADDRESS_CAPTION')"
          v-model="producerForm.location"
          :disabled="mode === FORM_MODE.VIEW"
        />
      </div>
    </div>

    <div v-if="(producerForm.markets || []).length > 0" class="d-flex align-center mt-5">
      <AuthImage
        v-for="market in producerForm.markets"
        :key="market.id"
        :path="market.imageUrl"
        class="flag-img"
      ></AuthImage>
    </div>

    <div
      v-if="mode === FORM_MODE.EDIT || mode === FORM_MODE.CREATE"
      class="d-flex align-center justify-end mt-8"
    >
      <span class="cancel-btn" @click="cancel">
        {{$t('PORTAL_CANCEL_TITLE')}}
      </span>

      <ButtonPrimaryDesktop
        class="save-btn"
        @click="onSave"
        :disabled="!producerForm.name || producerForm.markets.length === 0"
      >
        {{$t('PORTAL_SAVE_TITLE')}}
      </ButtonPrimaryDesktop>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.producer-details {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 40px;
  grid-row-gap: 20px;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;

    .description-container {
      grid-column: 1 / 2;
      grid-row: 2 / 4;
    }
  }

  ::v-deep(.input-container) {
    margin: 0;
    width: 100%;
  }
}

.flag-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 14px;
  border: 1px solid $color-grey;
}

.save-btn {
  width: 120px;
}

.cancel-btn {
  margin-right: 60px;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.detail-header {
  padding-right: 50px;

  .producer-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 98px;
    height: 98px;
    border-radius: 17px;
    border: solid 1px rgba(0, 105, 255, 0.2);
    overflow: hidden;
    flex-shrink: 0;

    &:hover {
      cursor: pointer;
    }

    .producer-img {
      width: 100%;
      height: 100%;
    }

    .producer-image-input {
      width: 0;
      height: 0;
      z-index: -999;
      opacity: 0;
    }
  }
}

.producer-name {
  font-size: 30px;
  font-weight: bold;
  line-height: 1.33;
  color: $color-text;
  margin-left: 28px;
}

.producer-name-input {
  font-size: 30px;
  font-weight: bold;
  line-height: 1.33;
  margin-left: 28px;
  outline: none;
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--text);
  border: none;
  width: 100%;

  &.empty {
    text-decoration-color: var(--grey-dark);
  }

  &::placeholder {
    color: var(--grey-dark);
  }
}


</style>
