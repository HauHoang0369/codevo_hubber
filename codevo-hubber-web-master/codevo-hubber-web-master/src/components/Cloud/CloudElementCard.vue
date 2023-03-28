<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { DropdownActions } from '@/components/Cloud';
import { format } from '@/utils/day.util';
import { readableSize } from '@/utils/util';

const router = useRouter();
const store = useStore();
const props = defineProps({
  cloudElement: Object,
  folder: Object
});
const emit = defineEmits(['close', 'refreshCloudList']);

const creationDate = computed(() => format(props.cloudElement.creationDate, 'DD MMM YYYY HH:mm'));
const isSystemFolder = computed(() => props.cloudElement.documents && props.cloudElement.systemElement);
const isRegularFolder = computed(() => props.cloudElement.documents && !props.cloudElement.systemElement);
const isDocument = computed(() => !props.cloudElement.documents);
const user = computed(() => store.getters.getUser);

onMounted(async () => {
  props.cloudElement.selected = false;
});

const onCloudElementClick = () => {
  if (isSystemFolder.value || isRegularFolder.value) {
    router.push({name: 'ehubCloud', params: {folderId: props.cloudElement.id}});
  } else {
    props.cloudElement.selected = !props.cloudElement.selected;
  }
};

const onRefresh = () => {
  emit('refreshCloudList');
};

</script>

<template>
  <div class="cloud-card">
    <div class="d-flex align-center">
      <div v-if='isSystemFolder' class="d-flex-center img-wrapper" v-on:click="onCloudElementClick">
        <img src="@/assets/icons/icon-detailed-folder-locked.png"
             srcset="@/assets/icons/icon-detailed-folder-locked@2x.png 2x,
                     @/assets/icons/icon-detailed-folder-locked@3x.png 3x"
             class="Icondetailedfolder_locked">
      </div>
      <div v-if='isRegularFolder' class="d-flex-center img-wrapper" v-on:click="onCloudElementClick">
        <img src="@/assets/icons/icon-detailed-folder.png"
             srcset="@/assets/icons/icon-detailed-folder@2x.png 2x,
                     @/assets/icons/icon-detailed-folder@3x.png 3x"
             class="Icondetailedfolder">
      </div>
      <div v-if='isDocument' class="d-flex-center img-wrapper" v-on:click="onCloudElementClick">
        <div class="check-mark-container" v-if="cloudElement.selected">
          <img src="@/assets/icons/icon-system-check.png"
               srcset="@/assets/icons/icon-system-check@2x.png 2x,
                     @/assets/icons/icon-system-check@3x.png 3x"
               class="check-mark" >
        </div>

        <img src="@/assets/icons/icon-detailed-doc.png"
             srcset="@/assets/icons/icon-detailed-doc@2x.png 2x,
                     @/assets/icons/icon-detailed-doc@3x.png 3x"
             class="Icondetaileddoc">
      </div>

      <div class="flex-grow-1 w-0" v-on:click="onCloudElementClick">
        <p class="cloud-element-name text-ellipsis">{{cloudElement.name}}</p>
        <p v-if='isDocument' class="cloud-element-date text-ellipsis">{{creationDate}} ({{readableSize(cloudElement.size)}})</p>
        <p v-if='!isDocument' class="cloud-element-date text-ellipsis">{{creationDate}}</p>
      </div>
    </div>

    <div class="icon-system-dropdown d-flex align-center">
      <DropdownActions :cloudElement='cloudElement' :folder='folder' @refreshCloudList="onRefresh"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cloud-card {
  cursor: pointer;
  padding: 12px 24px 11px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  background-color: var(--white);
  position: relative;

  .icon-system-dropdown {
    position: absolute;
    top: 17px;
    right: 12px;
  }

  .img-wrapper {
    margin-right: 17px;
    position: relative;
    width: 76px;
    height: 76px;
    flex-shrink: 0;

    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }

    .check-mark-container {
      position: absolute;
      left: 0;
      top: -5px;
      width: 23px;
      height: 23px;
      background-image: linear-gradient(to bottom, #009982, var(--primary));
      border-radius: 100%;
    }
  }
}

.cloud-element-name {
  margin-bottom: 10px;
  font-family: Ubuntu, sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: var(--text);
}

.cloud-element-date {
  margin: 0;
  font-family: Ubuntu, sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text);
}
</style>
