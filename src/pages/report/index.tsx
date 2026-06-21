import React, { useState, useCallback } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ReportItem from '@/components/ReportItem';
import { ReportRecord, ReportStatus } from '@/types';
import { reportList as mockList } from '@/data/reportList';

const NEW_REPORT_STORAGE = 'newReportList';
const DETAIL_STORAGE_KEY = 'reportDetailContext';

type TabType = 'all' | ReportStatus;

const tabs: Array<{ key: TabType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'resolved', label: '已解决' }
];

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
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

  const stats = {
    pending: list.filter(r => r.status === 'pending').length,
    processing: list.filter(r => r.status === 'processing').length,
    resolved: list.filter(r => r.status === 'resolved').length
  };

  const filteredList = activeTab === 'all'
    ? list
    : list.filter(r => r.status === activeTab);

  const goCreateReport = () => {
    console.log('[Report] 新建异常上报');
    // 进入新建页前清空可能残留的preset
    Taro.removeStorageSync('presetReportContext');
    Taro.navigateTo({ url: '/pages/report-create/index' });
  };

  const goReportDetail = (item: ReportRecord) => {
    console.log('[Report] 查看上报详情:', item.reportNo, '类型:', item.reportType, '照片:', item.photos.length);
    // 优先用 storage 传整条数据，保证新建的单也能完整显示
    try {
      Taro.setStorageSync(DETAIL_STORAGE_KEY, item);
    } catch (e) {
      console.warn('[Report] storage写详情失败，改用URL传id', e);
    }
    Taro.navigateTo({ url: `/pages/report-detail/index?id=${item.id}` });
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

      <View className={styles.tabsBar}>
        {tabs.map(tab => (
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
              <Text className={styles.emptyTitle}>暂无此类上报记录</Text>
              <Text className={styles.emptyDesc}>有异常请及时拍照上报，保障飞行安全</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportPage;
