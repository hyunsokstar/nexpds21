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
          ? 'h-1 w-full cursor-row-resize' 
          : 'w-1 h-full cursor-col-resize'
        }
        ${className}
      `}
    >
      <div 
        className={`
          absolute bg-gray-200 transition-all duration-200
          group-hover:bg-teal-500 group-data-[resize-handle-active]:bg-teal-600
          ${isHorizontal
            ? 'h-full w-full group-hover:h-2 -top-0.5 group-data-[resize-handle-active]:h-2'
            : 'h-full w-full group-hover:w-2 -left-0.5 group-data-[resize-handle-active]:w-2'
          }
        `}
      >
        {/* 드래그 핸들 추가 (선택 사항) */}
        <div className={`
          absolute flex items-center justify-center
          ${isHorizontal 
            ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' 
            : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          }
        `}>
          <div className={`
            bg-gray-400 rounded-full opacity-0 transition-opacity
            group-hover:opacity-100 group-data-[resize-handle-active]:opacity-100
            ${isHorizontal ? 'h-1 w-8' : 'h-8 w-1'}
          `} />
        </div>
      </div>
    </PanelResizeHandle>
  )
}

export default ResizeHandle