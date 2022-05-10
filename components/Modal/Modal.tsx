import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import styles from "./modal.module.scss";
import cn from "classnames";
import { IoLockOpenOutline } from "react-icons/io5";

const Modal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <Transition
      show={isModalOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        {/* <div className="fixed inset-0 bg-black/30" aria-hidden="true" /> */}

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 top-20 flex items-start justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel
            className={cn(
              `flex items-center justify-center w-[70%] h-[55vh] mx-auto rounded bg-white border border-gray`
            )}
          >
            <div className="flex items-start justify-center">
              <IoLockOpenOutline fontSize={150} className="mr-4" />
              <div className="text-left">
                <p className="font-bold tracking-tighter text-[56px] leading-none">
                  Nice one!
                </p>
                <p className="font-bold tracking-tighter text-[56px] leading-none mb-[1rem]">
                  All is saved
                </p>
                <button
                  className="px-[6rem] py-2 border border-gray"
                  onClick={() => setIsModalOpen(false)}
                >
                  OK
                </button>
              </div>
            </div>

            {/* ... */}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
