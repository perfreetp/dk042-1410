import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const ReportCreatePage: React.FC = () => {
  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderIcon}>
        <Text>📷</Text>
      </View>
      <Text className={styles.placeholderTitle}>新建拍照上报</Text>
      <Text className={styles.placeholderDesc}>
        此功能正在开发中...{'\n'}
        后续将支持多图拍照上传、{'\n'}
        异常类型选择、航班号/机位录入等完整功能
      </Text>
      <Button className={styles.backBtn} onClick={goBack}>
        返回上一页
      </Button>
    </View>
  );
};

export default ReportCreatePage;
