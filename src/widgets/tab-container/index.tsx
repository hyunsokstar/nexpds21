'use client'

import React from 'react'
import { useTabSelectors } from '@/features/tabs'
import TabBar from './tab-bar'
import TabPanel from './tab-panel'

interface TabContainerProps {
  className?: string
}

const TabContainer = ({ className }: TabContainerProps) => {
  const { getTabs, isSplitView, getPanels } = useTabSelectors()
  const tabs = getTabs()
  const hasTabs = tabs.length > 0
  const isSplit = isSplitView()
  const panels = getPanels()
  
  // 분할 모드가 아닐 때는 단일 컨테이너 표시
  if (!isSplit) {
    return (
      <div className={`flex flex-col flex-1 ${className}`}>
        <TabBar panelId="main" />
        {hasTabs && <TabPanel panelId="main" />}
      </div>
    )
  }
  
  // 패널 수에 따른 너비 계산 (균등 분할)
  const panelWidth = 100 / panels.length;
  
  // 분할 모드일 때는 멀티 컨테이너 표시
  return (
    <div className={`flex h-full ${className}`}>
      {panels.map((panel, index) => (
        <div 
          key={panel.id} 
          className="flex flex-col h-full border-r border-gray-200 last:border-r-0"
          style={{ width: `${panelWidth}%` }}
        >
          <TabBar panelId={panel.id} />
          <TabPanel panelId={panel.id} />
        </div>
      ))}
    </div>
  )
}

export default TabContainer