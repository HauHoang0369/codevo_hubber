<script setup>
import Logo from '@/components/base/Logo/Logo'
</script>

<template>
  <div class="d-flex flex-column align-center pb-11">
    <Logo></Logo>

    <span class="footer-text text-pre-wrap">
      © 2022 {{ config.CUSTOMER_NAME }} - All rights reserved<br />
      {{ config.CUSTOMER_FOOTER }}
    </span>
  </div>
</template>

<style scoped>
.footer-text {
  margin: 8px 0 0;
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.63;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary-dark);
  overflow-wrap: break-word;
}
</style>
