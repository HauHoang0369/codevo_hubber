<template>
  <div class="dashboard-header">
    <h1 class="header-title">{{ config.APP_ALIAS }}</h1>
    <h2 class="header-title">{{ $t('HOME_DASHBOARD_SUBTITLE') }}</h2>
    <div>
      <input
        type=""
        name=""
        :placeholder="$t('GENERIC_SEARCH_BOX_BUTTON_DESCRIPTION')"
        class="custom-input"
      />
    </div>
  </div>
</template>

<script>
// Components
// import FilterIcon from '@/base/icons/FilterIcon.vue'
// import SettingsIcon from '@/base/icons/SettingsIcon.vue'

export default {
  components: {
    // FilterIcon
    // SettingsIcon
  },
  data: () => ({}),
}
</script>

<style type="text/css">
.dashboard-header {
  background-color: var(--primary);
  text-align: center;
  padding: 100px 0;
}

.header-title {
  color: var(--white);
  font-size: 50px;
}

.custom-input {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 26px;
  padding: 16px 21px 16.7px 20px;
  font-size: 18px;
  color: var(--faded-white);
}
</style>
