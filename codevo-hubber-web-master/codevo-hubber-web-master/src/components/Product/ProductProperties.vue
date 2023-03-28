<script setup>
import LabelProd from '@/components/base/Label/LabelProd.vue'
import LabelApp from '@/components/base/Label/LabelApp.vue'

defineProps({
  family: Object,
  technology: String,
  certificate: String,
  applications: Array,
})
</script>
<template>
  <div class="properties-container">
    <div class="title">Caratteristiche</div>
    <div class="characteristics-container">
      <div class="characteristics-subitem-title">Famiglia:</div>
      <div class="characteristics-subitem-value">
        <LabelProd :style="{ 'background-color': family?.color }">
          {{ family?.name }}
        </LabelProd>
      </div>
      <div class="characteristics-subitem-title">Tecnologia:</div>
      <div class="characteristics-subitem-value">{{ technology?.name }}</div>
      <div class="characteristics-subitem-title">Certificati:</div>
      <div class="characteristics-subitem-value">{{ certificate }}</div>
      <div class="characteristics-subitem-title">Applicazioni:</div>
      <div class="characteristics-subitem-value labels">
        <LabelApp
          class="application-item"
          v-for="(application, index) in applications"
          :key="index"
        >
          {{ application?.description }}
        </LabelApp>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-container {
  padding: 31px 30px 53px;
  border-radius: 30px;
  background-color: var(--background-blue);
}

.characteristics-container {
  display: grid;
  margin-top: 15px;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 15px;
}

.characteristics-subitem-title {
  font-family: Ubuntu;
  font-size: 20px;
  color: var(--text);
}

.characteristics-subitem-value {
  text-align: end;
  width: fit-content;
  justify-self: end;
  font-size: 20px;
  color: var(--text);
}

.labels {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: end;
}

.title {
  font-family: Ubuntu;
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: var(--primary);
}
</style>
