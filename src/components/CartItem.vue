<template>
  <li class="cart__item product cart-basket" :key="item.itemId">
    <div class="product__pic">
      <img v-if="item.product.colors[colorIndex].gallery" width="120" height="120"
        :src="item.product.colors[colorIndex].gallery[0].file.url" :alt="item.product.title">
      <img v-else src="https://i.yapx.ru/VaZBB.png" :alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <div class="product__info product__info--color">
      <div>
        Цвет:
        <span>
          <i :class="{ 'cart__order--white': item.product.colors[colorIndex].color.code === '#ffffff' }"
            :style="`background-color: ${item.product.colors[colorIndex].color.code}`"></i>
          {{ item.product.colors[colorIndex].color.title }}
        </span>
      </div>
      <div>
        Размер:
        <span>
          {{ item.size.title }}
        </span>
      </div>
    </div>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <AmountSelector :value="item.quantity" @update-amount="updateAmount" />

    <b class="product__price">
      {{ itemPrice }} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.itemId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-delete"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import AmountSelector from '@/components/AmountSelector.vue'

export default {
  props: ['item'],
  data () {
    return {
      num: this.item.quantity,
      itemPrice: this.item.product.price * this.item.quantity
    }
  },
  components: { AmountSelector },
  computed: {
    amount: {
      get() {
        return this.item.amount
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', { productId: this.item.productId, amount: value })
      }
    },
    colorIndex() {
      for (let i = 0; i < this.item.product.colors.length; i++) {
        if (this.item.product.colors[i].color.id === this.item.colorId) {
          return i
        }
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['deleteCartProduct']),

    deleteProduct() {
      this.$store.dispatch('deleteCartProduct', this.item.itemId)
    },

    updateAmount(value) {
      this.item.quantity = Math.trunc(value)
      this.itemPrice = this.item.product.price * this.item.quantity
      this.$emit('update-item', {
        basketItemId: this.item.itemId,
        quantity: Math.trunc(value)
      })
    }
  }
}
</script>
