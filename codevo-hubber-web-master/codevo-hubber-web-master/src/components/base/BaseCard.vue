<template>
  <v-card class="base-card">
    <slot></slot>
  </v-card>
</template>

<style lang="scss">
.base-card {
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}
</style>
