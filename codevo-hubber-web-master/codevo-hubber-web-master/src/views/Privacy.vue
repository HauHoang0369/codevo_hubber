<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="p-5" v-html="content"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AuthService } from '@/services/AuthService'

export default {
  components: {},
  data() {
    return {
      content: null,
    }
  },
  async created() {
    this.content = await AuthService.getDisclaimerContent(this.systemLanguage)
  },
}
</script>

<style type="text/css"></style>
