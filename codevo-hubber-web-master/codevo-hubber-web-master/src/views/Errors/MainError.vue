<template>
  <v-row>
    <v-col justify-content-center class="text-center">
      <div class="card mt-10">
        <h1>404</h1>
        <p class="error-text">
          Oops. Looks like the page you're looking for no longer exists
        </p>
        <p class="error-subtext">But we're here to bring you back to safety</p>

        <v-btn class="text-capitalize" dark x-large to="/">
          Back to Home
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'MainError',
  data() {
    return {}
  },
}
</script>

<style type="text/css"></style>
