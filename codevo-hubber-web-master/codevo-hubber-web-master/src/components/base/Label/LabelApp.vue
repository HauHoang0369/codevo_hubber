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
  height: 30px;
  padding: 7px 10px;
  border-radius: 15px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
}

.label {
  font-family: Ubuntu;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--primary);
}
</style>
