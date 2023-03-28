<template>
  <div class="input-box">
    <div v-if="title">
      <div class="input-title">
        {{ label }}
      </div>
      <input
        type=""
        name=""
        class="input"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
      />
    </div>
    <div v-else>
      <div class="input-title">
        {{ label }}
      </div>
      <input
        type=""
        name=""
        class="input input-full-height"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String, // the initial input value
    label: String, // the title at the top of the input
    placeholder: String, // the input's placeholder
    disabled: Boolean, // disabled attribute for input
  },
}
</script>

<style type="text/css">
.input-box {
  width: auto;
  height: 55px;
  margin: 10px 0;
  position: relative;
  padding: 5px 20px 18px 20px;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.8);
  font-size: 16px;
  color: var(--grey-dark);
  background-color: var(--faded-white);
}
.input-title {
  text-align: left;
  position: relative;
  font-size: 9px;
  color: var(--grey-dark);
  background-color: yellow;
}
.input {
  background-color: red;
  width: 100%;
}
.input:focus {
  outline: none;
}
.input-full-height {
  height: 30px;
}
</style>
