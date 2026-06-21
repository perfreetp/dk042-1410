import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import HistoryItem from '@/components/HistoryItem';
import { VerifyRecord, ReleaseStatus } from '@/types';
import { historyList as mockHistoryList } from '@/data/historyList';

const NEW_HISTORY_KEY = 'newVerifyHistoryList';

type FilterType = 'all' | ReleaseStatus;

const filters: Array<{ key: FilterType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pass', label: '可放行' },
  { key: 'review', label: '需复核' },
  { key: 'reject', label: '禁放行' }
];

const HistoryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [list, setList] = useState<VerifyRecord[]>(mockHistoryList);

  const loadHistoryList = useCallback(() => {
    try {
      const newRaw = Taro.getStorageSync(NEW_HISTORY_KEY);
      const newList: VerifyRecord[] = Array.isArray(newRaw) ? newRaw : [];
      console.log('[History] 读取新核验记录数:', newList.length);
      const merged = [
        ...newList,
        ...mockHistoryList.filter(m => !newList.find(n => n.id === m.id))
      ];
      setList(merged);
    } catch (e) {
      console.error('[History] 读取历史记录失败，使用mock:', e);
      setList(mockHistoryList);
    }
  }, []);

  useDidShow(() => {
    console.log('[History] useDidShow，刷新历史记录');
    loadHistoryList();
  });

  const filteredList = activeFilter === 'all'
    ? list
    : list.filter(r => r.releaseStatus === activeFilter);

  return (
    <View className={styles.pageContainer}>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>核验历史记录</Text>
        <Text className={styles.pageSubtitle}>共 {list.length} 条签署记录</Text>
      </View>

      <View className={styles.filterBar}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterItem, activeFilter === f.key && styles.activeFilter)}
            onClick={() => setActiveFilter(f.key)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY enhanced showScrollbar={false} style={{ height: 'calc(100vh - 320rpx)' }}>
        <View className={styles.historyList}>
          {filteredList.length > 0 ? (
            filteredList.map(item => (
              <HistoryItem key={item.id} item={item} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>
                <Text>📭</Text>
              </View>
              <Text className={styles.emptyTitle}>暂无此类记录</Text>
              <Text className={styles.emptyDesc}>可切换筛选条件查看其他核验记录</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HistoryPage;
