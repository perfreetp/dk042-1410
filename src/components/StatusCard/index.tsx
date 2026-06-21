import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReleaseStatus } from '@/types';
import { getReleaseStatusText } from '@/utils/format';

interface StatusCardProps {
  status: ReleaseStatus;
  reason?: string;
}

const iconMap: Record<ReleaseStatus, string> = {
  pass: '✓',
  review: '!',
  reject: '✕'
};

const StatusCard: React.FC<StatusCardProps> = ({ status, reason }) => {
  return (
    <View className={classnames(styles.statusCard, styles[status])}>
      <View className={styles.statusHeader}>
        <View className={classnames(styles.statusBadge, styles[`${status}Badge`])}>
          {getReleaseStatusText(status)}
        </View>
        <View className={classnames(styles.statusIcon, styles[`${status}Icon`])}>
          <Text>{iconMap[status]}</Text>
        </View>
      </View>
      <Text className={classnames(styles.statusBigText, styles[`${status}Text`])}>
        {getReleaseStatusText(status)}
      </Text>
      {reason && (
        <View className={styles.statusReason}>
          <Text>{reason}</Text>
        </View>
      )}
    </View>
  );
};

export default StatusCard;
