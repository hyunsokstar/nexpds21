// 'use client'

// import React, { useRef, useState, useEffect } from 'react';
// import { useTabActions, useTabSelectors } from '@/features/tabs/store/useTabStore';
// import VisualTabForTabBar from '../component/VisualTabForTabBar';
// import { Split, X, Columns2, Columns3, Columns4 } from 'lucide-react';

// interface TabBarProps {
//     panelId?: string;
// }

// const TabBar = ({ panelId = 'main' }: TabBarProps) => {
//     const { getPanelTabs, getActivePanelTab, isSplitView, getPanels } = useTabSelectors();
//     const { activateTabInPanel, closeTab, splitView, unsplitView, moveTabToPanel, reorderTabsInPanel } = useTabActions();

//     const tabs = getPanelTabs(panelId);
//     const activeTab = getActivePanelTab(panelId);
//     const isSplit = isSplitView();
//     const panels = getPanels();

//     // 디버깅을 위한 탭 상태 로깅
//     useEffect(() => {
//         console.log(`Panel ${panelId} tabs:`, tabs.map(t => t.name));
//     }, [tabs, panelId]);

//     // 드래그 앤 드롭 관련 상태
//     const draggedTabId = useRef<string | null>(null);
//     const draggedTabIndex = useRef<number>(-1);
//     const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);


//     // 드래그 시작 핸들러
//     const handleDragStart = (e: React.DragEvent, tabId: string, index: number) => {
//         console.log('드래그 시작:', { tabId, index, panelId });
        
//         draggedTabId.current = tabId;
//         draggedTabIndex.current = index;
        
//         // 드래그 이미지와 데이터 설정
//         if (e.dataTransfer) {
//             e.dataTransfer.setData('text/plain', tabId); // 기본 포맷 데이터 추가
//             e.dataTransfer.setData('application/tab-id', tabId);
//             e.dataTransfer.setData('application/source-panel', panelId);
//             e.dataTransfer.setData('application/source-index', String(index));
//             e.dataTransfer.effectAllowed = 'move';
            
//             // 드래그 고스트 이미지 설정
//             const tab = tabs.find(t => t.id === tabId);
//             if (tab) {
//                 const ghostElement = document.createElement('div');
//                 ghostElement.textContent = tab.name;
//                 ghostElement.style.padding = '5px 10px';
//                 ghostElement.style.background = '#e2f8f6';
//                 ghostElement.style.border = '1px dashed #0d9488';
//                 ghostElement.style.borderRadius = '4px';
//                 ghostElement.style.position = 'absolute';
//                 ghostElement.style.top = '-1000px';
//                 document.body.appendChild(ghostElement);
                
//                 e.dataTransfer.setDragImage(ghostElement, 0, 0);
                
//                 // 고스트 요소 정리
//                 setTimeout(() => {
//                     document.body.removeChild(ghostElement);
//                 }, 0);
//             }
//         }
//     };

//     // 드래그 오버 핸들러 - 패널에 대한 처리
//     const handleDragOver = (e: React.DragEvent) => {
//         e.preventDefault(); // 중요: 드롭을 허용하기 위해 기본 동작 방지
//         if (e.dataTransfer) {
//             e.dataTransfer.dropEffect = 'move';
//         }
//     };
    
//     // 드래그 오버 핸들러 - 탭에 대한 처리
//     const handleTabDragOver = (e: React.DragEvent, tabId: string, index: number) => {
//         e.preventDefault(); // 중요: 드롭을 허용하기 위해 기본 동작 방지
//         setDragOverTabId(tabId);
//         console.log('드래그 오버:', { tabId, index, currentDraggedId: draggedTabId.current });
        
//         if (e.dataTransfer) {
//             e.dataTransfer.dropEffect = 'move';
//         }
//     };
    
//     // 드래그 리브 핸들러 - 탭에 대한 처리
//     const handleTabDragLeave = (e: React.DragEvent) => {
//         setDragOverTabId(null);
//     };

//     // 드롭 핸들러 - 패널에 대한 처리
//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault();
//         setDragOverTabId(null);
        
//         try {
//             console.log('패널 드롭 - 가능한 데이터 타입:', e.dataTransfer.types);
            
//             const sourceTabId = e.dataTransfer.getData('application/tab-id');
//             const sourcePanelId = e.dataTransfer.getData('application/source-panel');
            
//             console.log('패널 드롭:', { sourceTabId, sourcePanelId, targetPanelId: panelId });
            
//             if (sourceTabId) {
//                 // 다른 패널로 이동하는 경우
//                 if (sourcePanelId !== panelId) {
//                     moveTabToPanel(sourceTabId, panelId);
//                 }
//                 draggedTabId.current = null;
//                 draggedTabIndex.current = -1;
//             }
//         } catch (error) {
//             console.error('드롭 처리 중 오류:', error);
//         }
//     };
    
//     // 드롭 핸들러 - 탭에 대한 처리
//     const handleTabDrop = (e: React.DragEvent, targetTabId: string, targetIndex: number) => {
//         e.preventDefault();
//         e.stopPropagation(); // 이벤트 버블링 방지
//         setDragOverTabId(null);
        
//         try {
//             console.log('탭 드롭 - 가능한 데이터 타입:', e.dataTransfer.types);
            
//             // dataTransfer에서 데이터 가져오기 시도
//             let sourceTabId: string;
//             let sourcePanelId: string;
//             let sourceIndex: number;
            
//             // 먼저 ref에서 시도
//             if (draggedTabId.current && draggedTabIndex.current >= 0) {
//                 sourceTabId = draggedTabId.current;
//                 sourcePanelId = panelId;
//                 sourceIndex = draggedTabIndex.current;
//                 console.log('ref에서 가져온 드래그 데이터:', { sourceTabId, sourceIndex });
//             } else {
//                 // dataTransfer에서 시도
//                 sourceTabId = e.dataTransfer.getData('application/tab-id');
//                 sourcePanelId = e.dataTransfer.getData('application/source-panel');
//                 const sourceIndexStr = e.dataTransfer.getData('application/source-index');
//                 sourceIndex = sourceIndexStr ? parseInt(sourceIndexStr, 10) : -1;
//                 console.log('dataTransfer에서 가져온 드래그 데이터:', { sourceTabId, sourceIndex, sourceIndexStr });
//             }
            
//             console.log('탭 드롭 처리:', {
//                 sourceTabId,
//                 sourcePanelId,
//                 sourceIndex,
//                 targetTabId,
//                 targetIndex,
//                 currentPanelId: panelId
//             });
            
//             if (sourceTabId && targetTabId) {
//                 // 다른 패널로 이동하는 경우
//                 if (sourcePanelId !== panelId) {
//                     console.log('다른 패널로 탭 이동:', { sourceTabId, targetPanelId: panelId });
//                     moveTabToPanel(sourceTabId, panelId);
//                 } 
//                 // 같은 패널 내에서 순서 변경
//                 else if (sourceIndex !== targetIndex) {
//                     console.log('같은 패널 내 탭 순서 변경:', {
//                         panelId,
//                         sourceIndex,
//                         targetIndex,
//                         sourceName: tabs[sourceIndex]?.name,
//                         targetName: tabs[targetIndex]?.name
//                     });
                    
//                     // 순서 변경 함수 직접 호출
//                     reorderTabsInPanel(panelId, sourceIndex, targetIndex);
//                     console.log('reorderTabsInPanel 호출 후 상태');
//                 }
//             }
            
//             // 참조 초기화
//             draggedTabId.current = null;
//             draggedTabIndex.current = -1;
            
//         } catch (error) {
//             console.error('탭 드롭 처리 중 오류:', error);
//         }
//     };
    
//     return (
//         <div
//             className="flex border-b border-gray-100 bg-white"
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//         >
//             {/* 탭 목록 */}
//             <div className="flex flex-1 overflow-x-auto">
//                 {tabs.map((tab, index) => (
//                     <div
//                         key={tab.id}
//                         draggable={true}
//                         onDragStart={(e) => handleDragStart(e, tab.id, index)}
//                         onDragOver={(e) => handleTabDragOver(e, tab.id, index)}
//                         onDragLeave={handleTabDragLeave}
//                         onDrop={(e) => handleTabDrop(e, tab.id, index)}
//                         className={
//                             dragOverTabId === tab.id
//                                 ? "border-2 border-teal-500 rounded-sm"
//                                 : ""
//                         }
//                     >
//                         <VisualTabForTabBar
//                             id={tab.id}
//                             name={tab.name}
//                             icon={tab.icon}
//                             isActive={activeTab?.id === tab.id}
//                             closable={tab.closable}
//                             onClick={() => activateTabInPanel(tab.id, panelId)}
//                             onClose={closeTab}
//                         />
//                         {/* 디버깅용: 순서 버튼 */}
//                         <span style={{ position: 'absolute', top: '0', right: '0', fontSize: '8px' }}>{index}</span>
//                     </div>
//                 ))}
//             </div>

//             {/* 디버깅 버튼 */}
//             {/* <button 
//                 onClick={testReordering} 
//                 style={debugButtonStyle}
//                 title="첫 번째와 두 번째 탭의 순서를 바꿉니다."
//             >
//                 순서테스트
//             </button> */}

//             {/* 분할 버튼 (메인 패널 또는 첫 번째 패널에만 표시) */}
//             {(panelId === 'main' || panelId === 'panel-0') && (
//                 <div className="flex items-center border-l px-1">
//                     {isSplit ? (
//                         <button
//                             className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
//                             onClick={unsplitView}
//                             title="분할 해제"
//                         >
//                             <X size={16} />
//                         </button>
//                     ) : (
//                         <>
//                             <button
//                                 className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
//                                 onClick={() => splitView(2)}
//                                 title="2열 분할"
//                             >
//                                 <Columns2 size={16} />
//                             </button>
//                             <button
//                                 className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
//                                 onClick={() => splitView(3)}
//                                 title="3열 분할"
//                             >
//                                 <Columns3 size={16} />
//                             </button>
//                             <button
//                                 className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
//                                 onClick={() => splitView(4)}
//                                 title="4열 분할"
//                             >
//                                 <Columns4 size={16} />
//                             </button>
//                         </>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TabBar;

'use client'

import React, { useRef, useState, useEffect } from 'react';
import { useTabActions, useTabSelectors } from '@/features/tabs/store/useTabStore';
import VisualTabForTabBar from '../component/VisualTabForTabBar';
import { ChevronLeft, ChevronRight, X, Columns2, Columns3, Columns4 } from 'lucide-react';

interface TabBarProps {
    panelId?: string;
}

const TabBar = ({ panelId = 'main' }: TabBarProps) => {
    const { getPanelTabs, getActivePanelTab, isSplitView, getPanels } = useTabSelectors();
    const { activateTabInPanel, closeTab, splitView, unsplitView, moveTabToPanel, reorderTabsInPanel } = useTabActions();

    const tabs = getPanelTabs(panelId);
    const activeTab = getActivePanelTab(panelId);
    const isSplit = isSplitView();
    const panels = getPanels();

    // 스크롤 관련 상태 및 참조
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(false);

    // 드래그 앤 드롭 관련 상태
    const draggedTabId = useRef<string | null>(null);
    const draggedTabIndex = useRef<number>(-1);
    const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

    // 스크롤 상태 업데이트
    const updateScrollButtons = () => {
        if (tabsContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
            setShowLeftScroll(scrollLeft > 1); // 약간의 여유를 두어 정확하게 감지
            setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1); // 약간의 여유를 두어 정확하게 감지
        }
    };

    // 컴포넌트 마운트 및 탭 변경 시 스크롤 상태 업데이트
    useEffect(() => {
        updateScrollButtons();
        
        // 리사이즈 이벤트 감지
        const handleResize = () => {
            updateScrollButtons();
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [tabs]);

    // 스크롤 이벤트 감지
    useEffect(() => {
        const container = tabsContainerRef.current;
        if (container) {
            const handleScroll = () => {
                updateScrollButtons();
            };
            
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    // 활성 탭이 변경될 때 해당 탭으로 스크롤
    useEffect(() => {
        if (activeTab && tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            const activeTabElement = container.querySelector(`[data-tab-id="${activeTab.id}"]`);
            
            if (activeTabElement) {
                const tabRect = activeTabElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                // 활성 탭이 컨테이너 밖에 있는 경우 스크롤
                if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                    activeTabElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
            }
        }
    }, [activeTab]);

    // 왼쪽으로 스크롤
    const scrollLeft = () => {
        if (tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            const scrollAmount = container.clientWidth * 0.75; // 컨테이너 너비의 75%만큼 스크롤
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    // 오른쪽으로 스크롤
    const scrollRight = () => {
        if (tabsContainerRef.current) {
            const container = tabsContainerRef.current;
            const scrollAmount = container.clientWidth * 0.75; // 컨테이너 너비의 75%만큼 스크롤
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // 스크롤바를 숨기는 CSS 스타일
    const hideScrollbarStyle = {
        scrollbarWidth: 'none' as const, /* Firefox */
        msOverflowStyle: 'none' as const, /* IE and Edge */
    };

    // 스크롤바를 숨기는 추가 CSS 스타일 (Chrome, Safari, Opera용)
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // 드래그 시작 핸들러
    const handleDragStart = (e: React.DragEvent, tabId: string, index: number) => {
        console.log('드래그 시작:', { tabId, index, panelId });
        
        draggedTabId.current = tabId;
        draggedTabIndex.current = index;
        
        // 드래그 이미지와 데이터 설정
        if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', tabId); // 기본 포맷 데이터 추가
            e.dataTransfer.setData('application/tab-id', tabId);
            e.dataTransfer.setData('application/source-panel', panelId);
            e.dataTransfer.setData('application/source-index', String(index));
            e.dataTransfer.effectAllowed = 'move';
            
            // 드래그 고스트 이미지 설정
            const tab = tabs.find(t => t.id === tabId);
            if (tab) {
                const ghostElement = document.createElement('div');
                ghostElement.textContent = tab.name;
                ghostElement.style.padding = '5px 10px';
                ghostElement.style.background = '#e2f8f6';
                ghostElement.style.border = '1px dashed #0d9488';
                ghostElement.style.borderRadius = '4px';
                ghostElement.style.position = 'absolute';
                ghostElement.style.top = '-1000px';
                document.body.appendChild(ghostElement);
                
                e.dataTransfer.setDragImage(ghostElement, 0, 0);
                
                // 고스트 요소 정리
                setTimeout(() => {
                    document.body.removeChild(ghostElement);
                }, 0);
            }
        }
    };

    // 드래그 오버 핸들러 - 패널에 대한 처리
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // 중요: 드롭을 허용하기 위해 기본 동작 방지
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
    };
    
    // 드래그 오버 핸들러 - 탭에 대한 처리
    const handleTabDragOver = (e: React.DragEvent, tabId: string, index: number) => {
        e.preventDefault(); // 중요: 드롭을 허용하기 위해 기본 동작 방지
        setDragOverTabId(tabId);
        
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
    };
    
    // 드래그 리브 핸들러 - 탭에 대한 처리
    const handleTabDragLeave = (e: React.DragEvent) => {
        setDragOverTabId(null);
    };

    // 드롭 핸들러 - 패널에 대한 처리
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverTabId(null);
        
        try {
            const sourceTabId = e.dataTransfer.getData('application/tab-id');
            const sourcePanelId = e.dataTransfer.getData('application/source-panel');
            
            if (sourceTabId) {
                // 다른 패널로 이동하는 경우
                if (sourcePanelId !== panelId) {
                    moveTabToPanel(sourceTabId, panelId);
                }
                draggedTabId.current = null;
                draggedTabIndex.current = -1;
            }
        } catch (error) {
            console.error('드롭 처리 중 오류:', error);
        }
    };
    
    // 드롭 핸들러 - 탭에 대한 처리
    const handleTabDrop = (e: React.DragEvent, targetTabId: string, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 버블링 방지
        setDragOverTabId(null);
        
        try {
            // dataTransfer에서 데이터 가져오기 시도
            let sourceTabId: string;
            let sourcePanelId: string;
            let sourceIndex: number;
            
            // 먼저 ref에서 시도
            if (draggedTabId.current && draggedTabIndex.current >= 0) {
                sourceTabId = draggedTabId.current;
                sourcePanelId = panelId;
                sourceIndex = draggedTabIndex.current;
            } else {
                // dataTransfer에서 시도
                sourceTabId = e.dataTransfer.getData('application/tab-id');
                sourcePanelId = e.dataTransfer.getData('application/source-panel');
                const sourceIndexStr = e.dataTransfer.getData('application/source-index');
                sourceIndex = sourceIndexStr ? parseInt(sourceIndexStr, 10) : -1;
            }
            
            if (sourceTabId && targetTabId) {
                // 다른 패널로 이동하는 경우
                if (sourcePanelId !== panelId) {
                    moveTabToPanel(sourceTabId, panelId);
                } 
                // 같은 패널 내에서 순서 변경
                else if (sourceIndex !== targetIndex) {
                    console.log('같은 패널 내 탭 순서 변경:', {
                        panelId,
                        sourceIndex,
                        targetIndex,
                        sourceName: tabs[sourceIndex]?.name,
                        targetName: tabs[targetIndex]?.name
                    });
                    
                    // 순서 변경 함수 직접 호출
                    reorderTabsInPanel(panelId, sourceIndex, targetIndex);
                }
            }
            
            // 참조 초기화
            draggedTabId.current = null;
            draggedTabIndex.current = -1;
            
        } catch (error) {
            console.error('탭 드롭 처리 중 오류:', error);
        }
    };

    // 탭이 없을 때는 안내 메시지 표시
    if (tabs.length === 0) {
        return (
            <div 
                className="border-b border-gray-100 p-2 text-center text-gray-500 text-sm bg-white"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {isSplit ? '탭을 이곳으로 드래그하세요.' : '상단 메뉴를 클릭하여 탭을 추가하세요.'}
            </div>
        );
    }

    return (
        <div 
            className="flex border-b border-gray-100 bg-white"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* 왼쪽 스크롤 버튼 */}
            {showLeftScroll && (
                <button
                    onClick={scrollLeft}
                    className="flex items-center justify-center min-w-8 bg-white border-r border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label="왼쪽으로 스크롤"
                >
                    <ChevronLeft size={16} />
                </button>
            )}

            {/* 탭 목록 (스크롤 가능) */}
            <div 
                ref={tabsContainerRef}
                className="flex flex-1 overflow-x-auto hide-scrollbar"
                style={hideScrollbarStyle}
                onScroll={updateScrollButtons}
            >
                {tabs.map((tab, index) => (
                    <div
                        key={tab.id}
                        data-tab-id={tab.id}
                        className={`flex-shrink-0 ${
                            dragOverTabId === tab.id
                                ? "border-2 border-teal-500 rounded-sm"
                                : ""
                        }`}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, tab.id, index)}
                        onDragOver={(e) => handleTabDragOver(e, tab.id, index)}
                        onDragLeave={handleTabDragLeave}
                        onDrop={(e) => handleTabDrop(e, tab.id, index)}
                    >
                        <VisualTabForTabBar
                            id={tab.id}
                            name={tab.name}
                            icon={tab.icon}
                            isActive={activeTab?.id === tab.id}
                            closable={tab.closable}
                            onClick={() => activateTabInPanel(tab.id, panelId)}
                            onClose={closeTab}
                        />
                    </div>
                ))}
            </div>

            {/* 오른쪽 스크롤 버튼 */}
            {showRightScroll && (
                <button
                    onClick={scrollRight}
                    className="flex items-center justify-center min-w-8 bg-white border-l border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label="오른쪽으로 스크롤"
                >
                    <ChevronRight size={16} />
                </button>
            )}

            {/* 분할 버튼 (메인 패널 또는 첫 번째 패널에만 표시) */}
            {(panelId === 'main' || panelId === 'panel-0') && (
                <div className="flex items-center border-l px-1">
                    {isSplit ? (
                        <button
                            className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all"
                            onClick={unsplitView}
                            title="분할 해제"
                        >
                            <X size={16} />
                        </button>
                    ) : (
                        <>
                            <button
                                className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all"
                                onClick={() => splitView(2)}
                                title="2열 분할"
                            >
                                <Columns2 size={16} />
                            </button>
                            <button
                                className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all"
                                onClick={() => splitView(3)}
                                title="3열 분할"
                            >
                                <Columns3 size={16} />
                            </button>
                            <button
                                className="p-1.5 mx-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all"
                                onClick={() => splitView(4)}
                                title="4열 분할"
                            >
                                <Columns4 size={16} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TabBar;