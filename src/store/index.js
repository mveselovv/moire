import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/api'

Vue.use(Vuex)

new Vuex.Store()

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo
    },

    resetCart(state) {
      state.cartProducts = []
      state.cartProductsData = []
    },

    updateCartProductAmount(state, {
      basketItemId,
      quantity
    }) {
      const item = state.cartProducts.find((x) => {
        return x.id === basketItemId
      })
      if (item) {
        item.quantity = quantity
      }
    },

    deleteCartProduct(state, basketItemId) {
      state.cartProducts = state.cartProducts.filter(item => item.productId !== basketItemId)
    },

    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey
    },

    updateCartProductsData(state, items) {
      state.cartProductsData = items
    },

    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        itemId: item.id,
        productId: item.product.id,
        colorId: item.color.color.id,
        sizeId: item.size.id,
        quantity: item.quantity
      }))
    }
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const cartItem = state.cartProductsData.find((p) => p.id === item.itemId)
        return {
          ...item,
          product: cartItem.product,
          size: cartItem.size,
          color: cartItem.color
        }
      })
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
    }
  },
  actions: {
    async loadOrderInfo(context, orderId) {
      const response = await api.loadOrderInfo(context, orderId);
      context.commit('updateOrderInfo', response.data);
    },

    async loadCart(context) {
      const response = await api.loadCart(context);
      if (!context.state.userAccessKey) {
        localStorage.setItem('userAccessKey', response.data.user.accessKey);
        context.commit('updateUserAccessKey', response.data.user.accessKey);
      }
      context.commit('updateCartProductsData', response.data.items);
      context.commit('syncCartProducts');
    },

    async addProductToCart(context, { productId, colorId, sizeId, quantity }) {
      const response = await api.addProductToCart(context, { productId, colorId, sizeId, quantity })
      context.commit('updateCartProductsData', response.data.items)
      context.commit('updateUserAccessKey', response.data.user.accessKey)
      context.commit('syncCartProducts')
    },

    async updateCartProductAmount(context, { basketItemId, quantity }) {
      context.commit('updateCartProductAmount', { basketItemId, quantity })
      try {
        const response = await api.updateCartProductAmount(context, { basketItemId, quantity })
        context.commit('updateCartProductsData', response.data.items)
        context.commit('syncCartProducts')
      } catch {
        context.commit('syncCartProducts')
      }
    },

    async deleteCartProduct(context, basketItemId) {
      context.commit('deleteCartProduct');
      const response = await api.deleteCartProduct(context, basketItemId);
      context.commit('updateCartProductsData', response.data.items);
      context.commit('syncCartProducts');
    }
  }
})
