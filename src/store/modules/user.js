import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    phone: "",
    role:""
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone;
  },
  SET_ROLE: (state, role) => {
    state.role = role;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ phone: username.trim(), pwd: password })
        .then(response => {
          const  {data}  = response;
          // console.log(data);

          // 验证登录成功
          // if (data.jwt) {
            commit("SET_TOKEN", data.jwt);
            setToken(data.jwt);
            resolve();
          // } else {
          //   reject(data.msg);
          // }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const  {data}  = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { phone,role,realname } = data;
          // console.log(data);
          commit("SET_PHONE", phone);
          commit("SET_ROLE", role);
          commit("SET_NAME", realname);
          // commit('SET_AVATAR', avatar)
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
   logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      resolve();
      // }).catch(error => {
      //   reject(error)
      // })
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
