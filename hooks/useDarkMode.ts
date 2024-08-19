import { useEffect, useState } from 'react';

export function useDarkMode(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    useEffect(() => {
        const htmlEle = document.getElementsByTagName('html')[0];
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            htmlEle.style.backgroundColor = '#020617';
        } else {
            document.documentElement.classList.remove('dark');
            htmlEle.style.backgroundColor = '#fff';
        }
    }, [isDarkMode]);

    return [isDarkMode, setIsDarkMode];
}