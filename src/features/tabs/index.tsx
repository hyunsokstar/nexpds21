// src\features\tabs\index.tsx
import { Tab, SplitPanel, useTabStore } from './store/useTabStore';

export { useTabStore } from './store/useTabStore';
export type { Tab, SplitPanel } from './store/useTabStore';

// 간편한 사용을 위한 액션 함수들
export const useTabActions = () => {
  const { 
    addTab, 
    removeTab, 
    setActiveTab, 
    splitIntoColumns, 
    removeSplit, 
    moveTab, 
    activateTabInPanel,
    reorderTabsInPanel 
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
    
    moveTabToPanel: (tabId: string, panelId: string) => {
      moveTab(tabId, panelId);
    },
    
    activateTabInPanel: (tabId: string, panelId: string) => {
      activateTabInPanel(tabId, panelId);
    },
    
    reorderTabsInPanel: (panelId: string, sourceIndex: number, targetIndex: number) => {
      reorderTabsInPanel(panelId, sourceIndex, targetIndex);
    }
  };
};

// 간편한 사용을 위한 셀렉터 함수들
export const useTabSelectors = () => {
  const { 
    tabs, 
    activeTabId, 
    hasTab, 
    isSplit, 
    panels
  } = useTabStore();
  
  return {
    getTabs: () => tabs,
    getActiveTabId: () => activeTabId,
    getActiveTab: () => tabs.find(tab => tab.id === activeTabId) || null,
    hasTab: (id: string) => hasTab(id),
    
    // 분할 관련 셀렉터
    isSplitView: () => isSplit,
    getPanels: () => panels,
    getPanelTabs: (panelId: string) => {
      const panel = panels.find(p => p.id === panelId);
      if (!panel) return [];
      return tabs.filter(tab => panel.tabs.includes(tab.id));
    },
    getActivePanelTab: (panelId: string) => {
      const panel = panels.find(p => p.id === panelId);
      if (!panel || !panel.activeTabId) return null;
      return tabs.find(tab => tab.id === panel.activeTabId) || null;
    }
  };
};