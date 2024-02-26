<template>
  <ul class="check-list">
      <li class="check-list__item" v-for="option in options" :key="option.id">
          <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" :value="option.id"
                     v-model="optionIds">
              <span class="check-list__desc">
                  {{ option.title }}
                  <span>({{ option.productsCount }})</span>
                </span>
          </label>
      </li>
  </ul>
</template>

<script>
export default {
  name: 'CheckboxSelector',
  data () {
    return {
      optionIds: this.initial
    }
  },
  props: ['options', 'initial'],
  watch: {
    initial (value) {
      this.optionIds = value
    },
    optionIds (value) {
      this.$emit('options-changed', value)
    }
  }
}
</script>
