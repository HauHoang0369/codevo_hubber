<template>
  <div class="popup-container" id="popup" v-show="popupIsOpen">
    <div class="popup" id="popup-body">
      <h3 class="popup-title">{{ title }}</h3>
      <p class="popup-message">
        {{ message }}
      </p>
      <span class="popup-close" @click="close"><strong>X</strong></span>
    </div>
  </div>
</template>

<script>
export default {
  // expose: ['open', 'close'],
  data() {
    return {
      title: '',
      message: '',
      popupIsOpen: false,
    }
  },
  created() {
    document.addEventListener('click', (e) => {
      if (
        document.getElementById('popup-body') &&
        !document.getElementById('popup-body').contains(e.target)
      ) {
        this.close()
      }
    })
  },
  methods: {
    open(title, message) {
      this.title = title
      this.message = message
      this.popupIsOpen = true
    },
    close() {
      this.title = ''
      this.message = ''
      this.popupIsOpen = false
    },
  },
}
</script>
<style>
.popup-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(200, 200, 200, 0.8);
}

.popup {
  position: relative;
  width: 80vw;
  height: auto;
  margin: 25vh auto 0 auto;
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
}

.popup-title {
  font-family: Ubuntu;
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: var(--primary);
}

.popup-message {
  margin-top: 30px;
  font-family: Ubuntu;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: var(--text);
}

.popup-close {
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
}
</style>
