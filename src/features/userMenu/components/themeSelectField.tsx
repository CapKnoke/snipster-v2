import React, { Fragment, Dispatch, SetStateAction } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { themeOptions } from '../utils/userMenuUtils';
import { DesktopComputerIcon, MoonIcon, SunIcon } from '@heroicons/react/outline';

type SelectFieldProps = {
  selected: typeof themeOptions[number];
  setSelected: Dispatch<SetStateAction<typeof themeOptions[number]>>;
};

export default function ThemeSelectField({ selected, setSelected }: SelectFieldProps) {
  return (
    <Listbox as="div" value={selected} onChange={setSelected} className="text-sm flex-grow">
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
          <span className="flex items-center gap-2">
            {selected === 'Dark' && <MoonIcon className="h-4 w-4" />}
            {selected === 'Light' && <SunIcon className="h-4 w-4" />}
            {selected === 'System' && <DesktopComputerIcon className="h-4 w-4" />}
            {selected}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {themeOptions.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-gray-700 text-white' : 'text-gray-100'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
