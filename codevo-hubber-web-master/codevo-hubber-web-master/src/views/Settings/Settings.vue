<script>
export default {
  name: 'SettingsPage',
}
</script>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { I18nUtil } from '@/I18nUtil';
import { AuthService } from '@/services/AuthService'
import SettingsService  from '@/services/Settings/SettingsService';

import CustomSelectBox from '@/components/base/inputs/CustomSelectBox';
import store from '@/store';

import { i18n } from '@/main';

const user = computed(() => store.getters.getUser);

const languages = ref([]);
const contentLanguages = ref([]);
const markets = ref([]);
const market = ref(null);
const systemLanguage = ref(null);
const contentLanguage = ref(null);

const refreshUser = async () => {
  const data = await AuthService.refreshUser({
    username: user.value.username,
    refreshToken:user.value.refresh_token,
  });

  if (data) {
    store.commit('loginUser', data);
  }
};

const fetchInfo = async () => {
  try {
    markets.value = await SettingsService().getAvailableMarket()
    market.value = markets.value.find( e => e.id === user.value.market.id)
    languages.value = await SettingsService().getAvailableLanguage()
    systemLanguage.value = languages.value.find(e => e.id === user.value.systemLanguage.id)

    if (market.value) {
      contentLanguages.value = market.value.languages || [];
      contentLanguage.value = contentLanguages.value.find(e => e.id === user.value.contentLanguage.id)
    }
  } catch (e) {
  }
};

const selectMarket = async (newValue) => {
  market.value = newValue;

  store.commit('setLoading', true);

  try {
    await SettingsService().updateMarket(newValue);

    contentLanguages.value = newValue.languages || [];
    contentLanguage.value = newValue.languages[0];

    await SettingsService().updateContentLanguage(contentLanguage.value);
    await refreshUser();
    await fetchInfo();

    store.commit('setLoading', false);
  } catch (err) {
    store.commit('setLoading', false);
  }
}

const selectSystemLanguage = async (newValue) => {
  systemLanguage.value = newValue;
  store.commit('setLoading', true);
  try {
    await SettingsService().updateSystemLanguage(newValue);
    await refreshUser();
    I18nUtil.setI18nLanguage(i18n.global, newValue.isoCode);
    store.commit('setLoading', false);
  } catch (e) {
    store.commit('setLoading', false);
  }
};

const selectContentLanguage = async (newValue) => {
  contentLanguage.value = newValue;

  try {
    store.commit('setLoading', true);

    await SettingsService().updateContentLanguage(newValue);
    await refreshUser();
    await fetchInfo();
    store.commit('setLoading', false);
  } catch (err) {
    store.commit('setLoading', false);
  }

};

onMounted(async () => {
  store.commit('setLoading', true);
  await fetchInfo();
  store.commit('setLoading', false);
});
</script>

<template>
  <div class="settings-page">
    <h1 class="page-title text-clamp-2">
      {{$t('MAIN_MENU_SETTINGS_TITLE')}}
    </h1>

    <div class="mb-30">
      <CustomSelectBox
        :selected-item="market"
        :options="markets"
        :label="$t('MAIN_MENU_MARKET_TITLE')"
        item-key="id"
        item-title="name"
        prefix-icon="imageUrl"
        @select="(value) => selectMarket(value)"
      />
    </div>

    <div class="mb-30">
      <CustomSelectBox
        :selected-item="systemLanguage"
        :options="languages"
        :label="$t('MAIN_MENU_LANGUAGE_TITLE')"
        item-key="id"
        item-title="name"
        @select="(value) => selectSystemLanguage(value)"
      />
    </div>

    <div class="content-select">
      <CustomSelectBox
        :selected-item="contentLanguage"
        :options="contentLanguages"
        :label="$t('MAIN_MENU_CONTENTS_LANGUAGE_TITLE')"
        item-key="id"
        item-title="name"
        @select="(value) => selectContentLanguage(value)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  &::v-deep(.input-container) {
    width: 100%;
  }
}
</style>
