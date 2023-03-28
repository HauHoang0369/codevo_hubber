<script setup>
import IconCompany from '@/assets/icons/icon-system-hq@2x.png'
import IconEmail from '@/assets/icons/icon-system-email@2x.png'
import IconEdit from '@/assets/icons/icon-system-edit@2x.png'
import IconLanguage from '@/assets/icons/icon-system-public@2x.png'
import IconPhone from '@/assets/icons/icon-system-phone@2x.png'
import IconLocation from '@/assets/icons/icon-system-pin@2x.png'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import { MarketIcon } from '@/components/base/icons'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  data: Object,
})
</script>

<template>
  <div class="profile-card w-100">
    <div class="profile-image">
      <AuthImage :path='data.profileImage' />
    </div>
    <div class="d-flex flex-column justify-center">
      <div class="profile-name">
        {{ data.fullName }}
      </div>
      <div class="profile-title">
        <span>{{ data.jobPosition }}</span>
        <span></span>
      </div>
    </div>
    <div class="info-label">Info</div>
    <div class="info-details">
      <div class="d-flex flex-row align-center" v-if='data.phoneNumber'>
        <div class="icon">
          <img :src="IconPhone" class="icon" />
        </div>
        <div class="flex-grow-1 ml-5 label">{{ data.phoneNumber }}</div>
      </div>
      <div class="d-flex flex-row mt-10 align-center" v-if='data.email'>
        <div class="icon">
          <img :src="IconEmail" class="icon" />
        </div>
        <div class="flex-grow-1 ml-5 label">{{ data.email }}</div>
      </div>
      <div class="d-flex flex-row mt-10 align-center" v-if='data.company'>
        <div class="icon">
          <img :src="IconCompany" class="icon" />
        </div>
        <div class="flex-grow-1 ml-5 label">{{ data.company }}</div>
      </div>
      <div class="d-flex flex-row mt-10 align-center" v-if='data.description'>
        <div class="icon">
          <img :src="IconEdit" class="icon" />
        </div>
        <div class="flex-grow-1 ml-5 label">{{ data.description }}</div>
      </div>
      <div class="d-flex flex-row mt-10 align-center" v-if='data.city && data.country?.name'>
        <div class="icon">
          <img :src="IconLocation" class="icon" />
        </div>
        <div class="flex-grow-1 ml-5 label">
          {{ data.city }} - {{ data.country?.name }}
        </div>
      </div>
      <div class="d-flex flex-row mt-10 align-center" v-if='data.defaultMarket'>
        <MarketIcon class="icon" pathColor='var(--grey-dark)' />
        <div class="d-flex flex-row ml-5 align-center profile-language">
          <AuthImage :path='data.defaultMarket.imageUrl' v-if='data.defaultMarket.imageUrl' class='language-icon' />
          <div>
            {{ data.defaultMarket.name }}
          </div>
        </div>
      </div>
      <div class="d-flex flex-row mt-10 align-start" v-if='data.spokenLanguages?.length'>
        <div class="icon">
          <img :src="IconLanguage" class="icon" />
        </div>
        <div class="flex-grow-1 ml-5">
          <div v-for="(lang, index) in data.spokenLanguages" :key="index" class="d-flex flex-row align-center profile-language">
            <AuthImage :path='lang.imageUrl' v-if='lang.imageUrl' class='language-icon' />
            <div>
              {{ lang.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.profile-card {
  padding: 30px 30px 40px 30px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  display: inline-grid;
  grid-template-columns: 100px auto;
  grid-column-gap: 31px;
  grid-row-gap: 37px;
}

.profile-image {
  width: 74px;
  height: 74px;

  img {
    border-radius: 17px;
  }
}

.profile-name {
  font-size: 30px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.profile-title {
  margin-top: 5px;
}

.profile-language {
  margin-bottom: 24px;

  div {
    color: var(--text);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.label {
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.language-icon {
  height: 25px;
  width: 25px;
  margin-right: 10px;
}
</style>
