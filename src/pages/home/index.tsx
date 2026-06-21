import React, { useState, useCallback } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import TodoItem from '@/components/TodoItem';
import { TodoVerifyItem } from '@/types';
import { todoList } from '@/data/todoList';

const HomePage: React.FC = () => {
  const [todos, setTodos] = useState<TodoVerifyItem[]>(todoList);
  const [refreshing, setRefreshing] = useState(false);

  const stats = {
    todoCount: todos.length,
    doneCount: 7,
    abnormalCount: 1
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.showToast({ title: '已刷新', icon: 'success' });
    }, 800);
  }, []);

  const handleVerifyTodo = (item: TodoVerifyItem) => {
    console.log('[Home] 核验待办:', item.id, item.serialNumber, item.aircraftNo, item.position);
    Taro.setStorageSync('presetVerifyContext', {
      serialNumber: item.serialNumber,
      aircraftNo: item.aircraftNo,
      position: item.position,
      flightNo: item.flightNo,
      partName: item.partName
    });
    Taro.switchTab({ url: '/pages/verify/index' });
  };

  const goScanVerify = () => {
    console.log('[Home] 进入扫码核验');
    Taro.switchTab({ url: '/pages/verify/index' });
  };

  const goPhotoReport = () => {
    console.log('[Home] 进入拍照上报');
    Taro.switchTab({ url: '/pages/report/index' });
  };

  const goHistory = () => {
    console.log('[Home] 进入历史记录');
    Taro.navigateTo({ url: '/pages/history/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <ScrollView
        scrollY
        style={{ height: '100vh' }}
        enablePullDownRefresh
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        enhanced
        showScrollbar={false}
      >
        <View className={styles.headerSection}>
          <View className={styles.welcomeRow}>
            <View className={styles.welcomeInfo}>
              <Text className={styles.welcomeTitle}>早上好，张工</Text>
              <Text className={styles.welcomeSub}>T3机坪 · 今日短停任务紧</Text>
            </View>
            <View className={styles.userAvatar}>
              <Text>张</Text>
            </View>
          </View>

          <View className={styles.statsRow}>
            <View className={styles.statCard}>
              <Text className={styles.statNum + ' ' + styles.statNumRed}>{stats.todoCount}</Text>
              <Text className={styles.statLabel}>待核验</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statNum + ' ' + styles.statNumGreen}>{stats.doneCount}</Text>
              <Text className={styles.statLabel}>已核验</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statNum}>{stats.abnormalCount}</Text>
              <Text className={styles.statLabel}>异常上报</Text>
            </View>
          </View>
        </View>

        <View className={styles.quickActions}>
          <Text className={styles.actionTitle}>快速操作</Text>
          <View className={styles.actionBtns}>
            <Button className={styles.actionBtn + ' ' + styles.scanBtn} onClick={goScanVerify}>
              <View className={styles.actionIcon}>
                <Text>🔍</Text>
              </View>
              <View className={styles.actionText}>
                <Text className={styles.actionMain}>扫码核验</Text>
                <Text className={styles.actionSub}>扫描铭牌/输入序号</Text>
              </View>
            </Button>
            <Button className={styles.actionBtn + ' ' + styles.reportBtn} onClick={goPhotoReport}>
              <View className={styles.actionIcon}>
                <Text>📷</Text>
              </View>
              <View className={styles.actionText}>
                <Text className={styles.actionMain}>拍照上报</Text>
                <Text className={styles.actionSub}>异常情况/铭牌模糊</Text>
              </View>
            </Button>
          </View>
        </View>

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>待办核验 ({todos.length})</Text>
          <Text className={styles.sectionMore} onClick={goHistory}>查看历史 ›</Text>
        </View>

        <View className={styles.todoList}>
          {todos.length > 0 ? (
            todos.map(item => (
              <TodoItem key={item.id} item={item} onVerify={handleVerifyTodo} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <View className={styles.emptyIcon}>
                <Text>✅</Text>
              </View>
              <Text className={styles.emptyTitle}>暂无待办任务</Text>
              <Text className={styles.emptyDesc}>完成任务后可在历史记录中查看</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
