<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="number" name="min-price" min="0" v-model.number="filterPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="number" name="max-price" min="0" v-model.number="filterPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" type="text" name="category" v-model.number="filterCategoryId">
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">
              {{ category.title }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors colors--black">
          <li class="colors__item" v-for="(color, index) in colors" :key="index">
            <label class="colors__label">
              <input class="colors__radio sr-only" type="checkbox" v-model="filterColorIds" :value="color.id">
              <span :class="{'cart__order--white' : color.code === '#ffffff'}" class="colors__value" :style="`background-color: ${color.code}`"></span>
            </label>
          </li>
        </ul>
      </fieldset>

      <div class="form__block--mobile">
        <fieldset class="form__block">
          <legend class="form__legend">Материал</legend>
          <CheckboxSelector :options.sync="materials" :initial.sync="filterMaterialIds" @options-changed="fixMaterials" />
        </fieldset>
        <fieldset class="form__block">
          <legend class="form__legend">Коллекция</legend>
          <CheckboxSelector :options.sync="seasons" :initial.sync="filterSeasonIds" @options-changed="fixSeasons" />
        </fieldset>
      </div>

      <div class="form__block--mobile--btn">
        <button class="filter__submit button button--primery" type="submit" @click.prevent="submit">
          Применить
        </button>
        <button v-show="filtersAll" class="filter__reset button button--second" type="button" @click.prevent="reset">
          Сбросить
        </button>
      </div>
    </form>
  </aside>
</template>

<script>
import api from '@/api/api';
import CheckboxSelector from '@/components/CheckboxSelector.vue';

export default {
  name: 'ProductFilter',
  components: { CheckboxSelector },
  props: ['categoryId'],
  data () {
    return {
      filterMaterialIds: [],
      filterSeasonIds: [],
      filterColorIds: [],
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: this.categoryId,
      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null
    }
  },
  computed: {
    categories () {
      return this.categoriesData ? this.categoriesData.items : []
    },
    colors () {
      return this.colorsData ? this.colorsData.items : []
    },
    materials () {
      return this.materialsData ? this.materialsData.items : []
    },
    seasons () {
      return this.seasonsData ? this.seasonsData.items : []
    },
    filtersAll () {
      return this.filterMaterialIds.length !== 0 || this.filterSeasonIds.length !== 0 || this.filterColorIds.length !== 0 || this.filterPriceFrom !== 0 && this.filterPriceFrom !== '' || this.filterPriceTo !== 0 && this.filterPriceTo !== '' || this.filterCategoryId !== 0
    }
  },
  methods: {
    fixMaterials (value) {
      this.filterMaterialIds = value;
    },
    fixSeasons (value) {
      this.filterSeasonIds = value
    },
    fixColorNumber (value) {
      this.filterColorIds = value
    },
    submit () {
      this.$emit('apply-filter', {
        categoryId: this.filterCategoryId,
        priceFrom: this.filterPriceFrom,
        priceTo: this.filterPriceTo,
        materialIds: this.filterMaterialIds,
        seasonIds: this.filterSeasonIds,
        colorIds: this.filterColorIds
      })
    },
    reset () {
      this.filterCategoryId = 0
      this.filterPriceFrom = 0
      this.filterPriceTo = 0
      this.filterMaterialIds = []
      this.filterSeasonIds = []
      this.filterColorIds = []
      this.submit()
    },
    async loadCategories () {
      const response = await api.loadCategories();
        this.categoriesData = response.data;
    },
    async loadColors () {
      const response = await api.loadColors();
        this.colorsData = response.data;
    },
    async loadSeasons () {
      const response = await api.loadSeasons();
        this.seasonsData = response.data
    },
    async loadMaterials () {
      const response = await api.loadMaterials();
        this.materialsData = response.data
    },
  },
  created () {
    this.loadCategories()
    this.loadColors()
    this.loadSeasons()
    this.loadMaterials()
  },
}
</script>
