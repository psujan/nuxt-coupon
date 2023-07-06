import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const token = useCookie("token"); // get token from cookies
  if (!token.value) {
    abortNavigation();
    Notify.toast("Please Login First","error");
    return navigateTo("/");
  }
});
