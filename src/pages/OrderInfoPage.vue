<template>
  <div>
    <main class="content container order-info" v-if="order">
      <div class="content__top">
        <h1 class="content__title">
          Заказ оформлен <span>№ {{ order?.id }}</span>
        </h1>
      </div>
      <section class="cart">
        <form class="cart__form form" action="#" method="POST">
          <div class="cart__field">
            <p class="cart__message">
              Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
              Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
            </p>
            <ul class="dictionary">
              <li class="dictionary__item">
                <span class="dictionary__key">
                  Получатель
                </span>
                <span class="dictionary__value">
                  {{ order?.name }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key">
                  Адрес доставки
                </span>
                <span class="dictionary__value">
                  {{ order?.address }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key">
                  Телефон
                </span>
                <span class="dictionary__value">
                  {{ order?.phone }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key">
                  Email
                </span>
                <span class="dictionary__value">
                  {{ order?.email }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key">
                  Способ оплаты
                </span>
                <span class="dictionary__value">
                  {{ order?.deliveryType.title }}
                </span>
              </li>
            </ul>
          </div>
          <div class="cart__block">
            <ul class="cart__orders">
              <li class="cart__order" v-for="item in order.basket.items" :key="item.id">
                <h3>{{ item.product.title }}</h3>
                <b>{{ item.quantity * item.product.price | numberFormat }} ₽ <span v-if="item.quantity > 1">({{ item.quantity }})</span></b>
                <p class="cart__order--info">
                <span>Артикул: {{ item.product.id }}</span>
                <span>Цвет: {{ item.color.color.title }} <i :class="{'cart__order--white' : item.color.color.code === '#ffffff'}" :style="`background-color: ${item.color.color.code}`"></i></span>
                <span>Размер: {{ item.size.title }}</span>
                </p>
              </li>
            </ul>
            <div class="cart__total">
              <p>Доставка: <b v-if="order?.deliveryType.price > 0">{{ order?.deliveryType.price }} ₽</b>
                <b v-else>бесплатно</b>
              </p>
              <p>Итого: <b>{{ order?.basket.items.length }} {{ $declension(order?.basket.items.length, ['товар', 'товара', 'товаров']) }}</b> товара на сумму <b>{{ totalPriceWithDelivery | numberFormat }} ₽</b></p>
            </div>
          </div>
        </form>
      </section>
    </main>
    <main class="container not-page" v-else>
      <div class="not-page__left">
      <h3><strong>404. Страница не найдена</strong></h3>
      <p>Возможно, она была перемещена, или вы просто неверно указали адрес страницы.</p>
    </div>
    <div class="not-page__right"></div>
    <router-link tag="button" :to="{name: 'main'}" class="button button--primery not-page__button">На главную</router-link>
    </main>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'

export default {
  filters: {
    numberFormat
  },
  metaInfo () {
    return {
      title: 'Детали вашего заказа №' + this.order?.id + ' / Moire'
    }
  },
  created () {
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
      return
    }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id)
  },
  computed: {
    order () {
      return this.$store.state.orderInfo
    },
    totalPriceWithDelivery () {
      return this.$store.state.orderInfo.basket.items
        .reduce((acc, item) => (item.price * item.quantity) + acc, parseInt(this.$store.state.orderInfo.deliveryType.price))
    }
  }
}
</script>
