import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const ReportDetailPage: React.FC = () => {
  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderIcon}>
        <Text>📋</Text>
      </View>
      <Text className={styles.placeholderTitle}>上报单详情</Text>
      <Text className={styles.placeholderDesc}>
        此功能正在开发中...{'\n'}
        后续将展示上报照片预览、{'\n'}
        处理记录、处理结果等完整信息
      </Text>
      <Button className={styles.backBtn} onClick={goBack}>
        返回上一页
      </Button>
    </View>
  );
};

export default ReportDetailPage;
