<script setup>
import { Dropdown, ListGroup, ListGroupItem } from "flowbite-vue";
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col lg:flex-row flex-col-reverse p-3 lg:p-8">
      <div class="flex-1">
        <h1 class="font-bold text-3xl mb-3">
          Welcome , <span class="text-primary">Sujan</span>
        </h1>
        <p class="text-gray-500">
          An easy to use web portal to access your digital coupons
        </p>
        <div class="py-10">
          <NuxtLink
            to="/coupons"
            class="flex justify-center lg:inline w-100 d-block text-white bg-primary hover:bg-green-400 ease-in focus:outline-none font-medium rounded-full text-sm px-10 py-3 text-center"
          >
            View Coupons
          </NuxtLink>
        </div>
      </div>
      <div class="flex-1">
        <figure>
          <img
            src="/images/promotion.jpg"
            alt="PROMO"
            style="max-width: 100%"
          />
        </figure>
      </div>
    </div>
  </div>
</template>
