<template>
  <div class="product__counter form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="decrease">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="number" v-model.number.lazy="amount" min="1" step="1" name="count">

    <button type="button" aria-label="Добавить один товар" @click.prevent="increase">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AmountSelector',
  props: ['value'],
  data () {
    return {
      amount: this.value
    }
  },
  watch: {
    amount () {
      if (this.amount === '' || this.amount === 0) {
        this.amount = 1
      }
      this.$emit('update-amount', Math.trunc(this.amount))
    }
  },
  methods: {
    decrease () {
      if (this.amount > 1) {
        this.amount -= 1
      }
    },
    increase () {
      this.amount += 1
    }
  }
}
</script>
