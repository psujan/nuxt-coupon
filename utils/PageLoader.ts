import { useLoading } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const $loading = useLoading({
  loader: "dots",
  color: "#16bfba",
});

export default $loading;
