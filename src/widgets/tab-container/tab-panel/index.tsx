'use client'

import React from 'react';
import { useTabSelectors } from '@/features/tabs/store/useTabStore';
import { cn } from '@/lib/utils';

interface TabPanelProps {
  className?: string;
  panelId?: string;
}

const TabPanel = ({ className, panelId = 'main' }: TabPanelProps) => {
  const { getActivePanelTab } = useTabSelectors();
  const activeTab = getActivePanelTab(panelId);
  
  // 활성화된 탭이 없을 때는 빈 패널 표시
  if (!activeTab) {
    return (
      <div className={cn("flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50", className)}>
        <div className="text-gray-400 text-center">
          <p>표시할 내용이 없습니다.</p>
          <p className="text-sm">탭을 선택하거나 새 탭을 열어주세요.</p>
        </div>
      </div>
    );
  }

  // 활성 탭에 해당하는 컴포넌트 렌더링
  const TabComponent = activeTab.component;

  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      <TabComponent />
    </div>
  );
};

export default TabPanel;