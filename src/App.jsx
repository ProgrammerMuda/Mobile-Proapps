import React, { useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import { AndroidMobileFrame, Header, BottomNavigation } from './components/layout';
import {
  HomeView,
  SplashScreen,
  LoginView,
  BMDashboardView,
  OverviewReportView,
  OverviewHeader,
  BuildingSummaryView,
  BuildingSummaryHeader,
  FinancialDetailView,
  FinancialDetailHeader,
  RequestDetailView,
  RequestDetailHeader,
  AttendanceDetailView,
  AttendanceDetailHeader,
  TenantUnitView,
  TenantUnitHeader,
  UnitTowerView,
  UnitTowerHeader,
  UnitDetailView,
  UnitDetailHeader,
  UnitDetailFooter,
  ProfileView,
} from './views';

function App() {
  const { t } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState('home'); // 'splash' | 'login' | 'home' | 'overview' | 'profile' | 'building-summary' | 'financial-detail' | 'request-detail' | 'attendance-detail' | 'tenant-unit' | 'unit-tower' | 'unit-detail'
  const [activeTab, setActiveTab] = useState('home');
  const [userSession, setUserSession] = useState({
    name: 'Ahmad Pratama',
    email: 'bm@proapps.id',
    unitOrDept: 'Building Management',
    roleCode: 'BM',
  });
  const [selectedTower, setSelectedTower] = useState({ name: 'Tower A', id: 'tower-a' });
  const [selectedUnit, setSelectedUnit] = useState({
    unitNo: 'A0101',
    floor: '1',
    residentType: 'Owner',
    residentName: 'Cindy Claudia',
    status: 'Occupied',
  });
  const [unitSearchQuery, setUnitSearchQuery] = useState('');
  const [unitStatusFilter, setUnitStatusFilter] = useState('ALL');
  const [unitFloorFilter, setUnitFloorFilter] = useState('ALL');
  const [isUnitFilterModalOpen, setIsUnitFilterModalOpen] = useState(false);
  const [unitDetailTab, setUnitDetailTab] = useState('unit-info');

  const [financialPeriod, setFinancialPeriod] = useState('This month');
  const [isFinancialPickerOpen, setIsFinancialPickerOpen] = useState(false);
  const [requestPeriod, setRequestPeriod] = useState('Last 7 days');
  const [isRequestPickerOpen, setIsRequestPickerOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date(2026, 6, 7));
  const [isAttendancePickerOpen, setIsAttendancePickerOpen] = useState(false);

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (credentials) => {
    setUserSession(credentials);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUserSession(null);
    setCurrentScreen('login');
  };

  const handleSwitchRole = () => {
    const isTenant = userSession?.roleCode === 'TENANT';
    setUserSession({
      name: isTenant ? 'Ahmad Pratama' : 'Budi Santoso',
      email: isTenant ? 'bm@proapps.id' : 'budi.santoso@gmail.com',
      unitOrDept: isTenant ? 'Building Management' : 'Unit 12A • Tower Jasmine',
      roleCode: isTenant ? 'BM' : 'TENANT',
    });
  };

  const handleReplaySplash = () => {
    setCurrentScreen('splash');
  };

  const handlePrevAttendanceDay = () => {
    const prev = new Date(attendanceDate);
    prev.setDate(prev.getDate() - 1);
    setAttendanceDate(prev);
  };

  const handleNextAttendanceDay = () => {
    const next = new Date(attendanceDate);
    next.setDate(next.getDate() + 1);
    setAttendanceDate(next);
  };

  const isBMUser = userSession?.roleCode === 'BM';

  const frameTheme = currentScreen === 'splash' || currentScreen === 'login'
    ? 'dark'
    : (currentScreen === 'home' || currentScreen === 'profile' ? 'dark-header' : 'light');

  const gestureTheme = currentScreen === 'splash' ? 'dark' : 'light';

  return (
    <AndroidMobileFrame
      theme={frameTheme}
      gestureTheme={gestureTheme}
      header={
        currentScreen === 'overview' ? (
          <OverviewHeader />
        ) : currentScreen === 'tenant-unit' ? (
          <TenantUnitHeader onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'unit-tower' ? (
          <UnitTowerHeader
            towerName={selectedTower?.name || 'Tower A'}
            onBack={() => setCurrentScreen('tenant-unit')}
            searchQuery={unitSearchQuery}
            onSearchChange={setUnitSearchQuery}
            onClearSearch={() => setUnitSearchQuery('')}
            onToggleFilter={() => setIsUnitFilterModalOpen(true)}
            hasActiveFilter={unitStatusFilter !== 'ALL' || unitFloorFilter !== 'ALL'}
          />
        ) : currentScreen === 'unit-detail' ? (
          <UnitDetailHeader
            unit={selectedUnit}
            unitNo={selectedUnit?.unitNo || 'A0101'}
            activeTab={unitDetailTab}
            onTabChange={setUnitDetailTab}
            onBack={() => setCurrentScreen('unit-tower')}
          />
        ) : currentScreen === 'building-summary' ? (
          <BuildingSummaryHeader onBack={() => setCurrentScreen('overview')} />
        ) : currentScreen === 'financial-detail' ? (
          <FinancialDetailHeader
            onBack={() => setCurrentScreen('overview')}
            period={financialPeriod}
            onOpenPicker={() => setIsFinancialPickerOpen(true)}
          />
        ) : currentScreen === 'request-detail' ? (
          <RequestDetailHeader
            onBack={() => setCurrentScreen('overview')}
            period={requestPeriod}
            onOpenPicker={() => setIsRequestPickerOpen(true)}
          />
        ) : currentScreen === 'attendance-detail' ? (
          <AttendanceDetailHeader
            onBack={() => setCurrentScreen('overview')}
            currentDate={attendanceDate}
            onPrevDay={handlePrevAttendanceDay}
            onNextDay={handleNextAttendanceDay}
            onOpenPicker={() => setIsAttendancePickerOpen(true)}
          />
        ) : null
      }
      bottomNav={
        (currentScreen === 'home' || currentScreen === 'overview' || currentScreen === 'profile') ? (
          <BottomNavigation
            activeTab={currentScreen === 'overview' ? 'overview' : (currentScreen === 'profile' ? 'profile' : 'home')}
            onSelectTab={(tabId) => {
              if (tabId === 'overview') {
                setActiveTab('overview');
                setCurrentScreen('overview');
              } else if (tabId === 'home') {
                setActiveTab('home');
                setCurrentScreen('home');
              } else if (tabId === 'profile') {
                setActiveTab('profile');
                setCurrentScreen('profile');
              } else if (tabId === 'chat') {
                setActiveTab('chat');
                alert(t('nav.chatAlert'));
              } else {
                setActiveTab(tabId);
              }
            }}
          />
        ) : (currentScreen === 'unit-detail' && unitDetailTab === 'unit-info') ? (
          <UnitDetailFooter
            unitCode={selectedUnit?.unitNo || 'A0101'}
            onEdit={() => alert('Edit Unit Information: ' + (selectedUnit?.unitNo || 'A0101'))}
          />
        ) : null
      }
    >
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} duration={2800} />
      )}

      {currentScreen === 'login' && (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() => alert(t('login.forgotAlert'))}
        />
      )}

      {currentScreen === 'home' && (
        <BMDashboardView
          user={userSession}
          onLogout={handleLogout}
          onNavigateToOverview={() => setCurrentScreen('overview')}
          onNavigateMenu={(menuId) => {
            if (menuId === 'tenant-unit') {
              setCurrentScreen('tenant-unit');
            }
          }}
        />
      )}

      {currentScreen === 'tenant-unit' && (
        <TenantUnitView
          onSelectTower={(tower) => {
            setSelectedTower(tower);
            setUnitSearchQuery('');
            setUnitStatusFilter('ALL');
            setUnitFloorFilter('ALL');
            setIsUnitFilterModalOpen(false);
            setCurrentScreen('unit-tower');
          }}
        />
      )}

      {currentScreen === 'unit-tower' && (
        <UnitTowerView
          tower={selectedTower}
          searchQuery={unitSearchQuery}
          statusFilter={unitStatusFilter}
          setStatusFilter={setUnitStatusFilter}
          floorFilter={unitFloorFilter}
          setFloorFilter={setUnitFloorFilter}
          isFilterModalOpen={isUnitFilterModalOpen}
          setIsFilterModalOpen={setIsUnitFilterModalOpen}
          onSelectUnit={(unit) => {
            setSelectedUnit(unit);
            setUnitDetailTab('unit-info');
            setCurrentScreen('unit-detail');
          }}
        />
      )}

      {currentScreen === 'unit-detail' && (
        <UnitDetailView
          unit={selectedUnit}
          tower={selectedTower}
          activeTab={unitDetailTab}
        />
      )}

      {currentScreen === 'overview' && (
        <OverviewReportView
          user={userSession}
          onNavigateDetails={(section) => {
            const secLower = section.toLowerCase();
            if (secLower === 'building summary') {
              setCurrentScreen('building-summary');
            } else if (secLower === 'finances this month') {
              setCurrentScreen('financial-detail');
            } else if (secLower === 'tenant requests') {
              setCurrentScreen('request-detail');
            } else if (secLower === 'employee attendance') {
              setCurrentScreen('attendance-detail');
            } else {
              alert(t('overview.detailsAlert', { section }));
            }
          }}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileView
          user={userSession}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      )}

      {currentScreen === 'building-summary' && (
        <BuildingSummaryView />
      )}

      {currentScreen === 'financial-detail' && (
        <FinancialDetailView
          period={financialPeriod}
          onPeriodChange={setFinancialPeriod}
          isPickerOpen={isFinancialPickerOpen}
          setIsPickerOpen={setIsFinancialPickerOpen}
        />
      )}

      {currentScreen === 'request-detail' && (
        <RequestDetailView
          period={requestPeriod}
          onPeriodChange={setRequestPeriod}
          isPickerOpen={isRequestPickerOpen}
          setIsPickerOpen={setIsRequestPickerOpen}
        />
      )}

      {currentScreen === 'attendance-detail' && (
        <AttendanceDetailView
          currentDate={attendanceDate}
          onDateChange={setAttendanceDate}
          isPickerOpen={isAttendancePickerOpen}
          setIsPickerOpen={setIsAttendancePickerOpen}
        />
      )}
    </AndroidMobileFrame>
  );
}

export default App;
