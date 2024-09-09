import { SectionType, Tab } from "@/types/section";
import { ArrowDownIcon, ArrowUpIcon, MoveIcon } from "@radix-ui/react-icons";
import { DragEvent, FunctionComponent, useEffect, useState } from "react";
import { SectionsDragObj } from "./Sections";

const CollapseIcon: React.FC<any> = ({ className, ...props }) => (
    <div title="collapse section" className={`relative flex items-center justify-center w-7 h-7 hover:text-cyan-500 ${className}`} {...props}>
        <ArrowDownIcon className="absolute transform -rotate-45 top-0 left-0" />
        <ArrowDownIcon className="absolute transform rotate-45 top-0 right-0" />
        <ArrowUpIcon className="absolute transform -rotate-45 bottom-0 right-0" />
        <ArrowUpIcon className="absolute transform rotate-45 bottom-0 left-0" />
    </div>
);

interface SectionProps {
    section: SectionType;
    rowIndex: number;
    colIndex: number;
    isDraggingOverSections: SectionsDragObj;
    showShadow: boolean;
    draggedSection: SectionsDragObj;
    handleSetIsDragging: (rowIndex: number, colIndex: number, bool: boolean) => void;
    handleSetIsDraggingOver: (rowIndex: number, colIndex: number, bool: boolean) => void;
    handleDragStart: (rowIndex: number, colIndex: number) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (rowIndex: number, colIndex: number) => void;
    setShowShadow: (bool: boolean) => void;
}

const Section: FunctionComponent<SectionProps> = ({
  section,
  rowIndex,
  colIndex,
  isDraggingOverSections,
  draggedSection,
  handleSetIsDragging,
  handleSetIsDraggingOver,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setShowShadow,
  showShadow
}: SectionProps) => {
    const isDragging = draggedSection[rowIndex]?.[colIndex] || false;
    const isDraggingOver = isDraggingOverSections[rowIndex]?.[colIndex] || false;
    const [activeTab, setActiveTab] = useState<Tab | null>(null);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    useEffect(() => {
        section.tabs.map(tab => {
            if (tab.selected) setActiveTab(tab);
        })
    }, [rowIndex, colIndex])

    useEffect(() => {
        const shadow = document.getElementById(`shadow-${rowIndex}-${colIndex}`) as HTMLDivElement;
        if (shadow) {
            // Add an event listener for mouse movement
            document.addEventListener('mousemove', (event: MouseEvent) => {
                // Get the mouse position
                const mouseX = event.clientX;
                const mouseY = event.clientY;

                // Update the shadow position
                shadow.style.left = `${mouseX}px`;
                shadow.style.top = `${mouseY}px`;
            });

            // Optional: Change the shadow color on mouse click
            document.addEventListener('mousedown', () => {
                shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            });

            document.addEventListener('mouseup', () => {
                shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            });
        }
    }, [showShadow])

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        // console.log('in drag over')
        handleDragOver(e); 
        setShowShadow(true);
        handleSetIsDraggingOver(rowIndex, colIndex, true);
    }

    const onDrop = () => {
        // console.log('onDrop in on section', { rowIndex, colIndex })
        handleDrop(rowIndex, colIndex);
    }

    const onDragEnd = () => {
        setShowShadow(false);
    }

    const onDragLeave = () => {
        handleSetIsDraggingOver(rowIndex, colIndex, false);
        setShowShadow(true);
    }

    const onDragStart = () => {
        setShowShadow(true);
        handleDragStart(rowIndex, colIndex);
        handleSetIsDragging(rowIndex, colIndex, true);
    }

    // console.log(showShadow)
    return (
        <div
            className={`relative select-none overflow-y-hidden max-h-fit ${isCollapsed ? 'w-full md:w-fit' : 'w-full max-w-1/2'} my-2 md:my-0 md:mx-2 border border-white rounded-md ${isDragging || isDraggingOver ? 'opacity-35' : 'opacity-100'} ${isDraggingOver ? 'border-cyan-500' : 'border-white'}`}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
        >
            {showShadow && (
                <div id={`shadow-${rowIndex}-${colIndex}`} className="h-96 w-96 bg-cyan-500 opacity-75 pointer-events-none">
                    <p>shadow</p>
                </div>
            )}
            <div className={`w-full flex items-center justify-between h-12 border-b ${isDraggingOver ? 'border-cyan-500' : 'border-white'} px-2`}>
                <div className='flex items-center'>
                    <div title="move section" draggable onDragStart={onDragStart}>
                        <MoveIcon className='hidden md:block cursor-move ml-1 text-cyan-500' />
                    </div>
                    <p className='mx-3 min-w-fit text-nowrap'>
                        {section.title}
                    </p>
                </div>
                <div className={`flex ${isCollapsed ? 'justify-end' : 'justify-end'} min-w-20`}>
                    {!isCollapsed && (
                        <CollapseIcon onClick={() => setIsCollapsed(true)} className='select-none cursor-pointer' />
                    )}
                </div>
            </div>
            {isCollapsed ? (
                <div
                    title="expand section"
                    className='select-none cursor-pointer w-full h-full min-h-24 flex flex-col items-center justify-center py-3 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800'
                    onClick={() => setIsCollapsed(false)}
                >
                </div>
            ) : (
                <div className='h-inherit w-full overflow-hidden'>
                    <div className='w-full flex p-2 overflow-x-auto hover:shadow-lg hover:shadow-slate-900'>
                        {section.tabs.map((tab, i: number) => (
                            <div
                                key={i}
                                className={`text-nowrap select-none w-fit mx-1 p-1 cursor-pointer border border-white rounded-lg ${activeTab && activeTab.name === tab.name ? 'bg-slate-100 text-slate-950' : 'text-white bg-inherit hover:bg-slate-900 '}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.name}
                            </div>
                        ))}
                    </div>
                    <div className='overflow-y-auto max-h-96 pb-12'>
                        <div className='mt-3 p-3 flex flex-col'>
                            {activeTab?.domains?.map((domain, i) => (
                                <p key={i} className='text-white m-3'>{domain}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Section;