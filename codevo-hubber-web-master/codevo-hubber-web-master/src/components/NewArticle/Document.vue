<script setup>
import { ref } from 'vue'
const documentSetting = ref(false)
</script>

<template>
  <div class="document-main">
    <svg
      class="document-main-image"
      width="78"
      height="88"
      viewBox="0 0 78 88"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <filter
          x="-87%"
          y="-53.1%"
          width="273.9%"
          height="230.6%"
          filterUnits="objectBoundingBox"
          id="25oie89f4a"
        >
          <feMorphology
            radius="2.5"
            in="SourceAlpha"
            result="shadowSpreadOuter1"
          />
          <feOffset
            dy="6"
            in="shadowSpreadOuter1"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            stdDeviation="12.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feComposite
            in="shadowBlurOuter1"
            in2="SourceAlpha"
            operator="out"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0.753980007 0 0 0 0 0.824909527 0 0 0 0 0.966768569 0 0 0 0.3 0"
            in="shadowBlurOuter1"
          />
        </filter>
        <filter
          x="-142.5%"
          y="-137.2%"
          width="396%"
          height="410.2%"
          filterUnits="objectBoundingBox"
          id="e02nzzi8ac"
        >
          <feMorphology
            radius=".5"
            operator="dilate"
            in="SourceAlpha"
            result="shadowSpreadOuter1"
          />
          <feOffset
            dy="3"
            in="shadowSpreadOuter1"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            stdDeviation="5.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
            in="shadowBlurOuter1"
          />
        </filter>
        <path
          d="M22.89 13h20.113l6.84 6.5 6.842 6.5v33a3 3 0 0 1-3 3H22.89a3 3 0 0 1-3-3V16a3 3 0 0 1 3-3z"
          id="jh25ivxwnb"
        />
        <path
          d="m43.003 13 13.682 13H45.003a2 2 0 0 1-2-2V13z"
          id="1nl3obgb3d"
        />
      </defs>
      <g transform="translate(.826 .5)" fill="none" fill-rule="evenodd">
        <rect
          fill="#699EFF"
          opacity=".2"
          x="6.961"
          y="7"
          width="61.657"
          height="62"
          rx="17"
        />
        <use fill="#000" filter="url(#25oie89f4a)" xlink:href="#jh25ivxwnb" />
        <use
          stroke-opacity=".268"
          stroke="#DDE9FF"
          fill="#FFF"
          xlink:href="#jh25ivxwnb"
        />
        <g>
          <use fill="#000" filter="url(#e02nzzi8ac)" xlink:href="#1nl3obgb3d" />
          <use fill="#FFF" xlink:href="#1nl3obgb3d" />
        </g>
      </g>
    </svg>
    <div class="mb-auto">
      <p class="document-type">Documento</p>
      <p class="document-name mt-auto">nomedocumento.pdf</p>
    </div>

    <div v-if="documentSetting" class="document-settings-popup">
      <p @click="documentSetting = false">Download</p>
      <p @click="documentSetting = false">Copy link</p>
      <p @click="documentSetting = false">Delete</p>
    </div>

    <img
      @click.stop="documentSetting = !documentSetting"
      class="document-settings-icon"
      width="6"
      :src="require('@/assets/icons/icon-system-dropdpwn.svg')"
    />
  </div>
</template>

<style scoped>
.document-main {
  position: relative;
  display: flex;
  align-items: center;
  width: 360px;
  height: 99px;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}

.document-main-image {
  margin-right: 15px;
}

.document-type {
  font-size: 18px;
  font-weight: bold;
  color: var(--text);
}

.document-name {
  padding-top: 10px;
  font-size: 16px;
  font-weight: 300;
  color: var(--text);
}

.document-settings-icon {
  cursor: pointer;
  position: absolute;
  z-index: 8;
  right: 12px;
  top: 12px;
}

.document-settings-popup {
  position: absolute;
  overflow: hidden;
  top: 25px;
  z-index: 10;
  right: 12px;
  border-radius: 10px;
  box-shadow: 0 10px 40px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}
.document-settings-popup p {
  cursor: pointer;
  font-size: 14px;
  padding: 5px 15px;
  color: var(--text);
}
.document-settings-popup p:hover {
  background: var(--background-blue);
}
</style>
