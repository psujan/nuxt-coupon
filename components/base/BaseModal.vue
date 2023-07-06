<template>
  <Transition name="modal-fade">
    <div
      :class="['modal-dialog', modal ? 'modal-dialog-active' : '', modalClass]"
      v-show="modal"
      @click="handleOverlayClick"
    >
      <div :class="['modal-wrap', computedPositionClass]">
        <Transition :name="`modal-${animationName}`">
          <div
            :class="[modalContentClass]"
            v-show="modal"
            :style="{ width: width + 'px' }"
          >
            <template v-if="useModalHeader">
              <div
                class="modal-header"
                :class="[modalHeaderClass]"
                :style="{ padding: modalTitle ? '1rem' : '0.8rem' }"
              >
                <h4 class="modal-title">
                  <span v-if="modalTitle">{{ modalTitle }}</span>
                </h4>
                <button
                  @click="closeModal"
                  v-if="showCloseIcon"
                  class="modal-close-btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                  >
                    <path
                      d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"
                    />
                  </svg>
                </button>
              </div>
            </template>
            <slot name="modal-header" />
            <div class="modal-body">
              <slot />
            </div>
            <div class="modal-footer" v-if="useModalFooter">
              <button class="modal-btn modal-btn-flat" @click="closeModal">
                Cancel
              </button>
              <button class="modal-btn" @click="onOk">{{ okTitle }}</button>
            </div>
            <slot name="modal-footer" />
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from "vue";
/**
 * props
 */
const props = defineProps({
  overlayClose: {
    type: Boolean,
    default: true,
  },
  modalTitle: {
    type: String,
    default: "",
  },
  modal: {
    type: Boolean,
    default: true,
  },
  useModalHeader: {
    type: Boolean,
    default: true,
  },
  useModalFooter: {
    type: Boolean,
    default: true,
  },
  showCloseIcon: {
    type: Boolean,
    default: true,
  },
  modalHeaderClass: {
    type: String,
    required: false,
  },
  modalContentClass: {
    type: String,
    required: false,
    default: "modal-content",
  },
  modalClass: {
    type: String,
    required: false,
  },
  width: {
    type: Number,
    default: 600,
  },
  animationName: {
    type: String,
    default: "slideDown",
  },
  position: {
    type: String,
    default: "center",
  },
  allowOkClose: {
    type: Boolean,
    default: true,
  },
  okTitle: {
    type: String,
    default: "Ok",
  },
});
/**
 * constants
 */
const positionClass = {
  center: "modalCenter",
  topCenter: "modalTopCenter",
  topLeft: "modalTopLeft",
  topRight: "modalTopRight",
  bottomLeft: "modalBottomLeft",
  bottomCenter: "modalBottomCenter",
  bottomRight: "modalBottomRight",
};
/**
 * emits
 */
const emit = defineEmits(["onClose", "onSuccess", "update:modal"]);
/**
 * computed properties
 */
const computedPositionClass = computed(() => {
  return positionClass[props.position];
});
/**
 * functions
 */
const closeModal = () => {
  emit("update:modal", false);
  emit("onClose");
};

const onOk = () => {
  if (props.allowOkClose) {
    closeModal();
    return;
  }
  emit("onSuccess");
};

const overlayClose = (event) => {
  if (event.target.className.includes("modal-wrap") && props.overlayClose) {
    return true;
  }
  return false;
};
const handleOverlayClick = (event) => {
  if (overlayClose(event)) {
    closeModal();
  }
  return false;
};
</script>

<style scoped>
.modal-btn {
  padding: 8px 16px;
  font-size: 0.9375rem;
  background-color: #16bfba;
  border-radius: 6px;
  transition: 0.35s ease-in;
  color: #fff;
  min-width: 120px;
}

.modal-btn:hover {
  background-color: #31c48d;
}
.modal-btn-flat {
  color: inherit;
  background-color: #f7f7f7;
}

.modal-btn-flat:hover {
  background-color: #eceaea !important;
}
.modal-dialog {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  outline: none;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.3);
}
.modal-dialog-active {
  pointer-events: auto;
}
.modal-header,
.modal-body,
.modal-footer {
  padding: 0.6rem 1rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
}
.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}
.modal-title span {
  font-size: inherit;
  font-weight: inherit;
}
.modal-close-btn {
  background: #fff;
  outline: none;
  border-radius: 50%;
  border: 0;
  font-size: 1.5rem;
  width: 1.8rem;
  height: 1.8rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-close-btn:hover {
  background-color: #f1f4f3;
}
.modal-container {
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.modal-footer button {
  margin: 0 6px;
}
@media (max-width: 768px) {
  .modal-content {
    max-width: 600px;
  }
}
@media (max-width: 500px) {
  .modal-content {
    max-width: 450px;
    margin: 0 10px;
  }
}
/**Modal Transitions */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
/**Effect : Zoom */
.modal-zoom-enter-active {
  animation: zoom 0.3s ease-in-out;
}
.modal-zoom-leave-active {
  animation: zoom 0.3s ease-in-out reverse;
}

@keyframes zoom {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
/**Effect : Slide Down */
.modal-slideDown-enter-from {
  transform: translateY(-100px);
}
.modal-slideDown-enter-to {
  transform: translateY(0);
}
.modal-slideDown-enter-active {
  transition: transform 0.3s ease-in-out;
}
.modal-slideDown-leave-from {
  transform: translateY(0);
}
.modal-slideDown-leave-to {
  transform: translateY(-100px);
}
.modal-slideDown-leave-active {
  transition: transform 0.3s ease-in-out;
}

/**Effect : Slide Up */
.modal-slideUp-enter-from {
  transform: translateY(100px);
}
.modal-slideUp-enter-to {
  transform: translateY(0);
}
.modal-slideUp-enter-active {
  transition: transform 0.3s ease-in-out;
}
.modal-slideUp-leave-from {
  transform: translateY(0);
}
.modal-slideUp-leave-to {
  transform: translateY(100px);
}
.modal-slideUp-leave-active {
  transition: transform 0.3s ease-in-out;
}

/**Effect : Slide Left */
.modal-slideLeft-enter-from {
  transform: translateX(-100px);
}
.modal-slideLeft-enter-to {
  transform: translateX(0);
}
.modal-slideLeft-enter-active {
  transition: transform 0.3s ease-in-out;
}
.modal-slideLeft-leave-from {
  transform: translateX(0);
}
.modal-slideLeft-leave-to {
  transform: translateX(-100px);
}
.modal-slideLeft-leave-active {
  transition: transform 0.3s ease-in-out;
}

/**Effect : Slide Right */
.modal-slideRight-enter-from {
  transform: translateX(100px);
}
.modal-slideRight-enter-to {
  transform: translateX(0);
}
.modal-slideRight-enter-active {
  transition: transform 0.3s ease-in-out;
}
.modal-slideRight-leave-from {
  transform: translateX(0);
}
.modal-slideRight-leave-to {
  transform: translateX(100px);
}
.modal-slideRight-leave-active {
  transition: transform 0.3s ease-in-out;
}
</style>

<style>
.modalCenter {
  justify-content: center;
  align-items: center;
}
.modalTopLeft {
  justify-content: start !important;
  align-items: flex-start !important;
}
.modalTopCenter {
  justify-content: center !important;
  align-items: flex-start !important;
}
.modalTopRight {
  justify-content: end !important;
  align-items: flex-start !important;
}
.modalBottomLeft {
  justify-content: start;
  align-items: flex-end;
}
.modalBottomCenter {
  justify-content: center;
  align-items: flex-end;
}
.modalBottomRight {
  justify-content: end;
  align-items: flex-end;
}
.modal-wrap {
  display: flex;
  width: 100vw;
  height: 100%;
}
.modal-content {
  position: relative;
  width: 800px;
  background: #fff;
  border-radius: 6px;
  z-index: inherit;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 12px 0px;
}
</style>
