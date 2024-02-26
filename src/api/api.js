import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  async loadOrderInfo(context, orderId) {
    const response = await axios.get(API_BASE_URL + '/api/orders/' + orderId, {
      params: {
        userAccessKey: context.state.userAccessKey
      }
    })
    return response;
  },

  async loadCart(context) {
    const response = axios.get(API_BASE_URL + '/api/baskets', {
      params: {
        userAccessKey: context.state.userAccessKey
      }
    })
    return response;
  },

  async addProductToCart(context, { productId, colorId, sizeId, quantity }) {
    await (new Promise(resolve => setTimeout(resolve, 500)))
    const response = axios.post(API_BASE_URL + '/api/baskets/products', {productId, colorId, sizeId, quantity}, {
      params: {
        userAccessKey: context.state.userAccessKey
      }
    })
    return response;
  },

  async updateCartProductAmount(context, { basketItemId, quantity }) {
    const response = axios.put(API_BASE_URL + '/api/baskets/products', { basketItemId, quantity }, {
      params: {
        userAccessKey: context.state.userAccessKey
      }
    })
    return response;
  },

  async deleteCartProduct(context, basketItemId) {
    const response = await axios.delete(API_BASE_URL + '/api/baskets/products', {
      params: {
        userAccessKey: context.state.userAccessKey
      },
      data: { basketItemId }
    }, {})
    return response;
  },

  async loadDeliveries() {
    const response = await axios.get(API_BASE_URL + '/api/deliveries');
    return response;
  },

  async loadPayments(deliveryTypeId) {
    const response = await axios.get(API_BASE_URL + '/api/payments', {
      params: { deliveryTypeId }
    })
    return response;
  },

  async loadCategories() {
    const response = await axios.get(API_BASE_URL + '/api/productCategories')
    return response;
  },

  async loadColors() {
    const response = await axios.get(API_BASE_URL + '/api/colors')
    return response;
  },

  async loadSeasons() {
    const response = await axios.get(API_BASE_URL + '/api/seasons')
    return response;
  },

  async loadMaterials() {
    const response = await axios.get(API_BASE_URL + '/api/materials');
    return response;
  },
}
