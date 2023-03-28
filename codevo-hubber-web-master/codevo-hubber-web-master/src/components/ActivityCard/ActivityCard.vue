<template>
  <div v-if="view === 'grid'" class="card-wrapper">
    <div class="activity-icon">
      <img v-if="activity.type === 'MEETING'" :src="MeetingIcon" />
      <img v-else-if="activity.type === 'VISIT'" :src="VisitingIcon" />
      <img v-else-if="activity.type === 'WORK'" :src="WorkIcon" />
      <img v-else-if="activity.type === 'TRAINING'" :src="TrainingIcon" />
      <img v-else-if="activity.type === 'CLIENT'" :src="ClientIcon" />
    </div>

    <div class="details-container">
      <div>
        <p>{{ activity.slot1 }}</p>
        <p class="bold">{{ activity.slot2 }}</p>
      </div>
      <p class="text-sm">{{ activity.date }}</p>
      <p class="text-sm">
        Stato:
        <span
          :class="
            activity.status === 'Completato'
              ? 'complete'
              : activity.status === 'Assegnata'
              ? 'assigned'
              : 'non-complete'
          "
          >{{ activity.status }}</span
        >
      </p>

      <div class="d-flex align-center">
        <!-- <AuthImage :path="'test'" :width="45" :height="45" /> -->
        <p class="text-sm">Tommaso Crociera</p>
      </div>
    </div>
  </div>

  <div v-else-if="view === 'list'" class="card-wrapper card-wrapper-list">
    <v-row>
      <v-col>
        <v-sheet class="d-flex">
          <div class="activity-icon activity-icon-list">
            <img v-if="activity.type === 'MEETING'" :src="MeetingIcon" />
            <img v-else-if="activity.type === 'VISIT'" :src="VisitingIcon" />
            <img v-else-if="activity.type === 'WORK'" :src="WorkIcon" />
            <img v-else-if="activity.type === 'TRAINING'" :src="TrainingIcon" />
            <img v-else-if="activity.type === 'CLIENT'" :src="ClientIcon" />
          </div>
          <span class="text-text text-lg bold">{{ activity.text1 }}</span>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet>
          <p class="text-text text-lg bold">{{ activity.slot1 }}</p>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet>
          <div class="d-flex align-center">
            <div class="drop-icon">
              <DropdownIcon />
            </div>
            <p class="text-text text-lg mr-5">Assegnato a:</p>
            <div class="d-flex align-center">
              <!-- <AuthImage :path="'test'" :width="45" :height="45" /> -->
              <p class="text-text bold ml-4">Tommaso Crociera</p>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-divider class="mt-3 mb-3" horizontal />

    <v-row>
      <v-col>
        <v-sheet class="footer-first-col">
          <div>
            <p class="text-lg text-text date-detail">Data pianificata:</p>
            <p class="text-lg text-text date-detail bold">
              {{ activity.startDate }}
            </p>
          </div>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet>
          <div>
            <p class="text-lg text-text date-detail">Data effettiva:</p>
            <p class="text-lg text-text date-detail bold">
              {{ activity.endDate }}
            </p>
          </div>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet class="d-flex justify-end">
          <div class="chevron-icon"><ChevronDownIcon :fill="'#a6acb5'" /></div>
          <v-btn variant="text text-btn">Dettaglio attività</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import MeetingIcon from '@/assets/icons/MeetingIcon.svg'
import VisitingIcon from '@/assets/icons/VisitingIcon.svg'
import WorkIcon from '@/assets/icons/WorkIcon.svg'
import TrainingIcon from '@/assets/icons/TrainingIcon.svg'
import ClientIcon from '@/assets/icons/ClientIcon.svg'
import DropdownIcon from '../base/icons/DropdownIcon'
import ChevronDownIcon from '../base/icons/ChevronDownIcon'
import AuthImage from '@/components/base/AuthImage/AuthImage'

const props = defineProps({
  activity: Object,
  view: String,
})
</script>

<styles lang="scss" scoped>
@import '../../scss/style.scss';

.card-wrapper {
  position: relative;
  width: 390px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: $color-white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px hsla(220, 77%, 86%, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
}

.card-wrapper-list {
  display: block;
  width: 100%;
}

.details-container {
  display: flex;
  flex-direction: column;
  gap: 13px;
  font-size: 18px;

  p {
    color: $color-text;
    line-height: normal;
    letter-spacing: normal;
  }
}

.bold {
  font-weight: bold;
}

.complete {
  color: $color-verde-acqua;
}

.assigned {
  color: $color-orange;
}

.non-complete {
  color: $color-rosso;
}

.activity-icon {
  img {
    height: 45px;
    width: 45px;
    object-fit: contain;
  }
}

.activity-icon-list {
  img {
    margin-right: 19px;
    height: 42px;
    width: 42px;
  }
}

.bold {
  font-weight: bold;
}

.date-detail {
  line-height: 1.11;
  letter-spacing: normal;
}

.text-btn {
  text-transform: capitalize;
  font-weight: bold;
  margin-right: 72px;
}

.drop-icon {
  position: absolute;
  right: 20px;
  cursor: pointer;

  svg {
    fill: rgba(192, 210, 247, 0.302);
  }

  &:hover {
    svg {
      fill: $color-grey-dark;
    }
  }
}

.chevron-icon {
  position: absolute;
  right: 20px;
  bottom: 27px;
  cursor: pointer;
}

.footer-first-col {
  margin-left: 61px;
}
</styles>
