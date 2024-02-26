export default {

  install: (Vue) => {
    Vue.prototype.$declension = function (num, words) {
      const cases = [2, 0, 1, 1, 1, 2]
      return words[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]]
    }

    Vue.filter('declension', function (num, wordsText) {
      const cases = [2, 0, 1, 1, 1, 2]
      return wordsText[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]]
    })
  }

}
