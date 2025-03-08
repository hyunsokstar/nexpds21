'use client'

import React from 'react'
import { PanelResizeHandle } from 'react-resizable-panels'

interface ResizeHandleProps {
  className?: string
  direction?: 'horizontal' | 'vertical'
}

const ResizeHandle = ({ 
  className = '', 
  direction = 'vertical' 
}: ResizeHandleProps) => {
  const isHorizontal = direction === 'horizontal'
  
  return (
    <PanelResizeHandle 
      className={`
        group relative 
        ${isHorizontal 
          ? 'h-px w-full cursor-row-resize' 
          : 'w-px h-full cursor-col-resize'
        }
        ${className}
      `}
    >
      {/* 기본 상태의 선 */}
      <div 
        className={`
          absolute bg-gray-200 transition-all duration-150
          ${isHorizontal
            ? 'h-px w-full'
            : 'h-full w-px'
          }
        `}
      />

      {/* 호버/활성 상태의 선 */}
      <div 
        className={`
          absolute bg-gray-300 opacity-0 transition-all duration-150
          group-hover:opacity-100 group-data-[resize-handle-active]:opacity-100
          group-data-[resize-handle-active]:bg-gray-400
          ${isHorizontal
            ? 'h-px w-full'
            : 'h-full w-px'
          }
        `}
      />
      
      {/* 더 넓은 히트 영역 (사용성 유지) */}
      <div className={`
        absolute 
        ${isHorizontal ? '-top-1 h-2 w-full' : '-left-1 w-2 h-full'}
      `} />
    </PanelResizeHandle>
  )
}

export default ResizeHandle