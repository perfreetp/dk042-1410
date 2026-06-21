import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import HistoryItem from '@/components/HistoryItem';
import { VerifyRecord, ReleaseStatus } from '@/types';
import { historyList } from '@/data/historyList';

type FilterType = 'all' | ReleaseStatus;

const filters: Array<{ key: FilterType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pass', label: '可放行' },
  { key: 'review', label: '需复核' },
  { key: 'reject', label: '禁放行' }
];

const HistoryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [list] = useState<VerifyRecord[]>(historyList);

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
