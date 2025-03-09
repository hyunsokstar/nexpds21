'use client'

import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Plus, MoreHorizontal, Trash2, Edit, Eye } from 'lucide-react'

const CampaignGroup = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState({
    'telecom': true,
    'finance': false,
    'retail': false,
    'healthcare': false
  })

  // 그룹 토글 함수
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  // 더미 캠페인 그룹 데이터
  const campaignGroups = {
    'telecom': [
      { id: 't1', name: 'SK Telecom 캠페인 그룹', campaigns: 12, active: 8, description: '모바일 서비스 및 요금제 관련 캠페인 그룹입니다.', owner: '김영수', created: '2025-01-15', status: 'active' },
      { id: 't2', name: 'KT 프로모션', campaigns: 8, active: 6, description: '신규 고객 유치 및 기존 고객 유지를 위한 프로모션 캠페인 그룹입니다.', owner: '박지민', created: '2025-02-03', status: 'active' },
      { id: 't3', name: 'LG U+ 서비스', campaigns: 10, active: 7, description: '인터넷, IPTV 결합상품 관련 캠페인 그룹입니다.', owner: '이하늘', created: '2025-01-22', status: 'active' },
      { id: 't4', name: 'SKB 인터넷', campaigns: 5, active: 3, description: '인터넷 서비스 가입 및 변경 관련 캠페인 그룹입니다.', owner: '정민우', created: '2025-02-10', status: 'inactive' },
    ],
    'finance': [
      { id: 'f1', name: '신한은행 캠페인 그룹', campaigns: 15, active: 10, description: '개인 대출 상품 및 신용카드 관련 캠페인 그룹입니다.', owner: '최서연', created: '2025-01-05', status: 'active' },
      { id: 'f2', name: '국민은행 금융상품', campaigns: 7, active: 5, description: '예금 및 적금 상품 관련 캠페인 그룹입니다.', owner: '한지훈', created: '2025-01-18', status: 'active' },
      { id: 'f3', name: '우리은행 주택담보대출', campaigns: 3, active: 2, description: '주택담보대출 상품 관련 캠페인 그룹입니다.', owner: '송혜진', created: '2025-02-07', status: 'pending' },
    ],
    'retail': [
      { id: 'r1', name: '이마트 캠페인 그룹', campaigns: 9, active: 6, description: '계절 할인 및 프로모션 관련 캠페인 그룹입니다.', owner: '김태희', created: '2025-01-08', status: 'active' },
      { id: 'r2', name: '롯데마트 회원', campaigns: 5, active: 4, description: '신규 회원 가입 및 혜택 안내 캠페인 그룹입니다.', owner: '박준혁', created: '2025-01-25', status: 'active' },
    ],
    'healthcare': [
      { id: 'h1', name: '병원 예약 서비스', campaigns: 4, active: 3, description: '종합검진 및 예약 서비스 관련 캠페인 그룹입니다.', owner: '이지영', created: '2025-02-01', status: 'active' },
      { id: 'h2', name: '약국 서비스', campaigns: 2, active: 1, description: '처방전 알림 및 복약 안내 관련 캠페인 그룹입니다.', owner: '강현우', created: '2025-02-12', status: 'pending' },
      { id: 'h3', name: '건강검진 알림', campaigns: 3, active: 0, description: '정기 건강검진 안내 관련 캠페인 그룹입니다.', owner: '최동호', created: '2025-01-30', status: 'inactive' },
    ]
  }

  // 상태별 배지 컬러 맵핑
  const statusColors = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="p-6 h-full">
      {/* 상단 헤더 영역 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">캠페인 그룹 관리</h1>
        <p className="text-gray-500">
          캠페인 그룹을 관리하고 성과를 모니터링하세요. 새 그룹을 생성하거나 기존 그룹을 편집할 수 있습니다.
        </p>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="캠페인 그룹 검색..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>필터</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>그룹 생성</span>
          </button>
        </div>
      </div>

      {/* 탭 영역 */}
      <div className="border-b mb-6">
        <div className="flex space-x-6">
          <button
            className={`pb-2 px-1 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            전체 그룹
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('active')}
          >
            활성 그룹
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === 'inactive' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inactive')}
          >
            비활성 그룹
          </button>
        </div>
      </div>

      {/* 통계 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">전체 그룹</h3>
          <p className="text-2xl font-bold">16</p>
          <div className="mt-2 text-xs text-green-600">
            <span>지난 주 대비 +2</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">활성 캠페인</h3>
          <p className="text-2xl font-bold">55</p>
          <div className="mt-2 text-xs text-green-600">
            <span>지난 주 대비 +5</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">평균 사용률</h3>
          <p className="text-2xl font-bold">72%</p>
          <div className="mt-2 text-xs text-red-600">
            <span>지난 주 대비 -3%</span>
          </div>
        </div>
      </div>

      {/* 캠페인 그룹 목록 */}
      <div className="bg-white border rounded-lg shadow-sm mb-8">
        {/* 통신사 그룹 */}
        <div className="border-b">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleGroup('telecom')}
          >
            <div className="flex items-center">
              <ChevronDown
                className={`h-5 w-5 mr-2 text-gray-500 transition-transform ${expandedGroups.telecom ? 'transform rotate-180' : ''}`}
              />
              <span className="font-medium">통신사 캠페인 그룹</span>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {campaignGroups.telecom.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              활성 캠페인: {campaignGroups.telecom.reduce((acc, group) => acc + group.active, 0)}
            </div>
          </button>
          
          {expandedGroups.telecom && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">그룹명</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">캠페인</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaignGroups.telecom.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{group.name}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{group.active}/{group.campaigns}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-500 line-clamp-1">{group.description}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{group.owner}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[group.status]}`}>
                            {group.status === 'active' ? '활성' : 
                             group.status === 'inactive' ? '비활성' : '대기중'}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {group.created}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-gray-500 hover:text-gray-700">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-500 hover:text-blue-700">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 금융 그룹 */}
        <div className="border-b">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleGroup('finance')}
          >
            <div className="flex items-center">
              <ChevronDown
                className={`h-5 w-5 mr-2 text-gray-500 transition-transform ${expandedGroups.finance ? 'transform rotate-180' : ''}`}
              />
              <span className="font-medium">금융 캠페인 그룹</span>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {campaignGroups.finance.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              활성 캠페인: {campaignGroups.finance.reduce((acc, group) => acc + group.active, 0)}
            </div>
          </button>
          
          {expandedGroups.finance && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">그룹명</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">캠페인</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaignGroups.finance.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{group.name}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{group.active}/{group.campaigns}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-500 line-clamp-1">{group.description}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{group.owner}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[group.status]}`}>
                            {group.status === 'active' ? '활성' : 
                             group.status === 'inactive' ? '비활성' : '대기중'}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {group.created}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-gray-500 hover:text-gray-700">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-500 hover:text-blue-700">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 리테일 그룹 */}
        <div className="border-b">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleGroup('retail')}
          >
            <div className="flex items-center">
              <ChevronDown
                className={`h-5 w-5 mr-2 text-gray-500 transition-transform ${expandedGroups.retail ? 'transform rotate-180' : ''}`}
              />
              <span className="font-medium">리테일 캠페인 그룹</span>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {campaignGroups.retail.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              활성 캠페인: {campaignGroups.retail.reduce((acc, group) => acc + group.active, 0)}
            </div>
          </button>
          
          {expandedGroups.retail && (
            <div className="px-4 pb-4">
              {/* 동일한 테이블 포맷 */}
            </div>
          )}
        </div>

        {/* 헬스케어 그룹 */}
        <div>
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleGroup('healthcare')}
          >
            <div className="flex items-center">
              <ChevronDown
                className={`h-5 w-5 mr-2 text-gray-500 transition-transform ${expandedGroups.healthcare ? 'transform rotate-180' : ''}`}
              />
              <span className="font-medium">헬스케어 캠페인 그룹</span>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {campaignGroups.healthcare.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              활성 캠페인: {campaignGroups.healthcare.reduce((acc, group) => acc + group.active, 0)}
            </div>
          </button>
          
          {expandedGroups.healthcare && (
            <div className="px-4 pb-4">
              {/* 동일한 테이블 포맷 */}
            </div>
          )}
        </div>
      </div>

      {/* 추가 컨텐츠 - 주간 활동 요약 */}
      <div className="bg-white border rounded-lg shadow-sm p-5 mb-8">
        <h2 className="text-lg font-medium mb-4">주간 활동 요약</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">신규 그룹 생성</span>
            </div>
            <span className="text-sm font-medium">3</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">그룹 업데이트</span>
            </div>
            <span className="text-sm font-medium">12</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">그룹 비활성화</span>
            </div>
            <span className="text-sm font-medium">1</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm">성과 리포트 확인</span>
            </div>
            <span className="text-sm font-medium">8</span>
          </div>
        </div>
      </div>

      {/* 추가 컨텐츠 - 스크롤 테스트를 위한 섹션 */}
      <div className="bg-white border rounded-lg shadow-sm p-5 mb-8">
        <h2 className="text-lg font-medium mb-4">최근 변경 이력</h2>
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-start border-b border-gray-100 pb-3">
              <div className="flex-shrink-0 w-10 text-xs text-gray-500">
                {index + 1}.
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {['SK Telecom 캠페인 그룹 수정', 'KT 프로모션 캠페인 추가', '신한은행 캠페인 그룹 활성화', '이마트 캠페인 그룹 정보 업데이트'][index % 4]}
                </div>
                <div className="text-xs text-gray-500">
                  {`2025-03-${String(index + 1).padStart(2, '0')} ${(9 + index % 8).toString().padStart(2, '0')}:${(10 + index % 50).toString().padStart(2, '0')}`}
                </div>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500">
                {['김영수', '박지민', '이하늘', '정민우', '최서연'][index % 5]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CampaignGroup