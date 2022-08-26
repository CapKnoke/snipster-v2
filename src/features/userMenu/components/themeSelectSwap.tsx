import { Dispatch, SetStateAction, ChangeEventHandler } from 'react';
import { themeOptions } from '../utils/userMenuUtils';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';

type SelectFieldProps = {
  theme: 'Light' | 'Dark';
  setTheme: Dispatch<SetStateAction<'Light' | 'Dark'>>;
};

export default function ThemeSelectSwap({ theme, setTheme }: SelectFieldProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.checked);
  }
  return (
    <label className="swap swap-rotate btn-circle btn btn-ghost">
      <input type="checkbox" onChange={handleChange} />
      <SunIcon className="swap-on fill-current w-6 h-6" />
      <MoonIcon className="swap-off fill-current w-6 h-6" />
    </label>
  );
}
