'use client'

import React, { useEffect } from 'react';
import TreeItem from './TreeItem';
import { SidebarItem } from '../config/sidebar-menu-items';

interface TreeMenusForSideBarProps {
    config: SidebarItem[];  // 현재 활성 탭의 메뉴 구성
    currentPath: string;    // 현재 경로
    expandedItems: Record<string, boolean>;  // 확장된 아이템 상태
    setExpandedItems: (expandedItems: Record<string, boolean>) => void;  // 확장 상태 설정 함수
}

const TreeMenusForSideBar: React.FC<TreeMenusForSideBarProps> = ({
    config,
    currentPath,
    expandedItems,
    setExpandedItems
}) => {
    // 아이템 토글 함수 - 아이템 ID를 매개변수로 받음
    const toggleItem = (id: string) => {
        setExpandedItems({
            ...expandedItems,
            [id]: !expandedItems[id]
        });
    };

    // 현재 경로에 해당하는 항목 자동 확장
    useEffect(() => {
        // 재귀적으로 경로에 해당하는 모든 상위 항목 ID 찾기
        const findParentItemIds = (
            items: SidebarItem[],
            targetPath: string,
            parentIds: string[] = []
        ): string[] => {
            for (const item of items) {
                if (item.href === targetPath) {
                    return parentIds;
                }

                if (item.children && item.children.length > 0) {
                    const foundIds = findParentItemIds(
                        item.children,
                        targetPath,
                        [...parentIds, item.id]
                    );

                    if (foundIds.length > 0) {
                        return foundIds;
                    }
                }
            }

            return [];
        };

        // 현재 경로에 해당하는 상위 항목 ID 찾기
        const parentIds = findParentItemIds(config, currentPath);

        // 찾은 ID들을 확장 상태에 추가
        if (parentIds.length > 0) {
            const newExpandedItems = { ...expandedItems };

            parentIds.forEach(id => {
                newExpandedItems[id] = true;
            });

            setExpandedItems(newExpandedItems);
        }
    }, [config, currentPath, expandedItems, setExpandedItems]);

    return (
        <nav className="space-y-1">
            {config.map((item) => (
                <TreeItem
                    key={item.id}
                    item={item}
                    currentPath={currentPath}
                    isExpanded={!!expandedItems[item.id]}
                    onToggleExpand={toggleItem}
                    level={0}
                    expandedItems={expandedItems}
                />
            ))}
        </nav>
    );
};

export default TreeMenusForSideBar;