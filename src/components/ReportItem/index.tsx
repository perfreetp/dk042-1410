import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReportRecord } from '@/types';
import { getReportTypeText, getReportStatusText, getReviewConclusionText, formatDateShort } from '@/utils/format';

interface ReportItemProps {
  item: ReportRecord;
  onClick?: () => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ item, onClick }) => {
  return (
    <View className={styles.reportItem} onClick={onClick}>
      <View className={styles.reportHeader}>
        <Text className={styles.reportNo}>{item.reportNo}</Text>
        <View className={classnames(styles.statusTag, styles[item.status])}>
          <Text>{getReportStatusText(item.status)}</Text>
        </View>
      </View>

      <View className={styles.typeTag}>
        <Text>{getReportTypeText(item.reportType)}</Text>
      </View>

      {item.reviewConclusion && (
        <View className={classnames(styles.reviewConclusion, styles[item.reviewConclusion])}>
          <Text>✅ 复核结论：{getReviewConclusionText(item.reviewConclusion)}{item.reviewRemark ? ` · ${item.reviewRemark}` : ''}</Text>
        </View>
      )}

      <View className={styles.aircraftRow}>
        <View className={styles.aircraftItem}>
          <Text className={styles.itemLabel}>机型:</Text>
          <Text>{item.aircraftNo}</Text>
        </View>
        <View className={styles.aircraftItem}>
          <Text className={styles.itemLabel}>位置:</Text>
          <Text>{item.position}</Text>
        </View>
        <View className={styles.aircraftItem}>
          <Text className={styles.itemLabel}>航班:</Text>
          <Text>{item.flightNo}</Text>
        </View>
      </View>

      {item.progress && item.progress.length > 0 && (
        <View className={styles.latestProgress}>
          <View className={styles.progressDot} />
          <View className={styles.progressContent}>
            <View className={styles.progressTitle}>
              <Text>最新进展：{item.progress[item.progress.length - 1].title}</Text>
              <Text className={styles.progressTime}>
                {item.progress[item.progress.length - 1].time.slice(5, 16)}
              </Text>
            </View>
            <Text className={styles.progressDesc}>
              {item.progress[item.progress.length - 1].description}
            </Text>
          </View>
        </View>
      )}

      <View className={styles.remark}>
        <Text>{item.remark}</Text>
      </View>

      <View className={styles.reportFooter}>
        <Text>{item.reporter} · {formatDateShort(item.reportedAt)}</Text>
        <View className={styles.photoCount}>
          <Text>📷 {item.photos.length}张</Text>
        </View>
      </View>
    </View>
  );
};

export default ReportItem;
