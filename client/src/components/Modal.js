import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { HiXMark } from 'react-icons/hi2'

const Modal = ({ title, children, isOpen, setIsOpen }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full min-h-screen transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all space-y-8">
                <div className="flex items-center justify-between">
                  <h6 className="text-lg font-medium">{title}</h6>
                  <button type="button" variant="secondary" className="px-2 outline-none" onClick={() => setIsOpen(false)}>
                    <HiXMark className="text-2xl text-gray-600" />
                  </button>
                </div>
                <div>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
