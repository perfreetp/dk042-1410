import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Button, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ReportItem from '@/components/ReportItem';
import { ReportRecord, ReportStatus, ReportType } from '@/types';
import { reportList as mockList } from '@/data/reportList';
import { getReportTypeText } from '@/utils/format';

const NEW_REPORT_STORAGE = 'newReportList';
const DETAIL_STORAGE_KEY = 'reportDetailContext';

type TabType = 'all' | ReportStatus;

const statusTabs: Array<{ key: TabType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'resolved', label: '已解决' },
  { key: 'closed', label: '已关闭' }
];

const typeTabs: Array<{ key: 'all' | ReportType; label: string }> = [
  { key: 'all', label: '全部类型' },
  { key: 'blur', label: '铭牌模糊' },
  { key: 'mismatch', label: '序号不符' },
  { key: 'noRecord', label: '系统无记录' },
  { key: 'other', label: '其他' }
];

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [activeType, setActiveType] = useState<'all' | ReportType>('all');
  const [searchText, setSearchText] = useState('');
  const [list, setList] = useState<ReportRecord[]>(mockList);

  const loadReportList = useCallback(() => {
    try {
      const newRaw = Taro.getStorageSync(NEW_REPORT_STORAGE);
      const newList: ReportRecord[] = Array.isArray(newRaw) ? newRaw : [];
      console.log('[Report] 读取新上报单数量:', newList.length);
      const merged = [
        ...newList,
        ...mockList.filter(m => !newList.find(n => n.id === m.id))
      ];
      setList(merged);
    } catch (e) {
      console.error('[Report] 读取上报列表失败，使用mock:', e);
      setList(mockList);
    }
  }, []);

  useDidShow(() => {
    console.log('[Report] useDidShow，刷新上报列表');
    loadReportList();
  });

  const filteredList = useMemo(() => {
    let result = list;

    if (activeTab !== 'all') {
      result = result.filter(r => r.status === activeTab);
    }

    if (activeType !== 'all') {
      result = result.filter(r => r.reportType === activeType);
    }

    if (searchText.trim()) {
      const kw = searchText.trim().toLowerCase();
      result = result.filter(r =>
        r.aircraftNo.toLowerCase().includes(kw) ||
        (r.serialNumber && r.serialNumber.toLowerCase().includes(kw)) ||
        r.flightNo.toLowerCase().includes(kw) ||
        r.position.toLowerCase().includes(kw) ||
        r.reportNo.toLowerCase().includes(kw) ||
        (r.partName && r.partName.toLowerCase().includes(kw)) ||
        r.remark.toLowerCase().includes(kw)
      );
    }

    return result;
  }, [list, activeTab, activeType, searchText]);

  const stats = {
    pending: list.filter(r => r.status === 'pending').length,
    processing: list.filter(r => r.status === 'processing').length,
    resolved: list.filter(r => r.status === 'resolved').length
  };

  const goCreateReport = () => {
    console.log('[Report] 新建异常上报');
    Taro.removeStorageSync('presetReportContext');
    Taro.navigateTo({ url: '/pages/report-create/index' });
  };

  const goReportDetail = (item: ReportRecord) => {
    console.log('[Report] 查看上报详情:', item.reportNo, '类型:', item.reportType, '照片:', item.photos.length);
    try {
      Taro.setStorageSync(DETAIL_STORAGE_KEY, item);
    } catch (e) {
      console.warn('[Report] storage写详情失败，改用URL传id', e);
    }
    Taro.navigateTo({ url: `/pages/report-detail/index?id=${item.id}` });
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerBar}>
        <Text className={styles.headerTitle}>异常拍照上报</Text>
        <Text className={styles.headerDesc}>铭牌模糊 / 序号不符 / 系统无记录 · 提交MCC处理</Text>
        <Button className={styles.newReportBtn} onClick={goCreateReport}>
          + 新建拍照上报
        </Button>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statNum + ' ' + styles.pendingColor}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待处理</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum + ' ' + styles.processingColor}>{stats.processing}</Text>
          <Text className={styles.statLabel}>处理中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum + ' ' + styles.resolvedColor}>{stats.resolved}</Text>
          <Text className={styles.statLabel}>已解决</Text>
        </View>
      </View>

      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder='搜索飞机号 / 序号 / 航班号 / 位置'
          placeholderStyle='color: #C9CDD4'
          value={searchText}
          onInput={e => setSearchText(e.detail.value)}
          confirmType='search'
        />
        {searchText && (
          <View className={styles.searchClear} onClick={clearSearch}>
            <Text>×</Text>
          </View>
        )}
      </View>

      <View className={styles.typeTabsBar}>
        {typeTabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.typeTab, activeType === tab.key && styles.typeTabActive)}
            onClick={() => setActiveType(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.tabsBar}>
        {statusTabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.activeTab)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY enhanced showScrollbar={false}>
        <View className={styles.reportList}>
          {filteredList.length > 0 ? (
            filteredList.map(item => (
              <ReportItem key={item.id} item={item} onClick={() => goReportDetail(item)} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>
                <Text>📋</Text>
              </View>
              <Text className={styles.emptyTitle}>暂无匹配记录</Text>
              <Text className={styles.emptyDesc}>
                {searchText ? '尝试更换关键词，或清除筛选条件' : '有异常请及时拍照上报，保障飞行安全'}
              </Text>
              {searchText && (
                <Button
                  className={styles.typeTab}
                  style={{ marginTop: '24rpx' }}
                  onClick={() => { setSearchText(''); setActiveType('all'); setActiveTab('all'); }}
                >
                  清除筛选
                </Button>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportPage;
