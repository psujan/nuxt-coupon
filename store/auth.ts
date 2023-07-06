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
      const { data, pending }: any = await useFetch(
        "https://dummyjson.com/auth/login",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: {
            username,
            password,
          },
        }
      );
      this.loading = pending;

      if (data.value) {
        const token = useCookie("token"); // useCookie new hook in nuxt 3
        token.value = data?.value?.token; // set token to cookie
        const { firstName, lastName, email } = data?.value;
        this.user = {
          firstName,
          lastName,
          email,
        };
        this.authenticated = true; // set authenticated  state value to true
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
