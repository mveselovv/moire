<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <div class="content__row--second">
          <h1 class="content__title">
            Каталог
          </h1>
          <span class="content__info">
            <div>{{ countProducts }} {{ $declension(countProducts, ['товар', 'товара', 'товаров']) }}</div>
          </span>
        </div>
        <label class="select-per-page">
          <p>Показать товаров:</p>
          <select class="select-per-page__select" v-model="productsPerPage">
          <option value="3">3</option>
          <option value="6" selected>6</option>
          <option value="9">9</option>
        </select>
        </label>
      </div>
    </div>

    <div class="content__catalog">
        <ProductFilter :category-id.sync="filterCategoryId" @apply-filter="setFilter"/>
      <section class="catalog">
        <Preloader :loading="productsLoading" :text="`Загружаем каталог...`" v-show="productsLoading"/>
        <div class="loader__error" v-if="productsLoadingFailed">Кажется, что-то пошло не так &#128532;
          <button class="button button--second" @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>
        <ProductList :products="products" v-show="productData"/>
        <BasePagination v-model="page" v-if="countProducts > productsPerPage" :count="countProducts"
          :per-page="productsPerPage" @paginate="paginate" />
      </section>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import ProductList from '@/components/ProductList';
import ProductFilter from '@/components/ProductFilter';
import BasePagination from '@/components/BasePagination';
import Preloader from '@/components/Preloader';
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'MainPage',
  components: { ProductFilter, ProductList, BasePagination, Preloader },
  data () {
    return {
      filterMaterialIds: [],
      filterSeasonIds: [],
      filterColorIds: [],
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: this.$route.params.categoryId ? this.$route.params.categoryId : 0,
      page: 1,
      productsPerPage: 6,
      productData: null,
      productsLoading: false,
      productsLoadingFailed: false,
      activeItem: 'filters'
    }
  },
  metaInfo () {
    return {
      title: 'Главная страница / Moire'
    }
  },
  filters: {
    numberFormat
  },
  computed: {
    products () {
      return this.productData ? this.productData.items : []
    },
    countProducts () {
      return this.productData ? this.productData.pagination.total : 0
    }
  },
  watch: {
    productsPerPage () {
      this.loadProducts();
    }
  },
  methods: {
    paginate (page) {
      this.page = page
      this.loadProducts()
    },
    setFilter (p) {
      this.page = 1
      this.filterCategoryId = p.categoryId
      this.filterPriceFrom = p.priceFrom
      this.filterPriceTo = p.priceTo
      this.filterMaterialIds = p.materialIds
      this.filterSeasonIds = p.seasonIds
      this.filterColorIds = p.colorIds
      this.loadProducts()
    },
    loadProducts () {
      const params = {
        page: this.page,
        limit: this.productsPerPage,
        categoryId: this.filterCategoryId,
        minPrice: this.filterPriceFrom,
        maxPrice: this.filterPriceTo,
        materialIds: this.filterMaterialIds,
        seasonIds: this.filterSeasonIds,
        colorIds: this.filterColorIds,
      }
      this.productsLoading = true

      clearTimeout(this.loadProductsTimer)

      this.loadProductsTimer = setTimeout(() => {
        axios.get(API_BASE_URL + '/api/products', { params })
          .then((response) => {
            this.productData = response.data
          })
          .catch(() => {
            this.productsLoadingFailed = true
          })
          .then(() => {
             this.productsLoading = false
            })
      }, 500)
    },
  },
  created () {
    this.loadProducts()
  }
}
</script>
