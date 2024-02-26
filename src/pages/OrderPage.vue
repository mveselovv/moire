<template>
  <main class="content container order__page">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Козина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formDate.name" :error="formError.name" title="ФИО*"
              placeholder="Введите ваше полное имя" />
            <BaseFormText v-model="formDate.address" :error="formError.address" title="Адрес доставки*"
              placeholder="Введите ваш адрес" />
            <BaseFormPhone v-model="formDate.phone" type="phone" :error="formError.phone" title="Телефон*"
              placeholder="+7 (9xx) xxx xxxx" />
            <BaseFormText v-model="formDate.email" type="email" :error="formError.email" title="Email*"
              placeholder="Введи ваш Email" />
            <BaseFormTextarea v-model="formDate.comment" :error="formError.comment" title="Комментарий к заказу"
              placeholder="Ваши пожелания" />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка*</h3>
            <ul class="cart__options options options-delivery">
              <li class="options__item" v-for="delivery in deliveriesData" :key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery.id"
                    @click.prevent="selectDelivery(delivery)" :checked="delivery.id === deliveryTypeId">
                  <span class="options__value">
                    {{ delivery.title }}
                    <strong v-if="delivery.price > 1"> {{ delivery.price | numberFormat }} ₽</strong>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата*</h3>
            <ul class="cart__options options options-not-delivery" v-if="!deliveryTypeId">
              <li class="options__item">
                Не выбран способ доставки
              </li>
            </ul>
            <ul class="cart__options options options-pay" v-else>
              <li class="options__item" v-for="payment in paymentsData" :key="payment.id">
                <label class="options__label">
                  <input @click="selectPayment(payment)" class="options__radio sr-only" type="radio" name="pay"
                    :value="payment.id" :checked="payment.id === paymentTypeId">
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders" v-if="products.length">
            <li class="cart__order" v-for="item in products" :key="item.product.productId">
              <h3>{{ item.product.title }}</h3>
              <b>{{ item.quantity * item.product.price | numberFormat }} ₽ <span v-if="item.quantity > 1">({{ item.quantity }})</span></b>
              <p class="cart__order--info">
              <span>Артикул: {{ item.product.id }}</span>
              <span>Цвет: {{ item.color.color.title }} <i :class="{'cart__order--white' : item.color.color.code === '#ffffff'}" :style="`background-color: ${item.color.color.code}`"></i></span>
              <span>Размер: {{ item.size.title }}</span>
              </p>
            </li>
          </ul>
          <ul class="cart__orders" v-else>
            <li class="cart__page--null">
              <p>Ваша корзина пуста</p>
              <button class="button button--second">Перейти к покупкам</button>
            </li>
          </ul>

          <div class="cart__total">
            <p>{{ deliveryMethod }}
              <b v-if="deliveryPrice > 0">{{ deliveryPrice | numberFormat }} ₽</b>
              <b v-else-if="deliveryTypeId">Бесплатно</b>
            </p>
            <p>{{ paymentMethod }}</p>
            <p>Итого: <b>{{ products.length }} {{ $declension(products.length, ['товар', 'товара', 'товаров']) }}</b>
              товара на сумму <b><strong>{{ grandTotalPrice | numberFormat }} ₽</strong></b></p>
          </div>

          <button class="cart__button button button--primery" type="submit" v-if="deliveryTypeId && paymentTypeId">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import BaseFormPhone from '@/components/BaseFormPhone.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import api from '@/api/api';

export default {
  filters: {
    numberFormat
  },
  data () {
    return {
      formDate: {},
      formError: {},
      formErrorMessage: '',
      // Способок доставки
      deliveryTypeId: 0,
      deliveryPrice: 0,
      deliveryMethod: 'Способ доставки не выбран',
      deliveriesData: [],
      deliveriesLoading: false,
      deliveriesLoadingFailed: false,
      // Оплата товара, после выбранного способа доставки
      paymentTypeId: 0,
      paymentsData: [],
      paymentMethod: 'Способ оплаты не выбран',
      paymentsLoading: false,
      paymentsLoadingFailed: false
    }
  },
  metaInfo () {
    return {
      title: 'Оформление заказа / Moire'
    }
  },
  components: { BaseFormText, BaseFormTextarea, BaseFormPhone },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice' }),
    grandTotalPrice () {
      return parseInt(this.totalPrice) + parseInt(this.deliveryPrice) // Подсчёт общей стоимости с доставкой, если выбрано курьером
    }
  },
  methods: {
    async order () {
      this.formError = {}
      this.formErrorMessage = ''

      await (new Promise(resolve => setTimeout(resolve, 1000)))
      try {
        const response = await axios.post(API_BASE_URL + '/api/orders', {
          ...this.formDate,
          deliveryTypeId: this.deliveryTypeId,
          paymentTypeId: this.paymentTypeId
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey
          }
        })
        this.$store.commit('resetCart')
        this.$store.commit('updateOrderInfo', response.data)
        this.$router.push({ name: 'orderInfo', params: { id: response.data.id } })
      } catch (error) {
        this.formError = error.response.data.error.request || {}
        this.formErrorMessage = error.response.data.error.message
      }
    },
    async loadDeliveries () {
      this.deliveriesLoading = true;
      this.deliveriesLoadingFailed = false;
      try {
        const response = await api.loadDeliveries();
        this.deliveriesData = response.data;
        } catch {
        this.deliveriesLoadingFailed = true;
        }
        this.deliveriesLoading = false;
    },
    async loadPayments (deliveryTypeId) {
      this.paymentsLoading = true
      this.paymentsLoadingFailed = false
      try {
      const response = await api.loadPayments(deliveryTypeId);
      this.paymentsData = response.data;
      } catch {
      this.paymentsLoadingFailed = true;
      }
      this.paymentsLoading = false;
    },
    selectDelivery (delivery) {
      this.deliveryTypeId = delivery.id
      this.loadPayments(delivery.id)
      this.paymentTypeId = 0
      this.paymentMethod = 'Способ оплаты не выбран'
      this.deliveryPrice = delivery.price
      this.deliveryMethod = delivery.title
    },
    selectPayment (payment) {
      this.paymentTypeId = payment.id
      this.paymentMethod = payment.title
    }
  },
  created () {
    this.loadDeliveries()
  }
}
</script>
