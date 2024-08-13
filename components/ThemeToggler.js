import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useDarkMode } from '~/hooks/useDarkMode';

const ThemeToggler = () => {
    const [isDarkMode, setIsDarkMode] = useDarkMode();

    return (
        <div className={`flex h-fit w-fit rounded-md border p-1 cursor-pointer dark:border-white border-slate-950`} onClick={() => setIsDarkMode(!isDarkMode)}>
            <button className='mr-2'>
                <SunIcon className={`h-6 w-6 border rounded-md p-1 shadow-slate-400 shadow-sm dark:shadow-none dark:text-white dark:bg-slate-950 dark:border-transparent text-slate-950 bg-white border-slate-950`} />
            </button>
            <button>
                <MoonIcon className={`h-6 w-6 border rounded-md p-1 shadow-none dark:shadow-white dark:shadow-sm dark:text-white dark:bg-slate-950 dark:border-white text-slate-950 bg-transparent border-transparent`} />
            </button>
        </div>
    )
}

export default ThemeToggler;