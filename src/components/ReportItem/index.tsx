import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReportRecord } from '@/types';
import { getReportTypeText, getReportStatusText, formatDateShort } from '@/utils/format';

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
