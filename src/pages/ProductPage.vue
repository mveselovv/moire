<template>
  <main class="content container">
    <Preloader :loading="productLoading" :text="`Загружаем товар...`" v-show="productLoading" />
    <div class="loader__error" v-if="productLoadingFailed">Кажется, что-то пошло не так &#128532;
      <button class="button button--second" @click.prevent="loadProduct">Попробовать еще раз</button>
    </div>
    <div v-if="productData">
      <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main', params: { categoryId: category.id } }">
            {{ product.category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>
    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="imageSrc" :alt="product.title">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="(color, index) in product.colors" :key="index">
            <a href="" class="pics__link"
              :class="{ pics__link__current: productColorId === product.colors[index].color.id }"
              @click.prevent="productColorId = product.colors[index].color.id">
              <img width="98" height="98" v-if="product.colors[index].gallery"
                :src="product.colors[index].gallery[0].file.url" :alt="product.title">
            </a>
          </li>
        </ul>
      </div>
      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <AmountSelector :value="productAmount" @update-amount="updateAmount" />

              <b class="item__price">
                {{ product.price | numberFormat }} ₽
              </b>
            </div>
            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ColorsSelector :colors="product.colors" :current-color-id.sync="productColorId" />
              </fieldset>
              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <SizeSelector :sizes="product.sizes" :current-size-id.sync="productSizeId" />
              </fieldset>
            </div>
            <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
              В корзину
            </button>
            <div v-show="productAdded">
              <span>&#9989;</span>
              Товар добавлен в корзину
            </div>
            <div class="loader__sending" v-show="productAddSending">
              <div class="loader"></div>
              Добавляем товар в корзину...
            </div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link" @click.prevent="setActive('info')"
              :class="{ 'tabs__link--current': isActive('info') }" href="#info">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" @click.prevent="setActive('delivery')"
              :class="{ 'tabs__link--current': isActive('delivery') }" href="#delivery">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content" :class="{ 'active': isActive('info') }" id="info">
          <h3><strong>Состав:</strong></h3>

          <p>{{ materialList }}</p>

          <h3><strong>Коллекция:</strong></h3>

          <p>{{ seasonList }}</p>

          <h3><strong>Уход:</strong></h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>
        <div class="item__content" :class="{ 'active': isActive('delivery') }" id="delivery">
          <h3><strong>Доставка:</strong></h3>
          <p>1. Курьерская доставка по Москве и Московской области – 290 ₽<br />
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь
          </p>
          <h3><strong>Возврат:</strong></h3>
          <p>
            Любой возврат должен быть осуществлен в течение 30 дней с момента отгрузки. <br />
            Возвраты в магазине БЕСПЛАТНО.<br />
            Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы
            осуществили
            покупку.<br />
            БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br />
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90
            09
          </p>
        </div>
      </div>
    </section>
    </div>
  </main>
</template>

<script>

import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { mapActions } from 'vuex';
import ColorsSelector from '@/components/ColorsSelector.vue';
import SizeSelector from '@/components/SizeSelector.vue';
import AmountSelector from '@/components/AmountSelector.vue';
import Preloader from '@/components/Preloader.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  data () {
    return {
      productAmount: 1,
      productSizeId: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productColorId: this.$route.params.colorId || 0,
      productAdded: false,
      productAddSending: false,
      activeItem: 'info'
    }
  },
  filters: {
    numberFormat
  },

  components: { ColorsSelector, SizeSelector, AmountSelector, Preloader },

  metaInfo () {
    return {
      title: this.product?.title ? this.product?.title : 'Карточка товара' + ' / Moire'
    }
  },

  computed: {
    computedIndex: {
      get () {
        return this.currentSizeId
      },
      set (value) {
        this.$emit('update:currentSizeId', value)
      }
    },
    product () {
      return this.productData
    },
    category () {
      return this.productData?.category
    },
    materialList () {
      const matList = this.productData.materials.map((m) => m.title)
      return matList.join(', ')
    },
    seasonList () {
      const seasList = this.productData.seasons.map((s) => s.title)
      return seasList.join(', ')
    },
    productColor () {
      if (this.productColorId === 0) {
        return this.product.colors[0]
      }
      return this.product.colors.find(e => e.color.id === this.productColorId)
    },
    imageSrc () {
      if (this.productColor.gallery) {
        return this.productColor.gallery[0].file.url
      }
      return 'https://i.yapx.ru/VaZUj.png'
    },
    productSize () {
      if (this.productSizeId === 0) {
        return this.product.sizes[0]
      }
      return this.product.sizes.find(e => e.id === this.productSizeId)
    }
  },

  methods: {
    ...mapActions(['addProductToCart']),
    updateAmount (value) {
      this.productAmount = value
    },
    addToCart () {
      this.productAdded = false;
      this.productAddSending = true;

      this.$store.dispatch('addProductToCart', {
        quantity: this.productAmount,
        productId: this.product.id,
        colorId: this.productColorId,
        sizeId: this.productSizeId
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        })
        .catch(() => {
          this.productAddSending = true;
        })
    },
    incrementButton () {
      this.productAmount = this.productAmount + 1
    },
    decrementButton () {
      this.productAmount > 1 ? this.productAmount = this.productAmount - 1 : this.productAmount = 1
    },
    loadProduct () {
      this.productLoading = true

      clearTimeout(this.loadProductsTimer)
      this.loadProductsTimer = setTimeout(() => {
        axios.get(API_BASE_URL + '/api/products/' + this.$route.params.id)
          .then((response) => {
            this.productData = response.data
            if (this.productColorId === 0) {
              this.productColorId = this.productData.colors[0].color.id
            }
            this.productSizeId = this.productData.sizes[0].id
          })
          .catch(() => {
            this.productLoadingFailed = true
          })
          .then(() => { this.productLoading = false })
      }, 500)
    },
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    }
  },
  watch: {
    'this.$route.params.id': {
      handler () {
        this.loadProduct()
      },
      immediate: true
    }
  }
}
</script>
