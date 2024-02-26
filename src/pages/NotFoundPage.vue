<template>
  <div class="not-page container">
    <div class="not-page__left">
      <h3><strong>404. Страница не найдена</strong></h3>
      <p>Возможно, она была перемещена, или вы просто неверно указали адрес страницы.</p>
    </div>
    <div class="not-page__right"></div>
    <router-link tag="button" :to="{name: 'main'}" class="button button--primery not-page__button">На главную</router-link>
  </div>
</template>

<script>
export default {
  metaInfo () {
    return {
      title: '404 - Страница не найдена / Moire'
    }
  }
}
</script>
