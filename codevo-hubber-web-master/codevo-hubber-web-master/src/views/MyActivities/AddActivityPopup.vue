<template>
  <DynamicPopup v-if="show" @closePopup="closeModal" class="add-activity-popup">
    <template #header>
      <p class="text-md text-text">
        {{ $t('CREATION_POPUP_PICK_TEMPLATE_TITLE_CAPTION') }}
      </p>
    </template>
    <template #body>
      <div class="popup-template-container">
        <div v-for="activity in activities" class="popup-template">
          <div class="activity-icon">
            <img v-if="activity.type === 'MEETING'" :src="MeetingIcon" />
            <img v-else-if="activity.type === 'VISIT'" :src="VisitingIcon" />
            <img v-else-if="activity.type === 'WORK'" :src="WorkIcon" />
            <img v-else-if="activity.type === 'TRAINING'" :src="TrainingIcon" />
            <img v-else-if="activity.type === 'CLIENT'" :src="ClientIcon" />
          </div>

          <div class="template-name">
            <p class="text-text text-lg bold">{{ activity.name }}</p>
          </div>
        </div>
      </div>
    </template>
  </DynamicPopup>
</template>
<script setup>
import DynamicPopup from '@/components/Popup/DynamicPopup.vue'
import MeetingIcon from '@/assets/icons/MeetingIcon.svg'
import VisitingIcon from '@/assets/icons/VisitingIcon.svg'
import WorkIcon from '@/assets/icons/WorkIcon.svg'
import TrainingIcon from '@/assets/icons/TrainingIcon.svg'
import ClientIcon from '@/assets/icons/ClientIcon.svg'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  activities: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['modal-close'])

const closeModal = () => emit('modal-close')
</script>
<style>
.add-activity-popup .popup-main {
  padding: 72px 30px 30px 30px;
  max-width: 433px;
}

.modal-header {
  margin-bottom: 0;
  text-align: start;
}

.modal-body {
  margin-top: 21px;
}

.activity-icon img {
  width: 55px;
  height: 55px;
  margin-top: 10px;
  object-fit: contain;
}

.bold {
  font-weight: bold;
}

.template-name {
  max-width: 100%;
}

.popup-template-container {
  max-height: 500px;
  max-width: 371px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
}

.popup-template {
  display: flex;
  align-items: center;
  gap: 19px;
  height: 75px;
  width: 368px;
  padding: 10px 19px;
  border-radius: 20px;
  border: 1px solid var(--celeste);
  cursor: pointer;
}
</style>
