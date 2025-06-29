export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem("authUser")) || null,
    token: localStorage.getItem("authToken") || null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("authUser", JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("authToken", token);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    },

  },
  actions: {
    login({ commit }, { token, user }) {
      commit("setToken", token);
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("clearAuth");
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    userRole(state) {
      return state.user?.role ?? "customer";
    },
    userId(state) {
      return state.user?.id || null;
    },
    user(state) {
      return state.user;
    },
  },
};
