import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReportRecord } from '@/types';
import { getReportTypeText, getReportStatusText, formatDate } from '@/utils/format';
import { reportList as mockList } from '@/data/reportList';

const DETAIL_STORAGE_KEY = 'reportDetailContext';
const NEW_REPORT_STORAGE = 'newReportList';

const ReportDetailPage: React.FC = () => {
  const router = useRouter();
  const [record, setRecord] = useState<ReportRecord | null>(null);

  useEffect(() => {
    let data: ReportRecord | null = null;

    try {
      const ctx = Taro.getStorageSync(DETAIL_STORAGE_KEY);
      if (ctx && (ctx as ReportRecord).reportNo) {
        console.log('[ReportDetail] 从上下文获取详情:', ctx.reportNo);
        data = ctx as ReportRecord;
        Taro.removeStorageSync(DETAIL_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[ReportDetail] 从storage读取上下文失败', e);
    }

    if (!data && router.params?.id) {
      const id = router.params.id;
      console.log('[ReportDetail] 通过ID查找:', id);
      const fromMock = mockList.find(r => r.id === id);
      if (fromMock) {
        data = fromMock;
      } else {
        try {
          const newRaw = Taro.getStorageSync(NEW_REPORT_STORAGE);
          const newList: ReportRecord[] = Array.isArray(newRaw) ? newRaw : [];
          const fromNew = newList.find(r => r.id === id);
          if (fromNew) data = fromNew;
        } catch (e) {
          console.error('[ReportDetail] 通过ID在新单中查找失败:', e);
        }
      }
    }

    if (data) {
      setRecord(data);
    } else {
      console.error('[ReportDetail] 未找到上报单详情');
      Taro.showToast({ title: '未找到上报单', icon: 'none' });
    }
  }, [router.params]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  if (!record) {
    return (
      <View className={styles.pageContainer} style={{ paddingTop: '100rpx', textAlign: 'center' }}>
        <Text style={{ fontSize: '64rpx', marginBottom: '24rpx', display: 'block' }}>📭</Text>
        <Text style={{ fontSize: '32rpx', color: '#4E5969', display: 'block', marginBottom: '40rpx' }}>加载中...</Text>
        <Button className={styles.backBtn} onClick={handleBack}>返回</Button>
      </View>
    );
  }

  return (
    <View className={styles.pageContainer}>
      <View className={styles.reportHeader}>
        <View className={styles.reportNoRow}>
          <Text className={styles.reportNo}>{record.reportNo}</Text>
          <View className={styles.statusTag}>
            <Text>{getReportStatusText(record.status)}</Text>
          </View>
        </View>
        <View className={styles.typeBadge}>
          <Text>{getReportTypeText(record.reportType)}</Text>
        </View>
        <View className={styles.metaRow}>
          <Text>上报人：{record.reporter}</Text>
          <Text>·</Text>
          <Text>{formatDate(record.reportedAt)}</Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>飞机 & 现场信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>飞机号</Text>
            <Text className={styles.infoValue}>{record.aircraftNo}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>装机/停场位置</Text>
            <Text className={styles.infoValue}>{record.position}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>航班号</Text>
            <Text className={styles.infoValue}>{record.flightNo}</Text>
          </View>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>零件信息</Text>
        <View className={styles.infoGrid}>
          {record.serialNumber ? (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>零件序号</Text>
              <View className={styles.infoValue}>
                <Text className={styles.snValue}>{record.serialNumber}</Text>
              </View>
            </View>
          ) : null}
          {record.partName ? (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>零件名称</Text>
              <Text className={styles.infoValue}>{record.partName}</Text>
            </View>
          ) : null}
          {!record.serialNumber && !record.partName ? (
            <Text style={{ fontSize: '28rpx', color: '#86909C' }}>（未填写零件信息）</Text>
          ) : null}
        </View>
      </View>

      <View className={styles.photoSection}>
        <Text className={styles.cardTitle}>现场照片 ({record.photos.length}张)</Text>
        <View className={styles.photoGrid}>
          {record.photos.map((url, idx) => (
            <View
              key={idx}
              className={styles.photoItem}
              onClick={() => {
                Taro.previewImage({
                  current: url,
                  urls: record.photos
                });
              }}
            >
              <Image className={styles.photoImg} src={url} mode='aspectFill' />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.remarkCard}>
        <Text className={styles.cardTitle}>异常说明</Text>
        <View className={styles.remarkContent}>
          <Text>{record.remark || '（未填写）'}</Text>
        </View>
      </View>

      {record.status === 'resolved' && (record.resolution || record.handler || record.resolvedAt) && (
        <View className={styles.resolveSection}>
          <Text className={styles.resolveTitle}>✅ 处理结果</Text>
          {record.handler && (
            <View className={styles.resolveRow}>
              <Text className={styles.resolveLabel}>处理人</Text>
              <Text className={styles.resolveValue}>{record.handler}</Text>
            </View>
          )}
          {record.resolvedAt && (
            <View className={styles.resolveRow}>
              <Text className={styles.resolveLabel}>处理时间</Text>
              <Text className={styles.resolveValue}>{formatDate(record.resolvedAt)}</Text>
            </View>
          )}
          {record.resolution && (
            <View className={styles.resolveRow}>
              <Text className={styles.resolveLabel}>处理说明</Text>
              <Text className={styles.resolveValue}>{record.resolution}</Text>
            </View>
          )}
        </View>
      )}

      {record.status !== 'resolved' && (
        <View style={{
          background: '#FFF3E0',
          border: '2rpx solid rgba(255, 125, 0, 0.3)',
          borderRadius: '24rpx',
          padding: '32rpx',
          marginBottom: '24rpx'
        }}>
          <Text style={{
            fontSize: '32rpx',
            fontWeight: 'bold',
            color: '#FF7D00',
            marginBottom: '16rpx',
            display: 'block'
          }}>⏳ MCC / 航材控制岗处理中</Text>
          <Text style={{ fontSize: '28rpx', color: '#4E5969', lineHeight: 1.7 }}>
            请保持通讯畅通，MCC将在30分钟内与您联系确认处理方案。{'\n'}
            如需紧急沟通，请直接拨打MCC值班电话。
          </Text>
        </View>
      )}

      <Button className={styles.backBtn} onClick={handleBack}>
        返回列表
      </Button>
    </View>
  );
};

export default ReportDetailPage;
