import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { VerifyRecord } from '@/types';
import { getReleaseStatusText, formatDateShort } from '@/utils/format';

interface HistoryItemProps {
  item: VerifyRecord;
  onClick?: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onClick }) => {
  return (
    <View className={styles.historyItem} onClick={onClick}>
      <View className={styles.historyHeader}>
        <Text className={styles.partName}>{item.partName}</Text>
        <View className={classnames(styles.statusBadge, styles[item.releaseStatus])}>
          <Text>{getReleaseStatusText(item.releaseStatus)}</Text>
        </View>
      </View>

      <View className={styles.infoRow}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>机号:</Text>
          <Text>{item.aircraftNo}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>位置:</Text>
          <Text>{item.position}</Text>
        </View>
      </View>

      <View className={styles.serialNum}>序号: {item.serialNumber}</View>

      <View className={styles.historyFooter}>
        <View className={styles.infoItem}>
          <Text>核验人: {item.verifier}</Text>
        </View>
        {item.flightNo && (
          <Text className={styles.flightTag}>{item.flightNo}</Text>
        )}
        <Text>{formatDateShort(item.verifiedAt)}</Text>
      </View>
    </View>
  );
};

export default HistoryItem;
