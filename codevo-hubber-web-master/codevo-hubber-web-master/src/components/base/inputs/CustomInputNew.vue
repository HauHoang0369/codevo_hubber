<template>
  <div class="input-box">
    <v-text-field
      color="primary"
      border-color="blue"
      label="Il tuo indirizzo email"
      variant="solo"
      placeholder="Email"
      v-model="email"
      :rules="[rules.required, rules.email]"
      class="rounded-xl"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  props: {
    value: String, // the initial input value
    title: String, // the title at the top of the input
    placeholder: String, // the input's placeholder
    disabled: Boolean, // disabled attribute for input
  },
}
</script>

<style type="text/css">
.input-box {
  width: 374px;
  height: 55px;
  margin: 10px 0;
  position: relative;
  padding: 10px 15px;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.8);
  font-size: 16px;
  color: var(--grey-dark);
}
.input-title {
  position: relative;
  width: 100%;
  text-align: left;
  left: 0;
  font-size: 9px;
  color: var(--grey-dark);
}
.input {
  width: 100%;
}
.input:focus {
  outline: none;
}
.input-full-height {
  height: 30px;
}
</style>
