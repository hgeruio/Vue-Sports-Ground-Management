import { createStore } from 'vuex'
export default createStore({
  state: {
    isCollapse: true,
    currentMenu: null,
    userValue: '',
    isLogin: '0',
    // token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
  },
  mutations: {
    updateIsCollapse (state, payload) {
      state.isCollapse = !state.isCollapse
    },
    updateUser (state, val) {
      state.userValue = val
    },
    setToken (state, value) { // ���ô洢token
      state.token = value
      console.log(state.token)
      localStorage.setItem('token', value)
    },
    removeStorage (state, value) {  // ɾ��token
      localStorage.removeItem('token')
    },
  },

})