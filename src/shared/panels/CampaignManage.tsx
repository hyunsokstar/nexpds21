'use client'

import React, { useState } from 'react'

const CampaignManage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTab, setSelectedTab] = useState<string>('active')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const campaignData = Array.from({ length: 50 }, (_, i) => ({
    id: `c-${i + 1}`,
    name: `캠페인 ${i + 1}`,
    type: ['inbound', 'outbound', 'hybrid'][i % 3],
    status: ['active', 'paused', 'scheduled', 'completed', 'draft'][i % 5],
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    target: 5000,
    completed: Math.floor(Math.random() * 5000),
    agents: Math.floor(Math.random() * 50),
    supervisor: `관리자 ${i + 1}`,
    priority: ['high', 'medium', 'low'][i % 3],
    performance: Math.floor(Math.random() * 100),
    lastUpdated: '2025-03-08',
    category: ['telecom', 'finance', 'retail', 'healthcare'][i % 4],
    tags: ['태그1', '태그2', '태그3'],
    description: `캠페인 ${i + 1} 설명입니다.`,
    conversionRate: Math.random() * 100,
  }))

  const filteredCampaigns = campaignData.filter(c =>
    (selectedTab === 'all' || c.status === selectedTab) &&
    (filterCategory === 'all' || c.category === filterCategory) &&
    (c.name.includes(searchQuery) || c.description.includes(searchQuery))
  )

  return (
    <div className="p-6 min-w-[1800px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">캠페인 관리</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="검색..."
          className="border p-2 rounded-md w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="button"
          className="border p-2 rounded-md bg-blue-500 text-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          필터
        </button>
      </div>
      {showFilters && (
        <div className="border p-4 mb-4">
          <label htmlFor="category-filter">카테고리 필터:</label>
          <select
            id="category-filter"
            className="border p-2 ml-2"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="telecom">통신</option>
            <option value="finance">금융</option>
            <option value="retail">리테일</option>
            <option value="healthcare">헬스케어</option>
          </select>
        </div>
      )}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">이름</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">유형</th>
            <th className="border p-2">시작일</th>
            <th className="border p-2">마감일</th>
            <th className="border p-2">완료율</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.map((camp) => (
            <tr key={camp.id} className="border">
              <td className="border p-2">{camp.name}</td>
              <td className="border p-2">{camp.status}</td>
              <td className="border p-2">{camp.type}</td>
              <td className="border p-2">{camp.startDate}</td>
              <td className="border p-2">{camp.endDate || '미정'}</td>
              <td className="border p-2">{((camp.completed / camp.target) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CampaignManage;
