<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
const { authenticated, user } = storeToRefs(useAuthStore());
const { logUserOut } = useAuthStore();
const router = useRouter();
import { Dropdown } from "flowbite-vue";
//data
const loginModal = ref(false);

//methods
const openLoginModal = () => {
  loginModal.value = true;
};

const handleLogout = () => {
  logUserOut();
  router.push("/");
};
</script>

<template>
  <header class="bg-white rounded py-5 px-7">
    <div class="container mx-auto">
      <nav class="flex justify-between items-center">
        <div class="flex items-center space-x-3 lg:pr-16 pr-6">
          <NuxtLink to="/">
            <h2 class="font-semibold text-2xl leading-6 text-gray-800">
              <span class="text-primary">C</span><span>oupon</span>
            </h2>
          </NuxtLink>
        </div>

        <div class="flex space-x-5 justify-center items-center pl-2">
          <div class="d-flex" v-if="authenticated">
            <dropdown placement="bottom">
              <template #trigger="{ toggle }">
                <span @click="toggle" class="cursor-pointer">
                  <Icon name="ri:user-line" color="black" size="24" />
                  {{ user.firstName }}
                  <Icon
                    name="ri:arrow-drop-down-line"
                    color="black"
                    size="24"
                  />
                </span>
              </template>
              <ul class="w-48">
                <li class="hover:bg-gray-100 py-2 px-3">
                  <a
                    href="javascript:;"
                    @click="handleLogout"
                    class="text-base text-gray-500"
                    >Logout</a
                  >
                </li>
              </ul>
            </dropdown>
          </div>
          <button
            v-else
            @click="openLoginModal"
            class="bg-green-50 text-primary py-2 px-4 rounded-md text-sm ease-in hover:bg-emerald-100"
          >
            Sign In
          </button>
        </div>
      </nav>
    </div>
    <Login v-model:loginModal="loginModal"></Login>
  </header>
</template>
