import React, { useContext } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { AppContext } from 'src/store/context';

export default function ThemeSelectSwap() {
  const {
    state: { sessionState },
  } = useContext(AppContext);
  return (
    <label className="swap swap-rotate btn-circle btn btn-ghost">
      <input type="checkbox" />
      <SunIcon className="swap-on w-6 h-6" />
      <MoonIcon className="swap-off w-6 h-6" />
    </label>
  );
}
