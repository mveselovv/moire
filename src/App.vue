<template>
  <div>
    <header class="header container">
      <div class="header__wrapper">
        <span class="header__info">Каталог</span>

        <router-link class="header__logo" :to="{name: 'main'}">
          <svg width="116" height="34">
            <use xlink:href="#logotype"></use>
          </svg>
        </router-link>

        <a class="header__tel" href="tel:+79203883488">
          7 920 388 34 88
        </a>

        <CartIndicator />
      </div>
    </header>
    <router-view />
    <footer class="footer container">
      <div class="footer__wrapper">
        <ul class="footer__links">
          <li>
            <a class="footer__link" href="#">
              Каталог
            </a>
          </li>
          <li>
            <a class="footer__link" href="tel:88006009009">
              7 920 388 34 88
            </a>
          </li>
          <li>
            <a class="footer__link" href="mlvmisha@gmail.com">
              mlvmisha@gmail.com
            </a>
          </li>
          <li>
            <a class="footer__link" href="#">
              Распродажа
            </a>
          </li>
          <li>
            <a class="footer__link footer__link--medium" href="#">
              Заказать звонок
            </a>
          </li>
        </ul>

        <ul class="footer__social social">
          <li class="social__item">
            <a class="social__link" href="#" aria-label="Вконтакте">
              <svg width="20" height="11" fill="currentColor">
                <use xlink:href="#vk"></use>
              </svg>
            </a>
          </li>
          <li class="social__item">
            <a class="social__link" href="#" aria-label="Инстаграм">
              <svg width="17" height="17" fill="currentColor">
                <use xlink:href="#instagram"></use>
              </svg>
            </a>
          </li>
          <li class="social__item">
            <a class="social__link" href="#" aria-label="Facebook">
              <svg width="17" height="17" fill="currentColor">
                <use xlink:href="#facebook"></use>
              </svg>
            </a>
          </li>
          <li class="social__item">
            <a class="social__link" href="#" aria-label="Twitter">
              <svg width="17" height="14" fill="currentColor">
                <use xlink:href="#twitter"></use>
              </svg>
            </a>
          </li>
          <li class="social__item">
            <a class="social__link" href="#" aria-label="Telegram">
              <svg width="19" height="17" fill="currentColor">
                <use xlink:href="#telegram"></use>
              </svg>
            </a>
          </li>
        </ul>

        <p class="footer__desc">
          Данный сайт сделан Веселовым Михаилом в рамках дипломного проекта.<br/>
          Сайт не является интернет-магазином, создан в демонстрационных целях.
        </p>

        <ul class="footer__data">
          <li>
            <router-link class="footer__link" :to="{name: 'privacy'}">
              Политика конфиденциальности
            </router-link>
          </li>
          <li>
            <router-link class="footer__link" :to="{name: 'public'}">
              Публичная оферта
            </router-link>
          </li>
        </ul>

        <span class="footer__copyright">
          © 2023 Moire
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import CartIndicator from '@/components/CartIndicator.vue'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: { CartIndicator },
  created () {
    const userAccessKey = localStorage.getItem('userAccessKey')
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey)
    }
    this.loadCart()
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey'])
  }
}
</script>
