<template>
  <div class="product-related-card">
    <div class="product-related-card-header">
      <div class="product-related-card-badges">
        <div class="product-related-card-top-badges">
          <v-chip size="small" class="badge rosso-badge"> Novita </v-chip>
          <v-chip size="small" class="badge rosso-primary"> Bio </v-chip>
        </div>
        <div class="product-related-card-bottom-badges">
          <v-chip class="badge rosso-bs" size="small"> BS </v-chip>
        </div>
      </div>
      <img src="/images/img-product-actiwave.png" alt="Product Image" />
    </div>
    <p class="product-related-card-name">Nome prodotto</p>
    <p class="product-related-card-description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius
      tortor nibh, sit amet tempor nibh finibus et.
    </p>
  </div>
</template>

<style lang="scss">
.product-related-card {
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  background-color: var(--white);
  padding: 20px;

  .badge {
    color: $color-white;
    padding: 0 16px;
  }

  .rosso-badge {
    background-color: $color-rosso;
  }

  .rosso-primary {
    background-color: $color-verde-acqua;
  }

  .rosso-bs {
    background-color: $color-p-bs;
  }

  &-header {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 10px;
    img {
      width: 130px;
      height: 170px;
      object-fit: contain;
    }
  }

  &-badges {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  &-top-badges {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  &-name {
    font-size: 18px;
    font-weight: bold;
    color: var(--text);
  }

  &-description {
    font-size: 16px;
    color: var(--text);
  }
}
</style>
