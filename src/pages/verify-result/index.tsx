import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const VerifyResultPage: React.FC = () => {
  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.placeholderIcon}>
        <Text>🔍</Text>
      </View>
      <Text className={styles.placeholderTitle}>核验结果详情</Text>
      <Text className={styles.placeholderDesc}>
        此功能正在开发中...{'\n'}
        后续将展示完整的核验过程追溯、{'\n'}
        签署日志、相关文档等详细信息
      </Text>
      <Button className={styles.backBtn} onClick={goBack}>
        返回上一页
      </Button>
    </View>
  );
};

export default VerifyResultPage;
