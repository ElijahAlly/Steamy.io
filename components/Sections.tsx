import { sections } from "@/donotcommit";
import { SectionType } from "@/types/section";
import { FunctionComponent, useState } from "react";
import Section from "./Section";

interface SectionsProps {}

export interface SectionsDragObj { 
    [key: number]: {
        [key: number]: boolean
    } 
}

const Sections: FunctionComponent<SectionsProps> = () => {
    const [activeSections, setActiveSections] = useState(sections.active);
    const [draggedSection, setDraggedSection] = useState<SectionsDragObj>({}); // { <rowIndex>: { <colIndex>: boolean, <colIndex: boolean }, <rowIndex>: { ... } }
    const [isDraggingOver, setIsDraggingOver] = useState<SectionsDragObj>({});

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
        console.log('in findTrueIndex')
        console.log(draggedSection)
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

        setActiveSections(newSections);
        handleSetAllIsDraggingToFalse();
        setDraggedSection({});
        setIsDraggingOver({});
    };
    
    return (
        <div className="relative h-full w-full pb-40">
            {activeSections.map((section: SectionType[], rowIndex: number) => {
                return (
                    <div key={rowIndex} className="flex flex-col md:flex-row w-full h-fit max-h-fit my-0 md:my-3 md:px-2">
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
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default Sections;
