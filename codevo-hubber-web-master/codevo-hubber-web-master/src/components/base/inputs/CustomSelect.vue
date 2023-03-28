<template>
  <div class="input-container">
    <v-select
      v-bind="$attrs"
      variant="plain"
      :rules="[rules.required, rules.market]"
      hide-details
      class="custom-input-text"
    >
      <template v-slot:label>
        <span class="custom-input-label">{{ label }}</span>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        required: function (value) {
          return !!value || 'Required.'
        },
        market: function (value) {
          return value !== null
        },
      },
    }
  },
  props: {
    label: String,
    placeholder: String,
    options: Array,
  },
}
</script>

<style scoped>
.input-container {
  margin: 15px 0;
  position: relative;
  padding: 8px 15px;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.8);
  font-size: 16px;
  background-color: var(--white);
  width: 300px
}

.custom-input-text >>> .v-field__input {
  color: var(--text);
}

.custom-input-text >>> .v-field__append-inner i {
  color: var(--text);
}

.custom-input-text >>> .v-select__selection-text {
  color: var(--text);
}

.custom-input-label {
  color: var(--grey-dark);
}
</style>
