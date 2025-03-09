"use client";

import { create } from "zustand";
import { LucideIcon } from "lucide-react";

// 컴포넌트 타입
type ComponentType = React.ComponentType<unknown>;

export interface Tab {
  id: string;
  name: string;
  icon: LucideIcon;
  component: ComponentType;
  closable?: boolean;
}

// 분할 영역 (패널) 정의
export interface SplitPanel {
  id: string;
  tabs: string[]; // 이 패널에 속한 탭 ID 배열
  activeTabId: string | null;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;

  // 분할 관련 상태
  isSplit: boolean;
  panels: SplitPanel[];

  // 기본 탭 관련 액션
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  hasTab: (id: string) => boolean;

  // 분할 관련 액션
  splitIntoColumns: (count: number) => void;
  removeSplit: () => void;
  closePanel: (panelId: string) => void; // 개별 패널 닫기 함수
  moveTab: (tabId: string, targetPanelId: string) => void;
  activateTabInPanel: (tabId: string, panelId: string) => void;
  reorderTabsInPanel: (
    panelId: string,
    sourceIndex: number,
    targetIndex: number
  ) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  // 분할 초기 상태
  isSplit: false,
  panels: [
    {
      id: "main",
      tabs: [],
      activeTabId: null,
    },
  ],

  addTab: (tab: Tab) => {
    const { hasTab, isSplit, panels } = get();

    if (!hasTab(tab.id)) {
      set((state) => {
        // 새 탭 추가
        const newTabs = [...state.tabs, tab];

        if (isSplit) {
          // 분할 모드일 때
          const firstPanelId = panels[0].id;
          const updatedPanels = panels.map((panel) =>
            panel.id === firstPanelId
              ? {
                ...panel,
                tabs: [...panel.tabs, tab.id],
                activeTabId: tab.id,
              }
              : panel
          );

          return {
            tabs: newTabs,
            panels: updatedPanels,
            activeTabId: tab.id,
          };
        } else {
          // 분할이 아닐 때, 기존 main 패널의 탭 순서를 유지하며 새 탭을 추가
          const mainPanel = state.panels[0];
          const updatedMainPanel = {
            ...mainPanel,
            tabs: [...mainPanel.tabs, tab.id], // 기존 탭 배열 뒤에 새 탭 추가
            activeTabId: tab.id,
          };

          return {
            tabs: newTabs,
            panels: [updatedMainPanel],
            activeTabId: tab.id,
          };
        }
      });
    } else {
      // 이미 존재하는 탭이면 활성화
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set((state) => {
        if (isSplit) {
          // 탭이 속한 패널 찾기
          const targetPanel = panels.find((panel) =>
            panel.tabs.includes(tab.id)
          );
          if (targetPanel) {
            const updatedPanels = panels.map((panel) =>
              panel.id === targetPanel.id
                ? { ...panel, activeTabId: tab.id }
                : panel
            );

            return {
              panels: updatedPanels,
              activeTabId: tab.id,
            };
          }
        }

        return { activeTabId: tab.id };
      });
    }
  },

  removeTab: (id: string) => {
    set((state) => {
      const { isSplit, panels } = state;

      // 탭 목록에서 제거
      const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
      if (tabIndex === -1) return state;

      const newTabs = [...state.tabs];
      newTabs.splice(tabIndex, 1);

      if (isSplit) {
        // 분할 모드인 경우
        const panelIndex = panels.findIndex((panel) =>
          panel.tabs.includes(id)
        );
        if (panelIndex === -1) {
          return { tabs: newTabs };
        }

        const panel = panels[panelIndex];
        const newPanelTabs = panel.tabs.filter((tabId) => tabId !== id);
        let newActiveTabId = panel.activeTabId;

        // 삭제된 탭이 활성 탭이었다면 다른 탭 활성화
        if (panel.activeTabId === id) {
          if (newPanelTabs.length === 0) {
            newActiveTabId = null;
          } else {
            const deletedTabIndex = panel.tabs.indexOf(id);
            if (deletedTabIndex < newPanelTabs.length) {
              newActiveTabId = newPanelTabs[deletedTabIndex];
            } else {
              newActiveTabId = newPanelTabs[newPanelTabs.length - 1];
            }
          }
        }

        // 업데이트된 패널
        const updatedPanel = {
          ...panel,
          tabs: newPanelTabs,
          activeTabId: newActiveTabId,
        };
        const updatedPanels = [...panels];
        updatedPanels[panelIndex] = updatedPanel;

        // 현재 전역 활성 탭이 삭제된 경우 업데이트
        let globalActiveTabId = state.activeTabId;
        if (globalActiveTabId === id) {
          if (newActiveTabId) {
            globalActiveTabId = newActiveTabId;
          } else {
            // 다른 패널에서 활성 탭 찾기
            for (const p of updatedPanels) {
              if (p.activeTabId) {
                globalActiveTabId = p.activeTabId;
                break;
              }
            }
            if (!globalActiveTabId && newTabs.length > 0) {
              globalActiveTabId = newTabs[0].id;
            } else if (newTabs.length === 0) {
              globalActiveTabId = null;
            }
          }
        }

        // 모든 패널이 비었으면 분할 모드 해제
        const allEmpty = updatedPanels.every((p) => p.tabs.length === 0);
        if (allEmpty) {
          return {
            tabs: newTabs,
            activeTabId: null,
            isSplit: false,
            panels: [{ id: "main", tabs: [], activeTabId: null }],
          };
        }

        return {
          tabs: newTabs,
          activeTabId: globalActiveTabId,
          panels: updatedPanels,
        };
      } else {
        // 분할 모드가 아닌 경우
        const mainPanel = state.panels[0];
        let newActiveTabId = state.activeTabId;

        // mainPanel에서 해당 탭 제거
        const newPanelTabs = mainPanel.tabs.filter((tabId) => tabId !== id);

        if (state.activeTabId === id) {
          if (newTabs.length === 0) {
            // 모든 탭이 삭제된 경우
            newActiveTabId = null;
          } else {
            // 지운 탭 인덱스 기준으로 활성화할 새 탭 결정
            const deletedTabIndex = mainPanel.tabs.indexOf(id);
            if (deletedTabIndex < newPanelTabs.length) {
              newActiveTabId = newPanelTabs[deletedTabIndex];
            } else {
              newActiveTabId = newPanelTabs[newPanelTabs.length - 1];
            }
          }
        }

        const updatedMainPanel = {
          ...mainPanel,
          tabs: newPanelTabs,
          activeTabId: newActiveTabId,
        };

        return {
          tabs: newTabs,
          activeTabId: newActiveTabId,
          panels: [updatedMainPanel],
        };
      }
    });
  },

  setActiveTab: (id: string) => {
    set((state) => {
      const { isSplit, panels } = state;

      if (isSplit) {
        // 탭이 속한 패널 찾기
        const targetPanel = panels.find((panel) => panel.tabs.includes(id));
        if (targetPanel) {
          const updatedPanels = panels.map((panel) =>
            panel.id === targetPanel.id
              ? { ...panel, activeTabId: id }
              : panel
          );

          return {
            activeTabId: id,
            panels: updatedPanels,
          };
        }
      }

      return { activeTabId: id };
    });
  },

  hasTab: (id: string) => {
    return get().tabs.some((tab) => tab.id === id);
  },

  // 분할 관련 액션
  splitIntoColumns: (count: number) => {
    if (count < 1) count = 1;
    if (count > 5) count = 5;

    set((state) => {
      const { tabs, activeTabId } = state;

      if (tabs.length === 0) return state;

      // 분할 패널 생성
      const newPanels: SplitPanel[] = [];

      // 탭을 균등하게 분배하기 위해 ID 리스트 만들기
      const tabIds = [...state.panels[0].tabs];
      // (분할하기 전에도 panels[0].tabs 에 탭 순서가 들어있다고 가정)

      // count만큼 패널을 먼저 생성
      for (let i = 0; i < count; i++) {
        newPanels.push({
          id: `panel-${i}`,
          tabs: [],
          activeTabId: null,
        });
      }

      // 탭을 순차적으로 분배
      tabIds.forEach((tabId, index) => {
        const panelIndex = index % count;
        newPanels[panelIndex].tabs.push(tabId);

        // 패널 활성 탭 설정
        if (
          newPanels[panelIndex].activeTabId === null ||
          tabId === activeTabId
        ) {
          newPanels[panelIndex].activeTabId = tabId;
        }
      });

      return {
        isSplit: count > 1,
        panels:
          count > 1
            ? newPanels
            : [
              {
                id: "main",
                tabs: tabIds,
                activeTabId,
              },
            ],
      };
    });
  },

  removeSplit: () => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tabs, activeTabId } = state;
      // 분할 해제 시, 모든 패널의 탭을 유지하면서 하나로 합침

      // 모든 패널의 탭 ID를 순서대로 수집 (기존 패널 순서 유지)
      const mergedTabIds: string[] = state.panels.reduce<string[]>(
        (acc, p) => [...acc, ...p.tabs],
        []
      );

      // 중복 제거 (혹시 모를 상황 대비)
      const uniqueTabIds = Array.from(new Set(mergedTabIds));

      return {
        isSplit: false,
        panels: [
          {
            id: "main",
            tabs: uniqueTabIds,
            activeTabId,
          },
        ],
      };
    });
  },

  // 개별 패널 닫기 함수 - 수정된 버전
  closePanel: (closingPanelId: string) => {
    set((state) => {
      const { panels } = state;

      // 닫으려는 패널 찾기
      const panelIndex = panels.findIndex((p) => p.id === closingPanelId);
      if (panelIndex === -1) return state; // 해당 패널 없음

      // 패널이 하나뿐이면? (원하면 그냥 무시하거나, 탭 전부 제거 후 남은 패널만 유지)
      if (panels.length <= 1) {
        // 모든 탭 삭제하고 패널도 없애버리기
        // 혹은 그냥 아무것도 안 함 (디자인에 따라)
        const closingTabs = panels[panelIndex].tabs;
        const newTabs = state.tabs.filter(tab => !closingTabs.includes(tab.id));
        return {
          tabs: newTabs,
          panels: [{ id: "main", tabs: [], activeTabId: null }],
          activeTabId: null,
          isSplit: false
        };
      }

      // 닫으려는 패널 정보
      const closingPanel = panels[panelIndex];
      const closingTabs = closingPanel.tabs;

      // 1) 전역 탭 목록에서 해당 탭들 제거
      const newTabs = state.tabs.filter(tab => !closingTabs.includes(tab.id));

      // 2) 패널 목록에서 제거
      const updatedPanels = [...panels];
      updatedPanels.splice(panelIndex, 1);

      // 3) 분할 모드 여부 갱신
      const isSplit = updatedPanels.length > 1;

      // 활성 탭(activeTabId) 처리:
      // - 닫은 패널의 탭 중 하나가 활성 상태였으면 null 또는 다른 탭으로 변경
      let newActiveTabId = state.activeTabId;
      if (closingTabs.includes(newActiveTabId || "")) {
        newActiveTabId = null; // 혹은 남아 있는 다른 패널 탭 중 하나를 활성화
        for (const p of updatedPanels) {
          if (p.activeTabId) {
            newActiveTabId = p.activeTabId;
            break;
          }
        }
      }

      // 4) 마지막으로 패널이 1개만 남았다면 “main”으로 바꾼다거나, 
      //    아니면 그대로 panelId 유지(동적 렌더링이면 필요 없음)
      if (!isSplit) {
        // 1개만 남으면 굳이 "main"으로 교체해도 되고, 아니면 유지
        updatedPanels[0] = {
          ...updatedPanels[0],
          id: "main",
        };
      }

      return {
        tabs: newTabs,
        panels: updatedPanels,
        activeTabId: newActiveTabId,
        isSplit
      };
    });
  },



  moveTab: (tabId: string, targetPanelId: string) => {
    set((state) => {
      const { panels } = state;

      // 소스 패널 찾기
      const sourcePanelIndex = panels.findIndex((panel) =>
        panel.tabs.includes(tabId)
      );
      if (sourcePanelIndex === -1) return state;

      // 대상 패널 찾기
      const targetPanelIndex = panels.findIndex(
        (panel) => panel.id === targetPanelId
      );
      if (targetPanelIndex === -1) return state;

      // 같은 패널이면 무시
      if (sourcePanelIndex === targetPanelIndex) return state;

      const sourcePanel = panels[sourcePanelIndex];
      const targetPanel = panels[targetPanelIndex];

      // 소스 패널에서 탭 제거
      const updatedSourceTabs = sourcePanel.tabs.filter((id) => id !== tabId);
      let updatedSourceActiveTabId = sourcePanel.activeTabId;

      // 소스 패널의 활성 탭이 이동된 경우, 새 활성 탭 설정
      if (sourcePanel.activeTabId === tabId) {
        updatedSourceActiveTabId =
          updatedSourceTabs.length > 0 ? updatedSourceTabs[0] : null;
      }

      // 업데이트된 패널 배열
      const updatedPanels = [...panels];
      updatedPanels[sourcePanelIndex] = {
        ...sourcePanel,
        tabs: updatedSourceTabs,
        activeTabId: updatedSourceActiveTabId,
      };

      // 대상 패널에 탭 추가
      updatedPanels[targetPanelIndex] = {
        ...targetPanel,
        tabs: [...targetPanel.tabs, tabId],
        activeTabId: tabId, // 이동된 탭을 활성화
      };

      return {
        panels: updatedPanels,
        activeTabId: tabId, // 전역 활성 탭도 업데이트
      };
    });
  },

  activateTabInPanel: (tabId: string, panelId: string) => {
    set((state) => {
      const { panels } = state;

      // 패널 찾기
      const panelIndex = panels.findIndex((panel) => panel.id === panelId);
      if (panelIndex === -1) return state;

      const panel = panels[panelIndex];

      // 패널에 탭이 존재하는지 확인
      if (!panel.tabs.includes(tabId)) return state;

      // 업데이트된 패널 배열
      const updatedPanels = [...panels];
      updatedPanels[panelIndex] = {
        ...panel,
        activeTabId: tabId,
      };

      return {
        panels: updatedPanels,
        activeTabId: tabId, // 전역 활성 탭도 업데이트
      };
    });
  },

  reorderTabsInPanel: (panelId: string, sourceIndex: number, targetIndex: number) => {
    set((state) => {
      // 패널 찾기
      const panelIndex = state.panels.findIndex((panel) => panel.id === panelId);
      if (panelIndex === -1) return state;

      const panel = state.panels[panelIndex];
      const oldTabs = panel.tabs;

      // sourceIndex, targetIndex 범위 체크
      if (
        sourceIndex < 0 ||
        sourceIndex >= oldTabs.length ||
        targetIndex < 0 ||
        targetIndex >= oldTabs.length
      ) {
        return state;
      }

      // 새로운 탭 배열 생성
      const newTabs = [...oldTabs];
      const [movedTab] = newTabs.splice(sourceIndex, 1);
      newTabs.splice(targetIndex, 0, movedTab);

      // 완전히 새로운 패널 배열 생성
      const newPanels = state.panels.map((p, i) => {
        if (i === panelIndex) {
          return {
            ...p,
            tabs: newTabs,
          };
        }
        return p;
      });

      return {
        ...state,
        panels: newPanels,
      };
    });
  },
}));

// 편의를 위한 훅 함수들
export const useTabActions = () => {
  const {
    addTab,
    removeTab,
    setActiveTab,
    splitIntoColumns,
    removeSplit,
    closePanel,
    moveTab,
    activateTabInPanel,
    reorderTabsInPanel,
  } = useTabStore();

  return {
    openTab: (tab: Tab) => {
      addTab(tab);
    },

    closeTab: (id: string) => {
      removeTab(id);
    },

    activateTab: (id: string) => {
      setActiveTab(id);
    },

    // 분할 관련 액션
    splitView: (columns: number) => {
      splitIntoColumns(columns);
    },

    unsplitView: () => {
      removeSplit();
    },

    closePanel: (panelId: string) => {
      closePanel(panelId);
    },

    moveTabToPanel: (tabId: string, panelId: string) => {
      moveTab(tabId, panelId);
    },

    activateTabInPanel: (tabId: string, panelId: string) => {
      activateTabInPanel(tabId, panelId);
    },

    reorderTabsInPanel: (
      panelId: string,
      sourceIndex: number,
      targetIndex: number
    ) => {
      reorderTabsInPanel(panelId, sourceIndex, targetIndex);
    },
  };
};

export const useTabSelectors = () => {
  const { tabs, activeTabId, isSplit, panels } = useTabStore();

  return {
    getTabs: () => tabs,
    getActiveTabId: () => activeTabId,
    getActiveTab: () => tabs.find((tab) => tab.id === activeTabId) || null,

    // 분할 관련 셀렉터
    isSplitView: () => isSplit,
    getPanels: () => panels,
    getPanelTabs: (panelId: string) => {
      const panel = panels.find((p) => p.id === panelId);
      if (!panel) return [];
      // panel.tabs 배열 순서대로 tab 객체를 가져오도록 수정
      return panel.tabs.map((id) => tabs.find((tab) => tab.id === id)!);
    },
    getActivePanelTab: (panelId: string) => {
      const panel = panels.find((p) => p.id === panelId);
      if (!panel || !panel.activeTabId) return null;
      return tabs.find((tab) => tab.id === panel.activeTabId) || null;
    },
  };
};