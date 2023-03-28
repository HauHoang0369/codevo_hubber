<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const emit = defineEmits([
  'callItems',
  'searchTyping',
  'selectItem',
  'confirmSelected',
])

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  name,
  isLoading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  searchPlaceholder: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
  },
})

const searchWord = ref('')

watch(
  () => searchWord.value,
  (newValue) => {
    emit('searchTyping', newValue)
  }
)

const popup = ref(null)
const handleScroll = () => {
  if (props.isLoading) {
    return
  }

  if (
    popup.value.offsetHeight + popup.value.scrollTop >=
    popup.value.scrollHeight
  ) {
    emit('callItems', searchWord.value)
  }
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>

    <div class="popup-input-main">
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.338 13.216a.77.77 0 0 1 .942-.545l1.029.275a1 1 0 0 1 .448.259l4.543 4.543a1 1 0 0 1 0 1.414l-.472.471a1 1 0 0 1-1.414 0l-4.542-4.542a1 1 0 0 1-.26-.449l-.274-1.028a.77.77 0 0 1 0-.398zm.18-11.068a7.333 7.333 0 1 1-10.37 10.37 7.333 7.333 0 0 1 10.37-10.37zM3.3 3.3a5.704 5.704 0 1 0 8.066 8.066A5.704 5.704 0 0 0 3.3 3.3z"
          fill="#A6ACB5"
          fill-rule="evenodd"
        />
      </svg>
      <input
        v-model="searchWord"
        type="text"
        :placeholder="searchPlaceholder"
      />
    </div>

    <div @scroll="handleScroll" ref="popup" class="popup-body" id="popup">
      <component
        :is="name"
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="$emit('selectItem', item.id)"
      />
      <div class="popup-loading" v-if="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </div>
    </div>
    <div class="popup-shadow-box"></div>
    <button
      :class="
        items.find((i) => i.selected)
          ? 'product-active-btn'
          : 'product-disabled-btn'
      "
      :disabled="!items.find((i) => i.selected)"
      @click="$emit('confirmSelected')"
    >
      {{ $t('PORTAL_CONFIRM_TITLE') }}
    </button>
  </div>
</template>

<style scoped>
h1 {
  font-size: 30px;
  font-weight: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
}

input {
  width: 100%;
  outline: none;
  border: none;
  padding: 15px 20px;
  border-radius: 17px;
  background-color: var(--background-blue);
}

input::placeholder {
  font-size: 16px;
  font-weight: normal;
  color: var(--grey-dark);
}

.popup-input-main {
  margin-top: 56px;
  position: relative;
}

.popup-input-main svg {
  position: absolute;
  top: 15px;
  right: 15px;
}

.product-active-btn {
  display: block;
  margin: 26px auto 0 auto;
  padding: 16px 51px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: var(--white);
  border-radius: 24px;
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
  background-image: linear-gradient(
    to top,
    var(--primary),
    var(--primary-dark)
  );
}

.product-disabled-btn {
  display: block;
  margin: 26px auto 0 auto;
  padding: 16px 51px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: var(--white);
  border-radius: 24px;
  background-color: var(--greyish-brown);
}

.popup-body {
  padding-right: 17px;
  margin-top: 38px;
  height: 317px;
  overflow: auto;
}
::-webkit-scrollbar {
  width: 8px;
}

.popup-body .popup-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 30px;
}

.popup-body::-webkit-scrollbar-thumb {
  background-color: var(--grey);
  border-radius: 100px;
}

.popup-body::-webkit-scrollbar-track {
  background: unset;
  margin-bottom: 5px;
}

.popup-shadow-box {
  position: relative;
  top: -35px;
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--white) 82%
  );
}
</style>
