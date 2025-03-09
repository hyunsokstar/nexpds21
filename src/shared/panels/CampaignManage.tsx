'use client'

import React, { useState, useEffect } from 'react';
import { Phone, Clock, User, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/lib/utils';

// 타입 정의 - shadcn/ui Badge 컴포넌트에서 지원하는 variant 타입으로 수정
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined;

interface CampaignManageProps {
  campaignId?: string;
  campaignName?: string;
  campaignStatus?: string;
  campaignPath?: string;
}

interface CampaignData {
  id: string;
  name: string;
  status: string;
  path: string;
  agentCount: number;
  callsToday: number;
  averageCallTime: string;
  satisfaction: number;
  lastUpdated: string;
}

const CampaignManage: React.FC<CampaignManageProps> = ({
  campaignId = '기본 캠페인',
  campaignName = '미지정 캠페인',
  campaignStatus = 'inactive',
  campaignPath = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  // 데이터 로드
  useEffect(() => {
    const loadCampaignData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCampaignData({
        id: campaignId,
        name: campaignName,
        status: campaignStatus,
        path: campaignPath,
        agentCount: 12,
        callsToday: 483,
        averageCallTime: '3:25',
        satisfaction: 4.2,
        lastUpdated: new Date().toLocaleString(),
      });

      setIsLoading(false);
    };

    loadCampaignData();
  }, [campaignId, campaignName, campaignStatus, campaignPath]);

  // 헬퍼 함수 - variant를 Badge에서 지원하는 타입으로 변환
  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'active': return 'default';
      case 'warning': return 'destructive'; // warning 대신 destructive 사용
      default: return 'secondary';
    }
  };

  // 상태에 따른 추가 클래스 이름 반환
  const getBadgeClassNames = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return '';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return '활성';
      case 'warning': return '경고';
      default: return '비활성';
    }
  };

  // 로딩 UI
  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!campaignData) return null;

  return (
    <div className="p-6 space-y-6">
      {/* 캠페인 헤더 카드 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{campaignData.name}</CardTitle>
              <CardDescription>캠페인 ID: {campaignData.id}</CardDescription>
            </div>
            <Badge
              variant={getBadgeVariant(campaignData.status)}
              className={cn(getBadgeClassNames(campaignData.status))}
            >
              {getStatusText(campaignData.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">상담원 수</div>
                <div className="text-2xl font-bold mt-1">{campaignData.agentCount}명</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">오늘 통화량</div>
                <div className="text-2xl font-bold mt-1">{campaignData.callsToday}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">평균 통화 시간</div>
                <div className="text-2xl font-bold mt-1">{campaignData.averageCallTime}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-muted-foreground">고객 만족도</div>
                <div className="text-2xl font-bold mt-1">{campaignData.satisfaction}/5.0</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 탭 영역 */}
      <Card>
        <Tabs defaultValue="info" className="w-full">
          <CardHeader className="pb-0">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              {[
                { value: 'info', icon: <Phone className="h-4 w-4" />, label: '기본 정보' },
                { value: 'schedule', icon: <Clock className="h-4 w-4" />, label: '스케줄' },
                { value: 'agents', icon: <User className="h-4 w-4" />, label: '상담원' },
                { value: 'scripts', icon: <MessageSquare className="h-4 w-4" />, label: '스크립트' },
                { value: 'stats', icon: <BarChart3 className="h-4 w-4" />, label: '통계' },
                { value: 'settings', icon: <Settings className="h-4 w-4" />, label: '설정' }
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="info" className="mt-0 space-y-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="pt-6">
                  <CardTitle className="text-blue-700 text-sm">캠페인 정보</CardTitle>
                  <CardDescription className="text-blue-600">
                    {campaignData.name} 캠페인에 대한 상세 정보입니다.
                  </CardDescription>
                </CardContent>
              </Card>

              {campaignData.path && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium">연결 경로</div>
                    <p className="text-sm text-muted-foreground mt-1">{campaignData.path}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 다른 탭들 - 간소화를 위해 동일한 방식으로 처리 */}
            {['schedule', 'agents', 'scripts', 'stats', 'settings'].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                <Card>
                  <CardContent className="pt-6 h-32 flex items-center justify-center">
                    <p className="text-muted-foreground">{tabValue} 내용이 이곳에 표시됩니다.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CampaignManage;