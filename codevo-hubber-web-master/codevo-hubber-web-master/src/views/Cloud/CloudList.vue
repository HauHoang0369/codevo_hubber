<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import CloudService from '@/services/Cloud/CloudService';
import Grid from '@/components/base/Grid/Grid';
import CloudElementCard from '@/components/Cloud/CloudElementCard';
import CloudPath from '@/components/Cloud/CloudPath';
import NewCloudElement from '@/components/Cloud/NewCloudElement';
import { DownLoadIcon, ShareIcon } from '@/components/base/icons';

const store = useStore();
const router = useRouter();
const user = computed(() => store.getters.getUser);

const folderId = ref();
const isLoading = ref(false);
const folder = ref({}); // Stores full api response, including pagedata
const folderElements = ref([]); // Stores only response content, actual data
const path = ref([]);
const countSelected = computed(() => folderElements.value.filter(element => element.selected).length);
const anyDownloadable = computed(() => folderElements.value.some(element => element.selected && element.loggedUserPermission.canDownload));
const isFolderWritable = computed(() => folder.value.loggedUserPermission && folder.value.loggedUserPermission.canWrite);
const onNew = ref(false);

onMounted(async () => {
  try {
    store.commit('setLoading', true);
    folderId.value = router.currentRoute.value.params.folderId;
    await loadCloud();
    store.commit('setLoading', false);
  } catch (e) {
    store.commit('setLoading', false);
    console.error(e);
  }
});

onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  if (to.params.folderId !== from.params.folderId) {
    try {
      store.commit('setLoading', true);
      folderId.value = to.params.folderId;
      await loadCloud();
      store.commit('setLoading', false);
    } catch (e) {
      store.commit('setLoading', false);
      console.error(e);
    }
  }
});

const loadCloud = async () => {
  try {
    folderElements.value.splice(0, folderElements.value.length);
    if (folderId.value) {
      // subfolder
      folder.value = await new CloudService().service.getCloudFolder(folderId.value);
    } else {
      // root folder
      folder.value = await new CloudService().service.getCloudRoot();
    }
    if (folder.value.subfolders) {
      folderElements.value.push(...folder.value.subfolders);
    }
    if (folder.value.documents) {
      folderElements.value.push(...folder.value.documents);
    }
    path.value = folder.value.previusPathSegment;
    if (path.value) {
      path.value.push({id: folder.value.id, name: folder.value.name});
    }
  } catch (e) {
    console.error(e);
  }
};

const onDownloadClick = () => {
  console.log('Download');
};

const onRefresh = async () => {
  console.log('New element');
  store.commit('setLoading', true);
  await loadCloud();
  store.commit('setLoading', false);
};

const showNew = (status = false) => {
  onNew.value = status;
};

</script>

<template>
  <div class="cloud-list-page">
    <div class="d-flex align-center justify-space-between w-100">
      <h1 class="page-title my-0 text-clamp-2">
        e-Hub Cloud
      </h1>
    </div>

    <div class="content">
      <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-30">
        <div class="max-w-100 mr-2">
          <CloudPath :path="path"/>
        </div>

        <div class="d-flex align-center align-self-end align-self-md-center mt-4 mt-md-0">
          <span v-if="countSelected === 1" class="text-sm text-grey-dark mr-4 mr-lg-10 text-clamp-2">
            Hai selezionato 1 documento
          </span>

          <span v-if="countSelected > 1" class="text-sm text-grey-dark mr-4 mr-lg-10 text-clamp-2">
            Hai selezionato {{countSelected}} documenti
          </span>

          <button class="icon-btn" v-on:click="onDownloadClick" :disabled="!anyDownloadable">
            <ShareIcon />
          </button>

          <button class="icon-btn ml-5 ml-lg-10" v-on:click="onDownloadClick" :disabled="!anyDownloadable">
            <DownLoadIcon />
          </button>

          <div class="new-element-btn ml-5 ml-lg-10" v-on:click="showNew(true)" :disabled="isFolderWritable">
            <img src="@/assets/icons/icon-system-plus.png"
                 srcset="@/assets/icons/icon-system-plus@2x.png 2x,
                   @/assets/icons/icon-system-plus@3x.png 3x"
                 class="Iconsystemplus" alt="" />

            <span class="ml-1">Nuovo</span>
          </div>
        </div>
      </div>

      <Grid xl="3" lg="3" md="2" sm="2" :column-gap="40" :row-gap="40" class="">
        <CloudElementCard
          v-for="cloudElement in folderElements"
          :cloudElement="cloudElement"
          :folder="folder"
          :key="cloudElement.id"
          @refreshCloudList="onRefresh"
        />
      </Grid>
      <div id="cloud-load-more" class="w-100">
        <div v-if="isLoading === true" class="text-center mt-10 mb-16">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </div>
      </div>
      <!--      </LoadMore>-->
    </div>

    <v-dialog v-model='onNew' v-on:click:outside="showNew(false)" max-width='824'>
      <v-card style='border-radius: 30px'>
        <NewCloudElement :parentId="folder.id" :showCopyPermissions="folder.parent != null" v-on:close='showNew(false)' @refreshCloudList="onRefresh" />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.cloud-list-page {
  .search-wrapper {
    width: 374px;
  }


  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border: none;

    &:not(:disabled) {
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }

    &:disabled {
      &::v-deep {
        path {
          color: $color-grey-dark;
        }
      }
    }
  }

  .new-element-btn {
    display: flex;
    align-items: center;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}


.content {
  height: 100%;
  flex-grow: 1;
}

#cloud-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  grid-column-gap: 40px;
  grid-row-gap: 30px;
  /*height: 600px !important;*/
  /*overflow: scroll;*/
}

#cloud-load-more {
  height: 50px;
}

.e-Hub-Cloud {
  width: 225px;
  height: 50px;
  margin: 30px 174.5px 42px 261.5px;
  font-family: Ubuntu;
  font-size: 40px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: var(--primary);
}

.selected-elements {
  margin: 49px 38px 38px 36px;
  font-family: Ubuntu;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: var(--text);
}

img.Iconsystemdownload {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin: 42px 40px 31px 256px;
  object-fit: contain;
}

img.Iconsystemplus {
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin: 1px 5px 1px 0;
  object-fit: contain;
}

.Categoria-prodotto {
  cursor: pointer;
  width: 49px;
  height: 22px;
  margin: 0 0 0 5px;
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--primary);
}



</style>
