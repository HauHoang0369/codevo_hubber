<template>
  <div class="popup-background" @click.self="$emit('closePopup')">
    <div class="popup-main">
      <svg
        @click="$emit('closePopup')"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.228 2.272a1.5 1.5 0 0 1 0 2.121L16.62 15l10.607 10.607a1.5 1.5 0 0 1 .103 2.007l-.103.114a1.5 1.5 0 0 1-2.121 0L14.5 17.12 3.893 27.728a1.5 1.5 0 0 1-2.12-2.121L12.377 15 1.772 4.393a1.5 1.5 0 0 1-.103-2.007l.103-.114a1.5 1.5 0 0 1 2.121 0L14.5 12.878 25.107 2.272a1.5 1.5 0 0 1 2.12 0z"
          fill="#A6ACB5"
          fill-rule="evenodd"
        />
      </svg>
      <slot>
        <div>
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
.popup-background {
  width: 100%;
  height: 100vh;
  position: fixed;
  display: block;
  z-index: 1005;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-background svg {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.popup-main {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1006;
  transform: translate(-50%, -50%);
  padding: 50px 86px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
}

.modal-header {
  text-align: center;
  margin-bottom: 40px;
}

.modal-header .modal-title {
  width: 362px;
  height: 60px;
  font-family: Ubuntu, serif;
  font-size: 30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: var(--primary);
}

.modal-body {
  margin-top: 15px;
}

.modal-confirm {
  display: block;
  margin: 20px auto 0;
  padding: 16px 50px;
  border-radius: 99999px;
  font-family: Ubuntu, serif;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.78px;
  text-align: center;
  color: var(--white);
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
  background-image: linear-gradient(
    to top,
    var(--primary-dark),
    var(--primary)
  );
}

.modal-confirm span {
  width: 81px;
  height: 16px;
  font-family: Ubuntu, serif;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.78px;
  text-align: center;
  color: var(--white);
}

body {
  overflow: hidden;
}
</style>
