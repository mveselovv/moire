<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="(color, index) in colors" :key="index">
      <label class="colors__label">
        <input class="colors__radio sr-only" type="radio" v-model="computedValue" :value="color.color.id">
        <span class="colors__value" :style="`background-color: ${color.color.code}`"></span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ColorSelector',
  props: ['colors', 'currentColorId'],
  computed: {
    computedValue: {
      get () {
        return this.currentColorId
      },
      set (value) {
        this.$emit('update:currentColorId', value)
      }
    }
  }
}
</script>
