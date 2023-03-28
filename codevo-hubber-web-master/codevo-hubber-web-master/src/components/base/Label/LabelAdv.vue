<script setup></script>

<template>
  <div class="background d-flex flex-row justify-center align-center">
    <slot class="label"></slot>
  </div>
</template>

<style scoped>
.background {
  height: 27px;
  /*padding: 6px 9px 7px;*/
  padding-left: 9px;
  padding-right: 9px;
  border-radius: 13.5px;
  /*background-color: var(--rosso);*/
}

.label {
  height: 14px;
  font-family: Ubuntu;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: var(--white);
}
</style>
