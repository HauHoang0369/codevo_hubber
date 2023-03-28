<template>
  <div class="input-container" :class="{ error: isError }">
    <v-text-field
      v-if="!isPasswordInput"
      v-bind="$attrs"
      :rules="rules!==undefined ? rules : [defaultRules.required, defaultRules.email]"
      variant="plain"
      density="comfortable"
      hide-details
      class="custom-input-text"
      :disabled="disabled"
    >
      <template v-slot:label>
        <span class="custom-input-label">{{ label }}</span>
      </template>

      <div v-if="hasPrefix" class="prefix">
        <slot name="prefix"></slot>
      </div>
    </v-text-field>

    <v-text-field
      v-if="isPasswordInput"
      v-bind="$attrs"
      :rules="rules!==undefined ?rules: [defaultRules.password]"
      variant="plain"
      density="comfortable"
      hide-details
      class="custom-input-text"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      color="primary"
      :disabled="disabled"
    >
      <template v-slot:label>
        <span class="custom-input-label">{{ label }}</span>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isError: false,
      showPassword: false,
      defaultRules: {
        required: function (value) {
          return !!value || 'Required.'
        },
        email: function (value) {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        password: function (value) {
          return true
        },
      },
    }
  },
  props: {
    value: String, // the initial input value
    label: String, // the title at the top of the input
    placeholder: String, // the input's placeholder
    disabled: Boolean, // disabled attribute for input
    isPasswordInput: Boolean,
    rules: undefined,
    hasPrefix: Boolean,
  },
}
</script>

<style scoped>
.input-container {
  margin: 15px 0;
  position: relative;
  padding: 0 15px;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.8);
  font-size: 16px;
  background-color: var(--white);
  height: 55px;
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 6px;
}

.custom-input-text >>> .v-field__input {
  color: var(--text);
}

.custom-input-text >>> .v-field--focused .v-label.v-field-label {
  transform: translateY(-10px);
  font-weight: 300;
}


.custom-input-text >>> .v-field.v-field--active .v-label.v-field-label--floating {
  transform: translateY(-10px);
  font-weight: 300;
}

.custom-input-text >>> .v-input__append i {
  color: var(--text);
}

.custom-input-label {
  color: var(--grey-dark);
}

/* Error styling */
.input-container.error {
  border: solid 1px var(--rosso);
  background-color: rgba(255, 81, 110, 0.1);
}

.input-container.error .custom-input-text >>> .v-field__input {
  color: var(--rosso);
}

.input-container.error .custom-input-text >>> .v-field__input::placeholder {
  color: var(--rosso);
  opacity: 1;
}

.input-container.error .custom-input-label {
  color: var(--rosso);
}

.prefix {
  display: flex;
  align-items: center;
  margin-right: 6px;
}
</style>
