<template>
  <div>
    <v-overlay
      v-model="isLoading"
      absolute
      style="width: 100vw; height: 100vh; opacity: 0.7"
      class="justify-center align-center"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <router-view />

    <v-snackbar v-model="showSnackBar" timeout='3000' >
      <div class="d-flex align-center justify-space-between">
        <span class="toast-msg">
          {{ snackbarText }}
        </span>

        <span class="close-btn" @click="closeSnackBar">
          <CloseIcon class="close-icon" />
        </span>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { CloseIcon } from '@/components/base/icons';

export default {
  components: {
    CloseIcon,
  },
  name: 'App',
  data: () => ({
    // isLoading:false,
  }),
  mounted() {
    this.$store.commit('setLoading', false)
  },
  computed: {
    isLoading: {
      get() {
        // console.log("isLoading " + this.$store.state.loading)
        // let a = this.$store.state.loading === "true" ? true : false
        return this.$store.state.loading
      },
      set() {
        this.$store.commit('setLoading', true)
      },
    },
    showSnackBar: {
      get() {
        return this.$store.state.notifications.show
      },
      set(value) {
        this.$store.commit('notifications/setSnackBar', {
          show: value,
          content: '',
          isError: false,
        })
      },
    },
    snackbarErr: {
      get() {
        return this.$store.state.notifications.isError
      },
    },
    snackbarText: {
      get() {
        return this.$store.state.notifications.content
      },
    },
  },
  created() {
    if (sessionStorage.getItem('user') && this.$store.state.user == null) {
      this.loginUser(JSON.parse(sessionStorage.getItem('user')))
    }
  },
  methods: {
    ...mapMutations(['loginUser']),
    closeSnackBar() {
      this.$store.commit('notifications/setSnackBar', {
        show: false,
        content: '',
        isError: false,
      })
    }
  },
}
</script>

<style lang="scss">
.scroll-none {
  overflow: hidden;
}

.v-snackbar__wrapper {
  border-radius: 10px !important;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3) !important;
  background-color: #313132 !important;

  .v-snackbar__content {
    color: $color-white !important;
    font-size: 14px;
    padding: 20px 14px 20px 27px;


    .toast-msg {
      color: $color-white;
      margin-right: 10px;
      word-break: break-all;
    }

    .close-btn {
      &::v-deep(.close-icon) {
        color: $color-white;
      }

      &:hover {
        cursor: pointer;
      }
    }

  }
}
</style>
