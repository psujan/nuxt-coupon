<script setup>
import { Dropdown } from "flowbite-vue";
import Notify from "../utils/Notify";
import $loading from "../utils/PageLoader";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
const coupons = ref("");
const rows = reactive({
  data: [],
  filterType: "All",
});
const row = ref("");
const confirmModal = ref(false);
const succModal = ref(false);
//fetch
const { data: couponItems } = await useFetch("/api/coupons");

//computed properties
const computedRewardPoint = computed(() => {
  return coupons.value
    .filter((x) => !x.isRedeemed)
    .reduce((acc, item) => {
      return acc + item.rp;
    }, 0);
});
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
const openConfirmModal = (item) => {
  row.value = item;
  confirmModal.value = true;
};

const handleRedeem = (item) => {
  confirmModal.value = false;
  const spin = $loading.show();
  const temp = coupons.value;
  coupons.value = temp.map((x) => {
    return {
      ...x,
      isRedeemed: x.id == item.id ? 1 : x.isRedeemed,
    };
  });
  filterList(rows.filterType);
  setTimeout(() => {
    spin.hide();
    succModal.value = true;
  }, 500);
};

const showSpinner = () => {
  const spin = $loading.show();
  setTimeout(() => {
    spin.hide();
  }, 500);
};

const clearRow = () => {
  row.value = "";
};

const filterList = (type) => {
  showSpinner();
  if (type == "active") {
    rows.data = coupons.value.filter((x) => !x.isRedeemed);
    rows.filterType = "Active";
    return;
  }

  if (type == "redeemed") {
    rows.data = coupons.value.filter((x) => x.isRedeemed);
    rows.filterType = "Redeemed";
    return;
  }

  rows.data = coupons.value;
  rows.filterType = "All";
};
//watchers
watch(
  couponItems,
  (newData) => {
    const spin = $loading.show();
    if (newData && newData.coupons) {
      coupons.value = newData.coupons;
      rows.data = coupons.value;
    }
    setTimeout(() => {
      spin.hide();
    }, 500);
  },
  {
    immediate: true,
  }
);

//head
useHead({
  titleTemplate: `Coupons | ${computedRewardPoint.value || "0"} RP`,
});

definePageMeta({
  middleware: "auth", 
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 screen">
    <div class="md:container mx-auto">
      <div class="md:px-5 sm:px-1 flex">
        <div class="hidden lg:block basis-1/5 relative">
          <figure class="sticky">
            <img src="/images/side-cover.png" alt="" />
          </figure>
        </div>
        <div
          class="lg:basis-4/5 bg-slate-50 rounded-md mt-12 relative sm:p-2 md:px-6 md:py-3 lg:w-4/5 sm:w-auto"
        >
          <span
            class="title absolute left-4 px-4 py-2 bg-primary text-white text-sm"
            ><h3 class="font-semibold">
              <span class="pl-1">{{ computedRewardPoint }} Rewward Points</span>
            </h3></span
          >
          <div class="pt-6 pb-4 px-3 mt-2 lg:px-0 lg:mt-0 border-b">
            <div class="flex justify-between">
              <div class="min-w-[20px]">
                <h4
                  class="text-base text-center p-2 d-inline-block rounded-md text-primary bg-gray-100"
                >
                  {{ rows.filterType }} ({{ rows.data.length }})
                </h4>
              </div>
              <div>
                <dropdown placement="left">
                  <template #trigger="{ toggle }">
                    <span @click="toggle" class="cursor-pointer" title="Filter">
                      <Icon name="ri:filter-3-fill" color="#16bf" size="28" />
                    </span>
                  </template>
                  <ul class="w-48">
                    <li class="hover:bg-gray-100 py-2 px-3">
                      <a
                        href="javascript:;"
                        @click="filterList('all')"
                        class="text-base text-gray-500"
                        >All</a
                      >
                    </li>
                    <li class="hover:bg-gray-100 py-2 px-3">
                      <a
                        href="javascript:;"
                        @click="filterList('active')"
                        class="text-base text-gray-500"
                        >Active</a
                      >
                    </li>
                    <li class="hover:bg-gray-100 py-2 px-3">
                      <a
                        href="javascript:;"
                        @click="filterList('redeemed')"
                        class="text-base text-gray-500"
                        >Redeemed</a
                      >
                    </li>
                  </ul>
                </dropdown>
              </div>
            </div>
          </div>
          <div class="mt-5" v-if="rows.data.length">
            <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-5">
              <div
                v-for="(row, i) in rows.data"
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
                      <button
                        v-if="!row.isRedeemed"
                        @click="openConfirmModal(row)"
                        class="py-1 px-2 ease-in rounded-md text-underline bg-emerald-50 text-sm text-primary"
                      >
                        Redeem for {{ row.rp }} RP
                        <Icon
                          name="ri:arrow-right-s-line"
                          size="16"
                          color="#16bfba"
                        ></Icon>
                      </button>
                      <button
                        v-else
                        @click="copyToClipboard(row.afterRedeem.code)"
                        class="py-1 px-2 ease-in rounded-md text-underline bg-red-100 text-sm text-red-500"
                      >
                        Code : {{ row.afterRedeem.code }}
                      </button>
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
      @onSuccess="handleRedeem(row)"
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
          <p class="text-sm">
            {{ row ? row.rp : "" }}RP will be deducted from your account
          </p>
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
      @onClose="clearRow"
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
              {{ row.rp + "RP" }} has been successfully redeemed. Please use
              <span class="text-primary font-semibold">{{
                row ? row.afterRedeem.code : ""
              }}</span>
              as promo code
            </p>
          </div>
          <div class="pb-2 flex justify-center text-center">
            <span
              title="Copy Code"
              class="cursor-pointer w-16 h-16 p-2 justify-center flex items-center rounded-full hover:bg-gray-100"
              @click="copyToClipboard(row.afterRedeem.code)"
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
