<script setup>
import Notify from "../utils/Notify";
import $loading from "../utils/PageLoader";
import BaseModal from "../components/base/BaseModal.vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { ref, watch } from "vue";

const coupons = ref("");
const confirmModal = ref(false);
const succModal = ref(false);
//fetch
const { data: couponItems } = await useFetch("/api/coupons");

// functions
const copyToClipboard = async (code) => {
  try {
    await toClipboard(code).then((res) => {
      Notify.toast(`Code Copied To Clipboard :  ${res.text}`);
    });
  } catch (e) {
    console.error(e);
  }
};
const openConfirmModal = () => {
  const spin = $loading.show();
  setTimeout(() => {
    spin.hide();
    confirmModal.value = true;
  }, 500);
};
const handleRedeem = () => {
  confirmModal.value = false;
  const spin = $loading.show();
  setTimeout(() => {
    spin.hide();
    succModal.value = true;
  }, 500);
};
//watchers
watch(
  couponItems,
  (newData) => {
    const spin = $loading.show();
    if (newData && newData.coupons) {
      coupons.value = newData.coupons;
    }
    setTimeout(() => {
      spin.hide();
    }, 500);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="min-h-screen bg-gray-100 screen">
    <div class="md:container mx-auto">
      <div class="md:px-5 sm:px-1 flex">
        <div class="basis-1/5">
          <figure>
            <img src="/images/side-cover.png" alt="" />
          </figure>
        </div>
        <div
          class="basis-4/5 bg-slate-50 rounded-md mt-12 relative sm:p-2 md:px-6 md:py-3 lg:w-4/5 sm:w-auto"
        >
          <span
            class="title absolute left-4 px-4 py-2 bg-primary text-white text-sm"
            ><h3 class="font-semibold">
              <span class="pl-1">1250 Rewward Points</span>
            </h3></span
          >
          <div class="mt-10" v-if="coupons && coupons.length">
            <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-5">
              <div
                v-for="(row, i) in coupons"
                :key="i"
                class="border rounded-md mx-3 lg:mx-0 mb-3 sm:p-2 bg-white"
              >
                <div class="flex p-3">
                  <Icon
                    name="ri:coupon-4-line"
                    size="36"
                    color="#d5b3fe"
                  ></Icon>

                  <div class="pl-3 flex-1 relative">
                    <div class="flex justify-between">
                      <h5 class="text-sky-700 font-semibold">
                        {{ row.title }}
                      </h5>
                      <span
                        class="p-1 text-xs text-purple-500 font-medium bg-gray-100"
                        ><Icon name="ri:trophy-line" size="12"></Icon
                        >{{ row.rp }}RP</span
                      >
                    </div>
                    <div>
                      <span class="text-xs text-gray-500"
                        >Satrts On : {{ row.start }} |</span
                      >
                      <span class="text-xs text-gray-500 pl-1"
                        >Ends On : {{ row.end }}</span
                      >
                    </div>
                    <div class="mt-1">
                      <a
                        href="javascript:;"
                        @click="openConfirmModal(row.id)"
                        class="py-1 px-2 ease-in rounded-md text-underline bg-emerald-50 text-sm text-primary"
                        >Redeem for {{ row.rp }} RP
                        <Icon
                          name="ri:arrow-right-s-line"
                          size="16"
                          color="#16bfba"
                        ></Icon
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BaseModal
      v-model:modal="confirmModal"
      animation-name="zoom"
      position="center"
      :width="450"
      :overlay-close="true"
      :allow-ok-close="false"
      @onSuccess="handleRedeem"
    >
      <div>
        <div style="width: 180px" class="flex justify-center mx-auto">
          <img
            src="/images/confirmation.jpeg"
            alt=""
            style="max-width: 100%; height: 140px"
          />
        </div>
        <div class="text-center mb-3">
          <h5 class="font-semibold mb-1">Confirm Redeem</h5>
          <p class="text-sm">500RP will be deducted from your account</p>
        </div>
      </div>
    </BaseModal>
    <BaseModal
      v-model:modal="succModal"
      animation-name="zoom"
      position="center"
      modal-title="Successful"
      :width="450"
      :overlay-close="true"
    >
      <div>
        <div style="width: 180px" class="flex justify-center mx-auto">
          <img
            src="/images/success.jpeg"
            alt=""
            style="max-width: 100%; height: 140px"
          />
        </div>
        <div class="text-center mb-3">
          <div class="pb-2">
            <p class="text-sm">
              500RP has been successfully redeemed. Please use
              <span class="text-primary font-semibold">GC89E4</span> as promo
              code
            </p>
          </div>
          <div class="pb-2 flex justify-center text-center">
            <span
              title="Copy Code"
              class="cursor-pointer w-16 h-16 p-2 justify-center flex items-center rounded-full hover:bg-gray-100"
              @click="copyToClipboard('GA50C89')"
            >
              <Icon name="ri:file-copy-line" size="24" color="#ff6161"></Icon>
            </span>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.title {
  top: -18px;
  /* padding: 6px 12px; */
  border-radius: 30px;
}
</style>
