import React, { useState, useEffect, ElementType } from 'react'
import SectionsContext from '@/lib/SectionsContext'

interface SectionsProviderProps {
    Component: ElementType;
    pageProps: any;
}

export default function SectionsProvider({ Component, pageProps }: SectionsProviderProps) {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        // setSections([])
    }, [])

    return (
        <SectionsContext.Provider
            value={{
            }}
        >
            <Component { ...pageProps } />
        </SectionsContext.Provider>
    )
}