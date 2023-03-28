<script setup>
import { ref } from 'vue';
import SystemDropdownIcon from '@/components/base/icons/SystemDropdownIcon.vue';
import { InfoCloudElement, ModifyCloudElement, DeleteCloudElement } from '@/components/Cloud';

const props = defineProps({
  cloudElement: Object,
  folder: Object
});

const cloudElement = ref(props.cloudElement);
const isOpen = ref(false);
const onInfo = ref(false);
const onModify = ref(false);
const onDelete = ref(false);

const emit = defineEmits(['close', 'refreshCloudList']);

const hideActions = () => {
  isOpen.value = false;
};

const showInfo = (status = false) => {
  onInfo.value = status;
};

const showModify = (status = false) => {
  onModify.value = status;
};

const showDelete = (show = true) => {
  onDelete.value = show;
};

const onRefresh = () => {
  emit('refreshCloudList');
};

</script>

<template>
  <div>
    <div v-click-outside='hideActions' class='option-show'>
      <span class='icon-dropdown' @click.prevent='isOpen = !isOpen'>
        <SystemDropdownIcon />
      </span>

      <div v-show='isOpen' class='list-actions'>
        <ul>
          <li class="list-actions__item" @click.prevent='showInfo(true)' v-if="cloudElement.loggedUserPermission.canView">
            <img src="@/assets/icons/icon-system-info.png"
                 srcset="@/assets/icons/icon-system-info@2x.png 2x,
                             @/assets/icons/icon-system-info@3x.png 3x"
                 alt="">
            <span class="list-item-label">Info</span>
          </li>
          <li class="list-actions__item" @click.prevent='showModify(true)' v-if="cloudElement.loggedUserPermission.canWrite">
            <img src="@/assets/icons/icon-system-edit.png"
                 srcset="@/assets/icons/icon-system-edit@2x.png 2x,
                             @/assets/icons/icon-system-edit@3x.png 3x"
                 alt=""
            >
            <span class="list-item-label">Modifica</span>
          </li>
          <li class="list-actions__item" @click.prevent='showDelete(true)' v-if="cloudElement.loggedUserPermission.canDelete">
            <img src="@/assets/icons/icon-system-trash.png"
                 srcset="@/assets/icons/icon-system-trash@2x.png 2x,
                             @/assets/icons/icon-system-trash@3x.png 3x"
                 alt=""
            >
            <span class="list-item-label">Elimina</span>
          </li>
        </ul>
      </div>
    </div>
    <v-dialog v-model='onInfo' scrollable persistent v-on:click:outside="showInfo(false)" max-width='612'>
      <v-card style='border-radius: 30px'>
        <InfoCloudElement :cloudElement="cloudElement" v-on:close='showInfo(false)' />
      </v-card>
    </v-dialog>
    <v-dialog v-model='onModify' v-on:click:outside="showModify(false)" max-width='824'>
      <v-card style='border-radius: 30px'>
        <ModifyCloudElement :cloudElement="cloudElement" :showProducts="folder.capabilities.productAssociation" :showSolutions="folder.capabilities.solutionAssociation" v-on:close='showModify(false)' />
      </v-card>
    </v-dialog>
    <v-dialog v-model="onDelete" v-on:click:outside="showDelete(false)" max-width='534'>
      <DeleteCloudElement :cloudElement="cloudElement" v-on:close='showDelete(false)' @refreshCloudList="onRefresh"/>
    </v-dialog>
  </div>
</template>

<style lang='scss' scoped>
.option-show {
  position: relative;
  height: 26px;
}

.icon-dropdown {
  cursor: pointer;
}

.list-item-label {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--primary);
}


.list-actions {
  position: absolute;
  width: 130px;
  z-index: 2;
  top: 100%;
  right: 0;
  padding: 8px;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

  ul {
    list-style-type: none;

    li {
      cursor: pointer;
      line-height: 31px;
      font-size: 14px;
      color: var(--text);
      text-align: center;
      display: flex;
      align-items: center;
      padding: 8px 4px;
      border-bottom: solid 1px var(--background-blue);
      min-width: 105px;

      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }

      &:hover {
        background-color: var(--background-blue);
      }

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
