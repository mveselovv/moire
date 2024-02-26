<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id, colorId: currentColorId } }">
      <img :src="imageSrc" :alt="product.title">
    </router-link>
    <div>
      <h3 class="catalog__title">
        <a href="#">
          {{ product.title }}
        </a>
      </h3>

      <span class="catalog__price">
        {{ product.price | numberFormat }} ₽
      </span>
    </div>
    <ColorsSelector :colors="product.colors" :current-color-id.sync="currentColorId" />
  </li>
</template>

<script>
import ColorsSelector from '@/components/ColorsSelector.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['product'],
  data() {
    return {
      currentColorId: this.product.colors[0].color.id,
    }
  },
  filters: {
    numberFormat
  },
  components: { ColorsSelector },
  computed: {
    currentColor() {
      return this.product.colors.find(e => e.color.id === this.currentColorId)
    },
    imageSrc() {
      if (this.currentColor.gallery) {
        return this.currentColor.gallery[0].file.url
      }
      return 'https://i.yapx.ru/VaZBB.png'
    },
  },
}
</script>
