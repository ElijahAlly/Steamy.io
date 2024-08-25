import { SectionType } from "@/types/section";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import Section from "./Section";
import { chunkArray } from "@/util/sections";
import UserContext from "@/lib/UserContext";

interface SectionsProps {
    channelSections: SectionType[];
    channelsLengthIsZero: boolean;
    isOnSteamyChannel: boolean;
}

export interface SectionsDragObj { 
    [key: number]: {
        [key: number]: boolean
    }
}

const Sections: FunctionComponent<SectionsProps> = ({ channelSections, channelsLengthIsZero, isOnSteamyChannel }) => {
    const [activeSections, setActiveSections] = useState<SectionType[][]>([]);
    const [draggedSection, setDraggedSection] = useState<SectionsDragObj>({}); // { <rowIndex>: { <colIndex>: boolean, <colIndex: boolean }, <rowIndex>: { ... } }
    const [isDraggingOver, setIsDraggingOver] = useState<SectionsDragObj>({});
    const [showShadow, setShowShadow] = useState<boolean>(false);
    const [shouldSetLogoutTimer, setShouldLogoutTimer] = useState<boolean>(channelsLengthIsZero && !isOnSteamyChannel);
    const [shouldLogout, setShouldLogout] = useState<boolean>(false);
    const { signOut } = useContext(UserContext);

    shouldSetLogoutTimer && setTimeout(() => setShouldLogout(true), 900);
    shouldLogout && signOut();

    const handleDragStart = (rowIndex: number, colIndex: number) => {
        // console.log('is Dragging', { ...draggedSection, [rowIndex]: { [colIndex]: true}})
        setDraggedSection({ 
            [rowIndex]: {
                [colIndex]: true
            }
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const findTrueIndex = (): { fromRow: number, fromCol: number } | { fromRow: null, fromCol: null} => {
        // console.log('in findTrueIndex')
        // console.log(draggedSection)
        for (const rowIndex in draggedSection) {
            // console.log('rowIndex', rowIndex);
            const row = draggedSection[rowIndex];
            for (const colIndex in row) {
                // console.log('colIndex', colIndex);
                if (row[colIndex]) {
                    return {
                        fromRow: parseInt(rowIndex),
                        fromCol: parseInt(colIndex)
                    };
                }
            }
        }
        return { fromRow: null, fromCol: null }; // Return null if no strue value is found
    }

    const handleSetAllIsDraggingToFalse = () => {
        const newDraggedSection = { ...draggedSection}
        for (const rowIndex in newDraggedSection) {
            if (newDraggedSection.hasOwnProperty(rowIndex)) {
            const row = newDraggedSection[rowIndex];
                for (const colIndex in row) {
                    if (row.hasOwnProperty(colIndex)) {
                        row[colIndex] = false;
                    }
                }
            }
        }
        setDraggedSection(newDraggedSection); // Return null if no strue value is found
    }

    const handleSetIsDragging = (rowIndex: number, colIndex: number, bool: boolean) => {
        if (!draggedSection[rowIndex]) {
            draggedSection[rowIndex] = { [colIndex]: bool };
        } else {
            draggedSection[rowIndex][colIndex] = bool;
        }
        setDraggedSection(draggedSection); 
    }

    const handleSetIsDraggingOver = (rowIndex: number, colIndex: number, bool: boolean) => {
        const newIsDraggingOver = { ...isDraggingOver };
        if (!newIsDraggingOver[rowIndex]) {
            newIsDraggingOver[rowIndex] = { [colIndex]: bool };
        } else {
            newIsDraggingOver[rowIndex][colIndex] = bool;
        }
        // console.log('newIsDraggingOver', newIsDraggingOver)
        setIsDraggingOver(newIsDraggingOver); 
    }

    const handleDrop = (rowIndex: number, colIndex: number) => {
        const { fromRow, fromCol } = findTrueIndex();
        if (fromRow === null || fromCol === null) return;

        const newSections = [...activeSections];
        const temp = newSections[fromRow][fromCol];
        newSections[fromRow][fromCol] = newSections[rowIndex][colIndex];
        newSections[rowIndex][colIndex] = temp;

        setShowShadow(false);
        setActiveSections(newSections);
        handleSetAllIsDraggingToFalse();
        setDraggedSection({});
        setIsDraggingOver({});
    };

    useEffect(() => {
        setActiveSections(chunkArray(channelSections, 2)); // add to local state by broadcaster login so the chunk only has to happen once
    }, [channelSections])

    return (
        <div className="relative h-full max-w-full pb-40 overflow-y-auto overflow-x-hidden">
            {(channelsLengthIsZero && !isOnSteamyChannel) ? (
                <div className='flex flex-col items-center justify-center h-full w-full bg-cyan-800 opacity-75 select-none py-96'>
                    <div className='h-96 w-full'></div>
                    <p className='text-white text-md'>
                        Checking access...
                    </p>
                    <div className='hidden md:block h-96 w-full'></div>
                </div>
            ) : (
                <>
                    <div className='flex m-3 w-full overflow-x-auto'>
                        {/* // TODO: Add actions: collapse/expand all, ... */}
                        <p className='mx-2 md:mx-3'>(actions_here)</p>
                    </div>
                    {activeSections.map((section: SectionType[], rowIndex: number) => {
                        return (
                            // TODO: Add move row functionality
                            <div key={rowIndex} className="flex flex-col md:flex-row max-w-full h-fit max-h-fit my-0 md:my-3" data-swapy-slot={`${rowIndex}`}>
                                {section.map((curSection: SectionType, colIndex: number) => (
                                    <Section
                                        key={`${rowIndex}-${colIndex}`}
                                        section={curSection}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        handleDragStart={handleDragStart}
                                        handleDragOver={handleDragOver}
                                        handleDrop={handleDrop}
                                        isDraggingOverSections={isDraggingOver}
                                        handleSetIsDraggingOver={handleSetIsDraggingOver}
                                        draggedSection={draggedSection}
                                        handleSetIsDragging={handleSetIsDragging}
                                        setShowShadow={setShowShadow}
                                        shiwShadow={showShadow}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default Sections;
