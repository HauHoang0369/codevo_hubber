<template>
  <div class="chip-main">
    <auth-image
      :width="25"
      :height="25"
      :path="chip.imageUrl || chip.iconImageUrl"
    />
    <p>{{ chip.name }}</p>

    <CloseIcon @click="removeChip" class="ml-2" />
  </div>
</template>

<script>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import CloseIcon from '@/components/base/icons/CloseIcon.vue';

export default {
  props: {
    chip: { type: Object },
    removeACrop: { type: Function },
  },
  methods: {
    removeChip() {
      this.$emit('remove-chip', this.chip)
    },
  },
  components: {CloseIcon, AuthImage },
}
</script>

<style lang="scss" scoped>
.chip-main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px 15px;
  border-radius: 16px;
  background-color: var(--primary-70);

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    margin-right: 10px;
  }
}

p {
  font-size: 16px;
  font-weight: normal;
  color: var(--white);
}

img {
  border-radius: 50%;
  margin-right: 5px;
}

svg {
  cursor: pointer;
}
</style>
