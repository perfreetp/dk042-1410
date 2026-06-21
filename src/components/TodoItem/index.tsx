import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { TodoVerifyItem } from '@/types';

interface TodoItemProps {
  item: TodoVerifyItem;
  onVerify?: (item: TodoVerifyItem) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onVerify }) => {
  const isUrgent = item.priority === 'high';

  const handleVerify = () => {
    if (onVerify) {
      onVerify(item);
    } else {
      Taro.switchTab({ url: '/pages/verify/index' });
    }
  };

  return (
    <View className={classnames(styles.todoItem, isUrgent ? styles.highPriority : styles.normalPriority)}>
      <View className={styles.todoHeader}>
        <View className={styles.aircraftInfo}>
          <Text className={styles.aircraftNo}>{item.aircraftNo}</Text>
          <View className={styles.flightTag}>
            <Text>{item.flightNo}</Text>
          </View>
        </View>
        <Text className={classnames(styles.deadline, isUrgent && styles.urgent)}>
          截止 {item.deadline}
        </Text>
      </View>

      <View className={styles.partInfo}>
        <Text className={styles.partName}>{item.partName}</Text>
        <Text className={styles.serialNum}>序号: {item.serialNumber}</Text>
      </View>

      <View className={styles.positionRow}>
        <View className={styles.positionInfo}>
          <Text className={styles.positionLabel}>位置:</Text>
          <Text>{item.position}</Text>
        </View>
        <Button className={styles.verifyBtn} onClick={handleVerify}>
          立即核验
        </Button>
      </View>
    </View>
  );
};

export default TodoItem;
