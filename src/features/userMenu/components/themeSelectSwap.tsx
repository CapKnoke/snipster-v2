import React, { Dispatch, SetStateAction, ChangeEventHandler } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';

type SelectFieldProps = {
  theme: 'Light' | 'Dark';
  setTheme: Dispatch<SetStateAction<'Light' | 'Dark'>>;
};

export default function ThemeSelectSwap({ theme, setTheme }: SelectFieldProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTheme(e.target.checked ? 'Light' : 'Dark');
  }
  return (
    <label className="swap swap-rotate btn-circle btn btn-ghost">
      <input type="checkbox" onChange={handleChange} checked={theme === 'Light'} />
      <SunIcon className="swap-on w-6 h-6" />
      <MoonIcon className="swap-off w-6 h-6" />
    </label>
  );
}
