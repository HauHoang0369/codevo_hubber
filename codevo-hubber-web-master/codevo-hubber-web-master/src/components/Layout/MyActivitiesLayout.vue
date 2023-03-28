<template>
  <v-app class="c-app">
    <TopBar />
    <SideBar />
    <v-layout>
      <v-container fluid class="activities-container">
        <BreadCrumb class="breadcrumb" />
        <div class="content">
          <router-view
            @open-add-activity="() => (isAddActivityPopupVisible = true)"
          />
        </div>
      </v-container>
    </v-layout>

    <AddActivityPopup
      :show="isAddActivityPopupVisible"
      :activities="activityTemplates"
      @modal-close="() => (isAddActivityPopupVisible = false)"
    />
  </v-app>
</template>

<script>
import TopBar from '@/components/TopBar/TopBar'
import SideBar from '@/components/SideBar/SideBar'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import TopMenu from '@/components/TopMenu/TopMenu'
import TopFilters from '@/components/TopFilters/TopFilters'
import AddActivityPopup from '@/views/MyActivities/AddActivityPopup.vue'

export default {
  name: 'MyActivitiesLayout',
  components: {
    TopBar,
    SideBar,
    BreadCrumb,
    TopMenu,
    TopFilters,
    AddActivityPopup,
  },

  data() {
    return {
      isAddActivityPopupVisible: false,
      activityTemplates: [
        {
          type: 'VISIT',
          name: 'Visita al cliente',
        },
        {
          type: 'WORK',
          name: 'Visita al coltivatore',
        },
        {
          type: 'CLIENT',
          name: 'Potenziale cliente',
        },
        {
          type: 'TRAINING',
          name: 'Training',
        },
        {
          type: 'MEETING',
          name: 'CRM Meeting',
        },
        {
          type: 'WORK',
          name: 'Field day',
        },
        {
          type: 'WORK',
          name: 'Field day',
        },
      ],
    }
  },
}
</script>

<style type="text/css">
.activities-container {
  padding: 130px 41px 40px 172px;
}

.breadcrumb {
  padding-left: 82px;
}
</style>
