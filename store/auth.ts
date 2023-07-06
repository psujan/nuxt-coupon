import { defineStore } from "pinia";

interface UserPayloadInterface {
  username: string;
  password: string;
}

const USER = {
  firstName: "",
  lastName: "",
  email: "",
};

/**
 * Dummy login endpoint
 */
const LOGIN_ENDPOINT = "https://dummyjson.com/auth/login";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
    user: {
      ...USER,
    },
  }),
  actions: {
    async authenticateUser({ username, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      const { data, pending }: any = await useFetch(LOGIN_ENDPOINT, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: {
          username,
          password,
        },
      });
      this.loading = pending;

      if (data.value) {
        const token = useCookie("token");
        token.value = data?.value?.token; // set token to cookie
        const { firstName, lastName, email } = data?.value;
        this.user = {
          firstName,
          lastName,
          email,
        };
        this.authenticated = true;
      }
    },
    logUserOut() {
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
      this.user = {
        ...USER,
      };
    },
  },
  persist: true,
});
