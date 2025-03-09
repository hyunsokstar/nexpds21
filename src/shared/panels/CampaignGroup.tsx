'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Plus, Trash2, Edit, Eye } from 'lucide-react';

// 그룹 ID 타입
type GroupId = 'telecom' | 'finance' | 'retail' | 'healthcare';

// 상태 타입 정의
type StatusType = 'active' | 'inactive' | 'pending';

// 캠페인 그룹 타입 정의
type CampaignGroup = {
  id: string;
  name: string;
  campaigns: number;
  active: number;
  description: string;
  owner: string;
  created: string;
  status: StatusType;
};

// 캠페인 그룹 데이터
const campaignGroups: Record<GroupId, CampaignGroup[]> = {
  telecom: [
    { id: 't1', name: 'SK Telecom 캠페인 그룹', campaigns: 12, active: 8, description: '모바일 서비스 캠페인', owner: '김영수', created: '2025-01-15', status: 'active' }
  ],
  finance: [
    { id: 'f1', name: '신한카드 혜택 캠페인', campaigns: 7, active: 5, description: '신규 카드 회원 혜택 안내', owner: '박지민', created: '2025-02-10', status: 'active' }
  ],
  retail: [
    { id: 'r1', name: '이마트 할인 이벤트', campaigns: 5, active: 4, description: '대형 마트 할인 행사 캠페인', owner: '정민우', created: '2025-01-20', status: 'active' }
  ],
  healthcare: [
    { id: 'h1', name: '병원 예약 서비스', campaigns: 4, active: 3, description: '종합검진 예약 서비스', owner: '이지영', created: '2025-02-01', status: 'active' }
  ]
};

// 상태별 배지 컬러
const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const CampaignGroup = () => {
  // const [activeTab, setActiveTab] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<GroupId, boolean>>({
    telecom: true,
    finance: false,
    retail: false,
    healthcare: false
  });

  // 그룹 토글 함수
  const toggleGroup = (groupId: GroupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="p-6 h-full">
      {/* 상단 헤더 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">캠페인 그룹 관리</h1>
      <p className="text-gray-500">캠페인 그룹을 관리하고 성과를 모니터링하세요.</p>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4 my-6">
        <div className="relative flex-1">
          <input type="text" placeholder="캠페인 그룹 검색..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <button className="flex items-center px-3 py-2 border rounded-md text-gray-600">
          <Filter className="h-4 w-4" />
          <span className="ml-2">필터</span>
        </button>
        <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span className="ml-2">그룹 생성</span>
        </button>
      </div>

      {/* 캠페인 그룹 목록 */}
      {Object.keys(campaignGroups).map((groupId) => {
        const groupKey = groupId as GroupId;
        return (
          <div key={groupKey} className="bg-white border rounded-lg shadow-sm mb-4">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50" onClick={() => toggleGroup(groupKey)}>
              <div className="flex items-center">
                <ChevronDown className={`h-5 w-5 mr-2 text-gray-500 transition-transform ${expandedGroups[groupKey] ? 'rotate-180' : ''}`} />
                <span className="font-medium">{groupKey.toUpperCase()} 캠페인 그룹</span>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{campaignGroups[groupKey]?.length ?? 0}</span>
              </div>
              <div className="text-sm text-gray-500">
                활성 캠페인: {campaignGroups[groupKey]?.reduce((acc, group) => acc + group.active, 0) ?? 0}
              </div>
            </button>

            {expandedGroups[groupKey] && (
              <div className="px-4 pb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">그룹명</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">캠페인</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">설명</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">담당자</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">상태</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">생성일</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaignGroups[groupKey]?.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">{group.name}</td>
                        <td className="px-3 py-3">{group.active}/{group.campaigns}</td>
                        <td className="px-3 py-3">{group.description}</td>
                        <td className="px-3 py-3">{group.owner}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[group.status]}`}>
                            {group.status === 'active' ? '활성' : group.status === 'inactive' ? '비활성' : '대기중'}
                          </span>
                        </td>
                        <td className="px-3 py-3">{group.created}</td>
                        <td className="px-3 py-3 text-right flex space-x-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <Edit className="h-4 w-4 text-blue-500" />
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CampaignGroup;
