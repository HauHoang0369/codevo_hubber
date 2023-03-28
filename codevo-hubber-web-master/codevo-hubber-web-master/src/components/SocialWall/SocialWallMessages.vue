<script setup>
import CustomSearch from '@/components/base/inputs/CustomSearch'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'

const props = defineProps({
  data: Object,
})
</script>
<template>
  <div>
    <v-card
      class="messages-card d-flex flex-column justify-space-between w-100"
    >
      <div class="flex-grow-1">
        <div class="text-h6 font-weight-bold">Messagi</div>
        <div>
          <CustomSearch placeholder="Cerca tra i messaggi" bg-color="#f7f9fd">
          </CustomSearch>
        </div>
        <div class="messages-list mt-5">
          <div
            class="friend-item d-flex flex-row justify-space-between mb-4 align-center"
            v-for="(item, index) in data"
            :key="index"
          >
            <div class="d-flex flex-row flex-grow-1 align-center">
              <div class="sender-image">
                <img :src="item.imageUrl" />
              </div>
              <div class="d-flex flex-column">
                <div class="sender-name">
                  {{ item.name }}
                </div>
                <div class="message mt-1">
                  {{ item.message }}
                </div>
              </div>
            </div>
            <div class="time">
              {{ item.time }}
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex flex-row justify-center w-100">
        <ButtonPrimaryDesktop> Scrivi nuovo </ButtonPrimaryDesktop>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.messages-card {
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  min-height: 572px;
}

.friend-item {
}

.sender-name {
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.sender-image {
  width: 45px;
  height: 45px;
  margin: 0 9px 0 0;
  padding: 11px 8px;
  opacity: 0.2;
  border-radius: 10px;
  background-color: var(--primary);
}

.message {
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.time {
  font-family: Ubuntu;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: var(--text);
}
</style>
