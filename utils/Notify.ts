import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const Notify = {
  toast: (message = "Successful", toastType = "success") => {
    const type = toastType == "success" ? toast.TYPE.SUCCESS : toast.TYPE.ERROR;
    toast(message, {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
      type: type,
    });
  },
};

export default Notify;
