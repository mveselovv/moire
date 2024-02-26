<template>
    <label class="form__label form__label--small form__label--select">
        <select class="form__select" v-model="computedIndex">
            <option v-for="size in sizes" :key="size.id" :value="size.id">{{ size.title }}</option>
        </select>
    </label>
</template>

<script>
export default {
  props: ['sizes', 'currentSizeId'],
  computed: {
    computedIndex: {
      get () {
        return this.currentSizeId
      },
      set (value) {
        this.$emit('update:currentSizeId', value)
      }
    }
  }
}
</script>
