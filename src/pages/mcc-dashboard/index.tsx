import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReportRecord, ReportStatus } from '@/types';
import { reportList as mockList } from '@/data/reportList';
import { getReportTypeText, getReportStatusText, getReviewConclusionText } from '@/utils/format';

const NEW_REPORT_STORAGE = 'newReportList';
const DETAIL_STORAGE_KEY = 'reportDetailContext';

type GroupKey = 'pending' | 'processing' | 'resolved' | 'closed';

const GROUP_CONFIG: Array<{
  key: GroupKey;
  label: string;
  icon: string;
  badgeClass: string;
  statCardClass: string;
  miniStatusClass: string;
}> = [
  {
    key: 'pending',
    label: '待接单',
    icon: '📥',
    badgeClass: 'pending',
    statCardClass: styles.statCardPending,
    miniStatusClass: styles.pending
  },
  {
    key: 'processing',
    label: '处理中',
    icon: '🔄',
    badgeClass: 'processing',
    statCardClass: styles.statCardProcessing,
    miniStatusClass: styles.processing
  },
  {
    key: 'resolved',
    label: '待关闭',
    icon: '⏳',
    badgeClass: 'toClose',
    statCardClass: styles.statCardToClose,
    miniStatusClass: styles.toClose
  },
  {
    key: 'closed',
    label: '已关闭',
    icon: '✅',
    badgeClass: 'closed',
    statCardClass: styles.statCardClosed,
    miniStatusClass: styles.closed
  }
];

const MccDashboard: React.FC = () => {
  const [allList, setAllList] = useState<ReportRecord[]>([]);
  const [collapsed, setCollapsed] = useState<Record<GroupKey, boolean>>({
    pending: false,
    processing: false,
    resolved: false,
    closed: true
  });

  const loadAll = useCallback(() => {
    try {
      const newRaw = Taro.getStorageSync(NEW_REPORT_STORAGE);
      const newList: ReportRecord[] = Array.isArray(newRaw) ? newRaw : [];
      const merged = [
        ...newList,
        ...mockList.filter(m => !newList.find(n => n.id === m.id))
      ];
      console.log('[MCC] 工单总数:', merged.length);
      setAllList(merged);
    } catch (e) {
      console.error('[MCC] 加载工单失败:', e);
      setAllList(mockList);
    }
  }, []);

  useDidShow(() => {
    console.log('[MCC] useDidShow 刷新');
    loadAll();
  });

  const grouped = useMemo(() => {
    const g: Record<GroupKey, ReportRecord[]> = {
      pending: [],
      processing: [],
      resolved: [],
      closed: []
    };
    allList.forEach(r => {
      if (g[r.status as GroupKey]) {
        g[r.status as GroupKey].push(r);
      } else {
        g.pending.push(r);
      }
    });
    return g;
  }, [allList]);

  const counts = useMemo(() => ({
    pending: grouped.pending.length,
    processing: grouped.processing.length,
    resolved: grouped.resolved.length,
    closed: grouped.closed.length
  }), [grouped]);

  const toggleGroup = (k: GroupKey) => {
    setCollapsed(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const goDetail = (r: ReportRecord) => {
    try {
      Taro.setStorageSync(DETAIL_STORAGE_KEY, r);
    } catch (e) {
      console.warn('[MCC] 设置详情上下文失败:', e);
    }
    Taro.navigateTo({
      url: `/pages/report-detail/index?id=${encodeURIComponent(r.id)}`
    });
  };

  const scrollToGroup = (k: GroupKey) => {
    setCollapsed(prev => ({ ...prev, [k]: false }));
    Taro.pageScrollTo({
      selector: `#mcc-group-${k}`,
      duration: 300
    }).catch(() => { /**/ });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <View className={styles.welcomeRow}>
          <View>
            <Text className={styles.welcomeTitle}>MCC处理台</Text>
            <Text className={styles.welcomeSub}>王芳 · 白班值班</Text>
          </View>
          <View className={styles.roleBadge}>
            <Text>MCC主管</Text>
          </View>
        </View>

        <View className={styles.statsGrid}>
          {GROUP_CONFIG.map(cfg => (
            <View
              key={cfg.key}
              className={classnames(styles.statCard, cfg.statCardClass)}
              onClick={() => scrollToGroup(cfg.key)}
            >
              <Text className={styles.statNum}>{counts[cfg.key]}</Text>
              <Text className={styles.statLabel}>{cfg.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionWrapper}>
        <ScrollView scrollY enhanced showScrollbar={false} style={{ height: 'calc(100vh - 400rpx)' }}>
          {GROUP_CONFIG.map(cfg => {
            const list = grouped[cfg.key];
            const isCollapsed = collapsed[cfg.key];
            return (
              <View
                id={`mcc-group-${cfg.key}`}
                key={cfg.key}
                className={styles.groupCard}
              >
                <View className={styles.groupHeader} onClick={() => toggleGroup(cfg.key)}>
                  <View className={styles.groupTitle}>
                    <Text className={styles.groupIcon}>{cfg.icon}</Text>
                    <Text className={styles.groupLabel}>{cfg.label}</Text>
                    <View className={classnames(styles.groupCount, styles[cfg.badgeClass])}>
                      <Text>{list.length}</Text>
                    </View>
                  </View>
                  <Text className={classnames(styles.groupToggle, isCollapsed && styles.collapsed)}>
                    ▾
                  </Text>
                </View>

                {!isCollapsed && (
                  <View className={styles.groupList}>
                    {list.length > 0 ? (
                      list.map(r => (
                        <View key={r.id} className={styles.miniCard} onClick={() => goDetail(r)}>
                          <View className={styles.miniHeader}>
                            <Text className={styles.miniNo}>{r.reportNo}</Text>
                            <View className={classnames(styles.miniStatus, cfg.miniStatusClass)}>
                              <Text>{getReportStatusText(r.status)}</Text>
                            </View>
                          </View>
                          <View className={styles.miniInfoRow}>
                            <Text className={styles.miniInfoItem}>✈️ {r.aircraftNo}</Text>
                            <Text className={styles.miniInfoItem}>📍 {r.position}</Text>
                            <Text className={styles.miniInfoItem}>🛫 {r.flightNo}</Text>
                          </View>
                          <View className={styles.miniInfoRow}>
                            <Text className={styles.miniInfoItem}>类型：{getReportTypeText(r.reportType)}</Text>
                            <Text className={styles.miniInfoItem}>上报：{r.reporter}</Text>
                          </View>
                          <Text className={styles.miniRemark}>{r.remark}</Text>
                          {r.reviewConclusion && (
                            <View className={classnames(styles.miniReview, styles[r.reviewConclusion])}>
                              <Text>
                                复核结论：{getReviewConclusionText(r.reviewConclusion)}
                                {r.reviewRemark ? ` · ${r.reviewRemark}` : ''}
                              </Text>
                            </View>
                          )}
                        </View>
                      ))
                    ) : (
                      <View className={styles.groupEmpty}>
                        <Text>暂无{cfg.label}工单</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default MccDashboard;
