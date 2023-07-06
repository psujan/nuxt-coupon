<script setup>
import $loading from "../utils/PageLoader";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
const { authenticated } = storeToRefs(useAuthStore());
const { authenticateUser } = useAuthStore();

const props = defineProps({
  loginModal: {
    type: Boolean,
    default: false,
  },
});

//emits
const emit = defineEmits(["update:loginModal"]);

const FORM = {
  username: "",
  password: "",
};
//data
const form = reactive({
  ...FORM,
});

//computed properties
const showModal = computed({
  get() {
    return props.loginModal;
  },
  // setter
  set(newValue) {
    emit("update:loginModal", newValue);
  },
});

//methods
const handleSubmit = async () => {
  if (!validateLogin()) {
    return;
  }
  const spin = $loading.show();
  await authenticateUser(form);
  spin.hide();
  if (authenticated.value) {
    Notify.toast("Login Successfull");
    emit("update:loginModal", false);
    clearForm();
    return;
  }
  Notify.toast("Something Went Wrong", "error");
};

const clearForm = () => {
  form.username = "";
  form.password = "";
};

const validateLogin = () => {
  if (!form.username) {
    Notify.toast("Username is missing", "error");
    return false;
  }
  if (!form.password) {
    Notify.toast("Password is missing", "error");
    return false;
  }

  return true;
};
</script>

<template>
  <BaseModal
    v-model:modal="showModal"
    animation-name="slideDown"
    position="center"
    modal-title="Login"
    :width="450"
    :overlay-close="true"
    :allow-ok-close="false"
    ok-title="Submit"
    @onSuccess="handleSubmit"
    @onClose="clearForm"
  >
    <form @submit.prevent="handleSubmit">
      <div class="mb-5">
        <div class="py-2">
          <label
            for="_username"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Username</label
          >
          <input
            type="text"
            id="_username"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-200 focus:border-green-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="kminchelle"
            required
            v-model="form.username"
          />
        </div>
        <div class="py-2">
          <label
            for="_password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Password</label
          >
          <input
            type="password"
            id="_password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-200 focus:border-green-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="password"
            required
            v-model="form.password"
          />
        </div>
      </div>
    </form>
  </BaseModal>
</template>
