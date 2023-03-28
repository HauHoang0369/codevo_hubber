<script setup>

</script>

<template>
  <div class="background d-flex flex-row justify-center align-center">
    <div class="label">
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
.background {
  height: 27px;
  padding: 6px 20.5px 7px 21.5px;
  border-radius: 13.5px;
  /*background-color: var(--rosso);*/
}

.label {
  font-family: Ubuntu;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: var(--white) !important;
}
</style>
