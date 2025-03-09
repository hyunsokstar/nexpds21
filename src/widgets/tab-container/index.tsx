// 'use client'

// import React, { useEffect, useState, useRef } from 'react'
// import { 
//   PanelGroup, 
//   Panel, 
//   ImperativePanelHandle
// } from 'react-resizable-panels'
// import { useTabSelectors } from '@/features/tabs'
// import TabBar from './tab-bar'
// import TabPanel from './tab-panel'
// import ResizeHandle from './component/ResizeHandle'

// interface TabContainerProps {
//   className?: string
// }

// const LOCAL_STORAGE_KEY = 'tab-panel-layout'

// // 패널 최소 절대 너비 (픽셀)
// const MIN_PANEL_WIDTH_PX = 300;

// const TabContainer = ({ className }: TabContainerProps) => {
//   const { getTabs, isSplitView, getPanels } = useTabSelectors()
//   const tabs = getTabs()
//   const hasTabs = tabs.length > 0
//   const isSplit = isSplitView()
//   const panels = getPanels()

//   // 패널 레이아웃 상태
//   const [isLayoutReady, setIsLayoutReady] = useState(false)

//   // 패널 참조 저장
//   const panelRefs = useRef<(ImperativePanelHandle | null)[]>([])
//   const containerRef = useRef<HTMLDivElement>(null)

//   // 이전 패널 수 추적
//   const prevPanelCount = useRef<number>(0)

//   // 패널 최소 사이즈 계산 (%)
//   const calculateMinSize = () => {
//     if (!containerRef.current || !panels.length) return 10;

//     const containerWidth = containerRef.current.clientWidth;
//     // 패널 최소 너비를 컨테이너 너비의 백분율로 변환
//     const minSizePercent = (MIN_PANEL_WIDTH_PX / containerWidth) * 100;

//     // 백분율 값이 너무 크면(예: 작은 화면에서) 기본값 사용
//     return Math.min(minSizePercent, 30);
//   }

//   const [minPanelSize, setMinPanelSize] = useState<number>(10);

//   // 컨테이너 크기 변경 감지
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const updateMinSize = () => {
//       setMinPanelSize(calculateMinSize());
//     };

//     // 초기 계산
//     updateMinSize();

//     // 리사이즈 이벤트 리스너
//     const resizeObserver = new ResizeObserver(updateMinSize);
//     resizeObserver.observe(containerRef.current);

//     return () => {
//       if (containerRef.current) {
//         resizeObserver.unobserve(containerRef.current);
//       }
//       resizeObserver.disconnect();
//     };
//   }, [panels.length]);

//   // 최초 로딩 시 레이아웃 설정
//   useEffect(() => {
//     // 패널 레이아웃 설정 준비
//     if (isSplit && panels.length > 0) {
//       // 패널 수가 변경된 경우
//       if (prevPanelCount.current !== panels.length) {
//         prevPanelCount.current = panels.length;

//         // 기존에 저장된 레이아웃 확인
//         try {
//           const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY);
//           if (savedLayout) {
//             const parsedLayout = JSON.parse(savedLayout);

//             // 패널 수가 일치할 경우에만 저장된 레이아웃 적용
//             if (parsedLayout.panelCount === panels.length) {
//               // 각 패널에 크기 적용
//               setTimeout(() => {
//                 parsedLayout.sizes.forEach((size: number, i: number) => {
//                   const panel = panelRefs.current[i];
//                   if (panel) {
//                     panel.resize(size);
//                   }
//                 });
//                 setIsLayoutReady(true);
//               }, 0);
//               return;
//             }
//           }
//         } catch (error) {
//           console.error('Failed to load panel layout:', error);
//         }

//         // 새 레이아웃 설정
//         setIsLayoutReady(true);
//       }
//     }
//   }, [isSplit, panels.length]);

//   // 패널 크기 변경시 저장
//   const handleLayout = (sizes: number[]) => {
//     if (!isLayoutReady) return;

//     // 로컬 스토리지에 레이아웃 저장
//     try {
//       localStorage.setItem(
//         LOCAL_STORAGE_KEY, 
//         JSON.stringify({
//           panelCount: panels.length,
//           sizes
//         })
//       );
//     } catch (error) {
//       console.error('Failed to save panel layout:', error);
//     }
//   };

//   // 패널 초기 크기 계산
//   const getInitialPanelSize = (index: number) => {
//     return 100 / panels.length;
//   };

//   // 분할 모드가 아닐 때는 단일 컨테이너 표시
//   if (!isSplit) {
//     return (
//       <div className={`flex flex-col flex-1 ${className}`}>
//         <TabBar panelId="main" />
//         {hasTabs && <TabPanel panelId="main" />}
//       </div>
//     );
//   }

//   // 분할 모드일 때는 리사이즈 가능한 패널 그룹 표시
//   return (
//     <div ref={containerRef} className={`h-full ${className}`}>
//       <PanelGroup 
//         direction="horizontal" 
//         className="h-full"
//         onLayout={handleLayout}
//       >
//         {panels.map((panel, index) => (
//           <React.Fragment key={panel.id}>
//             {/* 첫번째 패널이 아니면 리사이즈 핸들 추가 */}
//             {index > 0 && (
//               <ResizeHandle 
//                 className="z-10" // 겹침 방지
//               />
//             )}

//             <Panel 
//               id={panel.id}
//               defaultSize={getInitialPanelSize(index)}
//               minSize={minPanelSize} // 동적으로 계산된 최소 크기 적용
//               ref={el => {
//                 if (panelRefs.current.length <= index) {
//                   panelRefs.current = [...panelRefs.current, ...Array(index - panelRefs.current.length + 1).fill(null)];
//                 }
//                 panelRefs.current[index] = el;
//               }}
//             >
//               <div className="flex flex-col h-full">
//                 <TabBar panelId={panel.id} />
//                 <div className="flex-1 overflow-auto"> {/* 패널 내용 스크롤 영역 */}
//                   <div className="min-w-[300px]"> {/* 최소 콘텐츠 너비 적용 */}
//                     <TabPanel panelId={panel.id} />
//                   </div>
//                 </div>
//               </div>
//             </Panel>
//           </React.Fragment>
//         ))}
//       </PanelGroup>
//     </div>
//   );
// };

// export default TabContainer

// TabContainer.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { PanelGroup, Panel, ImperativePanelHandle } from 'react-resizable-panels'
import { useTabSelectors } from '@/features/tabs'
import TabBar from './tab-bar'
import TabPanel from './tab-panel'
import ResizeHandle from './component/ResizeHandle'

interface TabContainerProps {
  className?: string
}

const LOCAL_STORAGE_KEY = 'tab-panel-layout'

// 패널 최소 절대 너비 (픽셀)
const MIN_PANEL_WIDTH_PX = 300;

const TabContainer = ({ className }: TabContainerProps) => {
  const { getTabs, isSplitView, getPanels } = useTabSelectors()
  const tabs = getTabs()
  const hasTabs = tabs.length > 0
  const isSplit = isSplitView()
  const panels = getPanels()

  // 패널 레이아웃 상태
  const [isLayoutReady, setIsLayoutReady] = useState(false)

  // 패널 참조 저장
  const panelRefs = useRef<(ImperativePanelHandle | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // 이전 패널 수 추적
  const prevPanelCount = useRef<number>(0)

  // 패널 최소 사이즈 계산 함수
  const calculateMinSize = () => {
    if (!containerRef.current || panels.length === 0) return 10;

    const containerWidth = containerRef.current.clientWidth;
    const minSizePercent = (MIN_PANEL_WIDTH_PX / containerWidth) * 100;
    return Math.min(minSizePercent, 30);
  }

  const [minPanelSize, setMinPanelSize] = useState<number>(10);

  // 컨테이너 크기 변경 감지
  useEffect(() => {
    if (!containerRef.current) return;

    const updateMinSize = () => {
      setMinPanelSize(calculateMinSize());
    };

    // 초기 계산
    updateMinSize();

    // 리사이즈 이벤트 리스너
    const resizeObserver = new ResizeObserver(updateMinSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [panels.length]);

  // 최초 로딩 시 레이아웃 설정
  useEffect(() => {
    if (isSplit && panels.length > 0) {
      if (prevPanelCount.current !== panels.length) {
        prevPanelCount.current = panels.length;

        try {
          const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedLayout) {
            const parsedLayout = JSON.parse(savedLayout);
            if (parsedLayout.panelCount === panels.length) {
              setTimeout(() => {
                parsedLayout.sizes.forEach((size: number, i: number) => {
                  const panel = panelRefs.current[i];
                  if (panel) {
                    panel.resize(size);
                  }
                });
                setIsLayoutReady(true);
              }, 0);
              return;
            }
          }
        } catch (error) {
          console.error('Failed to load panel layout:', error);
        }

        setIsLayoutReady(true);
      }
    }
  }, [isSplit, panels.length]);

  // 패널 크기 변경시 저장
  const handleLayout = (sizes: number[]) => {
    if (!isLayoutReady) return;

    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          panelCount: panels.length,
          sizes
        })
      );
    } catch (error) {
      console.error('Failed to save panel layout:', error);
    }
  }

  // 패널 초기 크기 계산
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getInitialPanelSize = (index: number) => {
    return 100 / panels.length;
  }

  if (!isSplit) {
    return (
      <div className={`flex flex-col flex-1 ${className}`}>
        <TabBar panelId="main" />
        {hasTabs && <TabPanel panelId="main" />}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`h-full ${className}`}>
      <PanelGroup
        direction="horizontal"
        className="h-full"
        onLayout={handleLayout}
      >
        {panels.map((panel, index) => (
          <React.Fragment key={panel.id}>
            {index > 0 && (
              <ResizeHandle className="z-10" />
            )}

            <Panel
              id={panel.id}
              defaultSize={getInitialPanelSize(index)}
              minSize={minPanelSize}
              ref={el => {
                if (panelRefs.current.length <= index) {
                  panelRefs.current = [...panelRefs.current, ...Array(index - panelRefs.current.length + 1).fill(null)]
                }
                panelRefs.current[index] = el;
              }}
              className="overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <TabBar panelId={panel.id} />
                <div className="flex-1 overflow-auto">
                  <div className="min-w-[300px]">
                    <TabPanel panelId={panel.id} />
                  </div>
                </div>
              </div>
            </Panel>
          </React.Fragment>
        ))}
      </PanelGroup>
    </div>
  )
}

export default TabContainer;
