import { Building2, Package, Shield, Users } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useAccountStats, useArtifactStats, useMuseumStats } from './hooks/useDashboardStats';

export default function AdminDashboard() {
  const { data: accountStats, isLoading: isLoadingAccounts } = useAccountStats();
  const { data: museumStats, isLoading: isLoadingMuseums } = useMuseumStats();
  const { data: artifactStats, isLoading: isLoadingArtifacts } = useArtifactStats();

  const isLoading = isLoadingAccounts || isLoadingMuseums || isLoadingArtifacts;

  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const donutRef = useRef<SVGSVGElement>(null);

  // Process role distribution for donut chart
  const roleDistribution = useMemo(() => {
    if (!accountStats?.accountByRole) {
      return [];
    }

    const colors = ['#FF6B35', '#F7931E', '#FFB570', '#FFCC9A'];
    const roles = Object.entries(accountStats.accountByRole)
      .filter(([_, data]) => data.count > 0)
      .map(([role, data], index) => ({
        name: role,
        count: data.count,
        color: colors[index % colors.length] || '#FFE0CC',
        percentage: accountStats.totalActiveUsers > 0 ? (data.count / accountStats.totalActiveUsers) * 100 : 0,
      }));

    return roles;
  }, [accountStats]);

  // Generate donut chart paths
  const generateDonutPath = (data: typeof roleDistribution) => {
    const radius = 85;
    const innerRadius = 60;
    let cumulativePercentage = 0;

    return data.map((item, index) => {
      const startAngle = (cumulativePercentage * 360) / 100 - 90;
      const endAngle = ((cumulativePercentage + item.percentage) * 360) / 100 - 90;
      cumulativePercentage += item.percentage;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = 100 + radius * Math.cos(startAngleRad);
      const y1 = 100 + radius * Math.sin(startAngleRad);
      const x2 = 100 + radius * Math.cos(endAngleRad);
      const y2 = 100 + radius * Math.sin(endAngleRad);

      const x3 = 100 + innerRadius * Math.cos(endAngleRad);
      const y3 = 100 + innerRadius * Math.sin(endAngleRad);
      const x4 = 100 + innerRadius * Math.cos(startAngleRad);
      const y4 = 100 + innerRadius * Math.sin(startAngleRad);

      const largeArc = endAngle - startAngle > 180 ? 1 : 0;

      const hoverRadius = 90;
      const hx1 = 100 + hoverRadius * Math.cos(startAngleRad);
      const hy1 = 100 + hoverRadius * Math.sin(startAngleRad);
      const hx2 = 100 + hoverRadius * Math.cos(endAngleRad);
      const hy2 = 100 + hoverRadius * Math.sin(endAngleRad);
      const hx3 = 100 + innerRadius * Math.cos(endAngleRad);
      const hy3 = 100 + innerRadius * Math.sin(endAngleRad);
      const hx4 = 100 + innerRadius * Math.cos(startAngleRad);
      const hy4 = 100 + innerRadius * Math.sin(startAngleRad);

      return {
        ...item,
        index,
        path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`,
        hoverPath: `M ${hx1} ${hy1} A ${hoverRadius} ${hoverRadius} 0 ${largeArc} 1 ${hx2} ${hy2} L ${hx3} ${hy3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${hx4} ${hy4} Z`,
        centerX: 100 + ((radius + innerRadius) / 2) * Math.cos((startAngleRad + endAngleRad) / 2),
        centerY: 100 + ((radius + innerRadius) / 2) * Math.sin((startAngleRad + endAngleRad) / 2),
      };
    });
  };

  const donutPaths = generateDonutPath(roleDistribution);

  // Handle donut chart hover
  const handleDonutMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!donutRef.current) return;

    const rect = donutRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    let cumulativeAngle = 0;
    for (let i = 0; i < roleDistribution.length; i++) {
      const segmentAngle = (roleDistribution[i]!.percentage * 360) / 100;
      if (normalizedAngle >= cumulativeAngle && normalizedAngle <= cumulativeAngle + segmentAngle) {
        setHoveredSlice(i);
        return;
      }
      cumulativeAngle += segmentAngle;
    }
  };

  const handleMouseLeave = () => {
    setHoveredSlice(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Người Dùng</div>
            <div className="h-8 w-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-chart-2" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">{accountStats?.totalActiveUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{accountStats?.newAccountsLast7Days.totalItems || 0} trong 7 ngày
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Bảo Tàng</div>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">{museumStats?.totalMuseums || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {museumStats?.museumsByStatus.Active.count || 0} đang hoạt động
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Hiện Vật</div>
            <div className="h-8 w-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-chart-3" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">{artifactStats?.totalArtifacts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {artifactStats?.artifactsByStatus.OnDisplay.count || 0} đang trưng bày
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Vai Trò</div>
            <div className="h-8 w-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-chart-4" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-foreground">{roleDistribution.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Phân quyền hệ thống</p>
          </div>
        </div>
      </div>

      {/* Main Chart Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* New Accounts List */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-foreground">Tài Khoản Mới</div>
                <p className="text-sm text-muted-foreground mt-1">7 ngày gần đây</p>
              </div>
            </div>
          </div>
          <div className="p-6 pt-2">
            <div className="space-y-2">
              {accountStats?.newAccountsLast7Days.items.length ? (
                accountStats.newAccountsLast7Days.items.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{account.fullName}</p>
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-chart-2/10 text-chart-2 border border-chart-2/20 font-medium">
                        {account.roleName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(account.createAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Chưa có tài khoản mới</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Distribution Donut Chart */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 pb-2">
            <div className="text-xl font-semibold text-foreground">Phân Bổ Vai Trò</div>
            <p className="text-sm text-muted-foreground">Thống kê theo vai trò</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-center relative">
                <div className="relative">
                  <svg
                    ref={donutRef}
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="overflow-visible"
                    onMouseMove={handleDonutMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <defs>
                      <filter id="donutShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                      </filter>
                      <filter id="donutGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {donutPaths.map((item, index) => (
                      <g key={index}>
                        <path
                          d={hoveredSlice === index ? item.hoverPath : item.path}
                          fill={item.color}
                          className="transition-all duration-300 cursor-pointer"
                          stroke="white"
                          strokeWidth="3"
                          filter={hoveredSlice === index ? 'url(#donutGlow)' : 'url(#donutShadow)'}
                          style={{
                            opacity: hoveredSlice === null || hoveredSlice === index ? 1 : 0.6,
                            transform: hoveredSlice === index ? 'scale(1.02)' : 'scale(1)',
                            transformOrigin: '100px 100px',
                          }}
                        />
                      </g>
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-background rounded-full p-4 shadow-lg border border-border">
                      <div className="text-3xl font-bold text-foreground">{accountStats?.totalActiveUsers || 0}</div>
                      <div className="text-sm text-muted-foreground">Người dùng</div>
                    </div>
                  </div>

                  {hoveredSlice !== null && (
                    <div
                      className="absolute z-10 bg-slate-800 text-white rounded-lg px-3 py-2 pointer-events-none shadow-xl"
                      style={{
                        left: `${donutPaths[hoveredSlice]?.centerX}px`,
                        top: `${donutPaths[hoveredSlice]?.centerY}px`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-8px',
                      }}
                    >
                      <div className="text-center">
                        <div className="font-bold text-sm">{roleDistribution[hoveredSlice]?.name}</div>
                        <div className="text-xs opacity-80">
                          {roleDistribution[hoveredSlice]?.count} người (
                          {roleDistribution[hoveredSlice]?.percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2">
                {roleDistribution.map((role, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      hoveredSlice === index ? 'bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onMouseEnter={() => setHoveredSlice(index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                    <span className="text-xs text-muted-foreground">{role.name}</span>
                    <span className="text-xs font-medium text-foreground">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
