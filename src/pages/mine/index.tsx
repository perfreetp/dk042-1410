import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const goHistory = () => {
    console.log('[Mine] 进入核验历史');
    Taro.navigateTo({ url: '/pages/history/index' });
  };

  const goReportList = () => {
    console.log('[Mine] 切换到异常上报');
    Taro.switchTab({ url: '/pages/report/index' });
  };

  const goMccDashboard = () => {
    console.log('[Mine] 进入MCC处理看板');
    Taro.navigateTo({ url: '/pages/mcc-dashboard/index' });
  };

  const goHelp = () => {
    console.log('[Mine] 使用帮助');
    Taro.showToast({ title: '帮助文档建设中', icon: 'none' });
  };

  const goFeedback = () => {
    console.log('[Mine] 意见反馈');
    Taro.showToast({ title: '请联系系统管理员', icon: 'none' });
  };

  const goAbout = () => {
    console.log('[Mine] 关于');
    Taro.showModal({
      title: '寿命件核验系统',
      content: '版本 v1.0.0\n专为一线航线维修放行人员设计\n© 2026 民航维修工程部',
      showCancel: false
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.profileHeader}>
        <View className={styles.profileCard}>
          <View className={styles.avatar}>
            <Text>张</Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>张伟</Text>
            <Text className={styles.userMeta}>工号：ME-20210315 · B737/B787机型</Text>
            <View className={styles.qualificationBadge}>
              <Text>✓ 持照放行工程师</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statsOverview}>
        <View className={styles.overviewItem}>
          <Text className={styles.overviewNum}>128</Text>
          <Text className={styles.overviewLabel}>本月核验</Text>
        </View>
        <View className={styles.overviewItem}>
          <Text className={styles.overviewNum}>5</Text>
          <Text className={styles.overviewLabel}>异常上报</Text>
        </View>
        <View className={styles.overviewItem}>
          <Text className={styles.overviewNum}>99.2%</Text>
          <Text className={styles.overviewLabel}>准确率</Text>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>工作记录</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={goHistory}>
            <View className={styles.menuIcon}>
              <Text>📋</Text>
            </View>
            <View className={styles.menuText}>
              <Text className={styles.menuTitle}>核验历史记录</Text>
              <Text className={styles.menuSub}>查看近期所有核验签署记录</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={goReportList}>
            <View className={classnames(styles.menuIcon, styles.warnIcon)}>
              <Text>📷</Text>
            </View>
            <View className={styles.menuText}>
              <Text className={styles.menuTitle}>
                我的上报单
                <Text className={styles.badge}>1</Text>
              </Text>
              <Text className={styles.menuSub}>处理中1单 · 已解决3单</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>MCC 管理台</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={goMccDashboard}>
            <View className={classnames(styles.menuIcon, styles.safeIcon)}>
              <Text>🛠</Text>
            </View>
            <View className={styles.menuText}>
              <Text className={styles.menuTitle}>MCC 处理看板</Text>
              <Text className={styles.menuSub}>按状态分组查看并处理所有工单</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>设置与支持</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={goHelp}>
            <View className={classnames(styles.menuIcon, styles.safeIcon)}>
              <Text>📖</Text>
            </View>
            <View className={styles.menuText}>
              <Text className={styles.menuTitle}>使用手册</Text>
              <Text className={styles.menuSub}>快速上手操作指南</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={goFeedback}>
            <View className={classnames(styles.menuIcon, styles.helpIcon)}>
              <Text>💬</Text>
            </View>
            <View className={styles.menuText}>
              <Text className={styles.menuTitle}>意见反馈</Text>
              <Text className={styles.menuSub}>提交建议或遇到的问题</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={goAbout}>
            <View className={classnames(styles.menuIcon, styles.helpIcon)}>
              <Text>ℹ️</Text>
            </View>
            <View className={styles.menuText}>
              <Text className={styles.menuTitle}>关于系统</Text>
              <Text className={styles.menuSub}>版本 v1.0.0</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.versionFooter}>
        <Text>安全·高效·合规 · 寿命件核验 v1.0.0</Text>
      </View>
    </View>
  );
};

export default MinePage;
