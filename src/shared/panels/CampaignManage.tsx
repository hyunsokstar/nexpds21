'use client'

import React, { useState, useEffect } from 'react';
import { Phone, Clock, User, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';

interface CampaignManageProps {
  campaignId: string;
  campaignName: string;
  campaignStatus: string;
  campaignPath: string;
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
  campaignId,
  campaignName,
  campaignStatus,
  campaignPath
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  // 가상의 데이터 로드 효과
  useEffect(() => {
    // 실제 환경에서는 API 호출로 대체
    const loadCampaignData = async () => {
      setIsLoading(true);

      // 실제 API 호출을 시뮬레이션(1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 목업 데이터
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

  // 상태에 따른 배지 변형 결정
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'warning':
        return 'warning';
      case 'inactive':
      default:
        return 'secondary';
    }
  };

  // 상태에 따른 텍스트 결정
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'warning':
        return '경고';
      case 'inactive':
      default:
        return '비활성';
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
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">캠페인 데이터를 불러올 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Badge variant={getBadgeVariant(campaignData.status) as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'}>
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
          <div className="mt-4 text-xs text-muted-foreground">
            마지막 업데이트: {campaignData.lastUpdated}
          </div>
        </CardContent>
      </Card>

      {/* 캠페인 상세 내용 (탭) */}
      <Card>
        <Tabs defaultValue="info" className="w-full">
          <CardHeader className="pb-0">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">기본 정보</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">스케줄</span>
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">상담원</span>
              </TabsTrigger>
              <TabsTrigger value="scripts" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">스크립트</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">통계</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">설정</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="info" className="mt-0 space-y-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="pt-6">
                  <CardTitle className="text-blue-700 text-sm">캠페인 정보</CardTitle>
                  <CardDescription className="text-blue-600">
                    {campaignName} 캠페인에 대한 상세 정보입니다.
                    더블 클릭으로 탭을 열었습니다.
                  </CardDescription>
                </CardContent>
              </Card>

              {campaignPath && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium">연결 경로</div>
                    <p className="text-sm text-muted-foreground mt-1">{campaignPath}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium">캠페인 설명</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    이 캠페인은 {campaignName}을(를) 위한 것으로, 현재 상태는 {' '}
                    <span className={
                      campaignStatus === 'active' ? 'text-green-600 font-medium' :
                        campaignStatus === 'warning' ? 'text-orange-600 font-medium' :
                          'text-gray-600 font-medium'
                    }>
                      {getStatusText(campaignStatus)}
                    </span> 입니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 다른 탭 컨텐츠 */}
            <TabsContent value="schedule" className="mt-0">
              <Card>
                <CardContent className="pt-6 h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">스케줄 관리 내용이 이곳에 표시됩니다.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="mt-0">
              <Card>
                <CardContent className="pt-6 h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">상담원 관리 내용이 이곳에 표시됩니다.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scripts" className="mt-0">
              <Card>
                <CardContent className="pt-6 h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">스크립트 관리 내용이 이곳에 표시됩니다.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <Card>
                <CardContent className="pt-6 h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">통계 정보가 이곳에 표시됩니다.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card>
                <CardContent className="pt-6 h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">캠페인 설정이 이곳에 표시됩니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CampaignManage;