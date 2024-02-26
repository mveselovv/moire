<template>
  <main class="content container cart__page">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ products.length }} {{ $declension(products.length, ['товар', 'товара', 'товаров']) }}
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.id" :item="item" @update-item="updateItem" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span><strong>{{ totalPrice | numberFormat }} ₽</strong></span>
          </p>

          <router-link tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit" v-if="products.length">
            Оформить заказ
          </router-link>
          <div class="cart__page--null" v-else>
              <p>Ваша корзина пуста</p>
              <router-link tag="button" :to="{name: 'main'}" class="button button--second">Перейти к покупкам</router-link>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import CartItem from '@/components/CartItem.vue'
import numberFormat from '@/helpers/numberFormat'

export default {
  components: { CartItem },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice'
    }),
    products () {
      return this.$store.getters.cartDetailProducts
    }
  },
  metaInfo () {
    return {
      title: 'Корзина товаров / Moire'
    }
  },
  filters: {
    numberFormat
  },
  methods: {
    updateItem (data) {
      this.$store.dispatch('updateCartProductAmount', data)
    }
  }
}
</script>
