import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReportRecord, ReportProgressItem, ReportStatus } from '@/types';
import { getReportTypeText, getReportStatusText, formatDate } from '@/utils/format';
import { reportList as mockList } from '@/data/reportList';

const DETAIL_STORAGE_KEY = 'reportDetailContext';
const NEW_REPORT_STORAGE = 'newReportList';

const MCC_OPERATOR = 'MCC值班-王芳';

type ModalType = 'accept' | 'feedback' | 'resolve' | 'close' | null;

const nowStr = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const ReportDetailPage: React.FC = () => {
  const router = useRouter();
  const [record, setRecord] = useState<ReportRecord | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [inputText, setInputText] = useState('');

  const loadRecord = useCallback(() => {
    let data: ReportRecord | null = null;

    try {
      const ctx = Taro.getStorageSync(DETAIL_STORAGE_KEY);
      if (ctx && (ctx as ReportRecord).reportNo) {
        console.log('[ReportDetail] 从上下文获取详情:', ctx.reportNo);
        data = ctx as ReportRecord;
        try { Taro.removeStorageSync(DETAIL_STORAGE_KEY); } catch (_) { /**/ }
      }
    } catch (e) {
      console.warn('[ReportDetail] 从storage读取上下文失败', e);
    }

    if (!data && router.params?.id) {
      const id = router.params.id;
      console.log('[ReportDetail] 通过ID查找:', id);

      try {
        const newRaw = Taro.getStorageSync(NEW_REPORT_STORAGE);
        const newList: ReportRecord[] = Array.isArray(newRaw) ? newRaw : [];
        const fromNew = newList.find(r => r.id === id);
        if (fromNew) data = fromNew;
      } catch (e) {
        console.error('[ReportDetail] 通过ID在新单中查找失败:', e);
      }
      if (!data) {
        const fromMock = mockList.find(r => r.id === id);
        if (fromMock) data = fromMock;
      }
    }

    if (data) {
      setRecord(data);
    } else {
      console.error('[ReportDetail] 未找到上报单详情');
      Taro.showToast({ title: '未找到上报单', icon: 'none' });
    }
  }, [router.params.id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const persistUpdated = (updated: ReportRecord) => {
    try {
      const newRaw = Taro.getStorageSync(NEW_REPORT_STORAGE);
      const newList: ReportRecord[] = Array.isArray(newRaw) ? newRaw : [];
      const idx = newList.findIndex(r => r.id === updated.id);
      if (idx >= 0) {
        newList[idx] = updated;
      } else {
        newList.unshift(updated);
      }
      Taro.setStorageSync(NEW_REPORT_STORAGE, newList);
      console.log('[ReportDetail] 已更新storage中的上报单:', updated.reportNo, '状态:', updated.status);
    } catch (e) {
      console.error('[ReportDetail] 写入storage失败:', e);
    }
  };

  const openModal = (type: ModalType) => {
    setInputText('');
    setModalType(type);
  };

  const handleAccept = () => {
    if (!record) return;
    const ts = nowStr();
    const newProgress: ReportProgressItem[] = [
      ...record.progress,
      {
        node: 'mccAccepted',
        title: 'MCC已接单',
        description: inputText.trim() || 'MCC值班人员已接单，正在协调处理资源',
        operator: MCC_OPERATOR,
        time: ts
      }
    ];
    const updated: ReportRecord = {
      ...record,
      status: 'processing' as ReportStatus,
      handler: MCC_OPERATOR,
      progress: newProgress
    };
    setRecord(updated);
    persistUpdated(updated);
    setModalType(null);
    Taro.showToast({ title: '接单成功', icon: 'success' });
  };

  const handleFeedback = () => {
    if (!record) return;
    if (!inputText.trim()) {
      Taro.showToast({ title: '请填写反馈内容', icon: 'none' });
      return;
    }
    const ts = nowStr();
    const newProgress: ReportProgressItem[] = [
      ...record.progress,
      {
        node: 'feedback',
        title: '已反馈进展',
        description: inputText.trim(),
        operator: MCC_OPERATOR,
        time: ts
      }
    ];
    const updated: ReportRecord = {
      ...record,
      progress: newProgress
    };
    setRecord(updated);
    persistUpdated(updated);
    setModalType(null);
    Taro.showToast({ title: '已反馈', icon: 'success' });
  };

  const handleResolve = () => {
    if (!record) return;
    if (!inputText.trim()) {
      Taro.showToast({ title: '请填写处理说明', icon: 'none' });
      return;
    }
    const ts = nowStr();
    const newProgress: ReportProgressItem[] = [
      ...record.progress,
      {
        node: 'resolved',
        title: '已解决',
        description: inputText.trim(),
        operator: MCC_OPERATOR,
        time: ts
      }
    ];
    const updated: ReportRecord = {
      ...record,
      status: 'resolved' as ReportStatus,
      handler: MCC_OPERATOR,
      resolvedAt: ts,
      resolution: inputText.trim(),
      progress: newProgress
    };
    setRecord(updated);
    persistUpdated(updated);
    setModalType(null);
    Taro.showToast({ title: '处理完成', icon: 'success' });
  };

  const handleClose = () => {
    if (!record) return;
    const ts = nowStr();
    const newProgress: ReportProgressItem[] = [
      ...record.progress,
      {
        node: 'closed',
        title: '已关闭',
        description: inputText.trim() || '经复核，处理结果满足放行要求，工单归档关闭',
        operator: MCC_OPERATOR,
        time: ts
      }
    ];
    const updated: ReportRecord = {
      ...record,
      status: 'closed' as ReportStatus,
      closedAt: ts,
      progress: newProgress
    };
    setRecord(updated);
    persistUpdated(updated);
    setModalType(null);
    Taro.showToast({ title: '已关闭工单', icon: 'success' });
  };

  const submitModal = () => {
    if (modalType === 'accept') handleAccept();
    else if (modalType === 'feedback') handleFeedback();
    else if (modalType === 'resolve') handleResolve();
    else if (modalType === 'close') handleClose();
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  const canAccept = record && record.status === 'pending';
  const canFeedback = record && (record.status === 'processing');
  const canResolve = record && (record.status === 'pending' || record.status === 'processing');
  const canClose = record && (record.status === 'resolved');
  const isClosed = record && record.status === 'closed';

  if (!record) {
    return (
      <View className={styles.pageContainer} style={{ paddingTop: '100rpx', textAlign: 'center' }}>
        <Text style={{ fontSize: '64rpx', marginBottom: '24rpx', display: 'block' }}>📭</Text>
        <Text style={{ fontSize: '32rpx', color: '#4E5969', display: 'block', marginBottom: '40rpx' }}>加载中...</Text>
        <Button className={styles.backBtn} onClick={handleBack}>返回</Button>
      </View>
    );
  }

  const modalConfig = {
    accept: { title: 'MCC接单确认', placeholder: '接单说明（可选），如：已分配航材控制岗处理', submitText: '确认接单', action: handleAccept },
    feedback: { title: '填写处理反馈', placeholder: '请填写处理进展，如：已查到批次入库单号 XXX', submitText: '提交反馈', action: handleFeedback },
    resolve: { title: '填写处理说明', placeholder: '请填写最终处理说明，例如：已补录系统寿命起始值', submitText: '确认处理完成', action: handleResolve },
    close: { title: '关闭工单', placeholder: '关闭原因（可选），如：经复核可正常放行', submitText: '确认关闭工单', action: handleClose }
  };

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

      {/* MCC 操作区 */}
      {isClosed ? (
        <View className={classnames(styles.mccPanel, styles.closedPanel)}>
          <View className={styles.mccPanelTitle}>
            <Text className={classnames(styles.mccPanelLabel, styles.closedLabel)}>
              ✅ 工单已关闭
            </Text>
            <View className={styles.mccRoleBadge}>MCC处理台</View>
          </View>
          <View className={styles.mccInfoText}>
            <View className={styles.mccInfoRow}>
              <Text className={styles.mccInfoLabel}>处理人</Text>
              <Text className={styles.mccInfoValue}>{record.handler || MCC_OPERATOR}</Text>
            </View>
            {record.resolvedAt && (
              <View className={styles.mccInfoRow}>
                <Text className={styles.mccInfoLabel}>解决时间</Text>
                <Text className={styles.mccInfoValue}>{formatDate(record.resolvedAt)}</Text>
              </View>
            )}
            {record.closedAt && (
              <View className={styles.mccInfoRow}>
                <Text className={styles.mccInfoLabel}>关闭时间</Text>
                <Text className={styles.mccInfoValue}>{formatDate(record.closedAt)}</Text>
              </View>
            )}
            {record.resolution && (
              <View className={styles.mccInfoRow}>
                <Text className={styles.mccInfoLabel}>处理说明</Text>
                <Text className={styles.mccInfoValue}>{record.resolution}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className={styles.mccPanel}>
          <View className={styles.mccPanelTitle}>
            <Text className={styles.mccPanelLabel}>🛠 MCC处理台</Text>
            <View className={styles.mccRoleBadge}>MCC处理台</View>
          </View>

          {(canAccept || canFeedback || canResolve || canClose) ? (
            <View className={styles.mccActionGrid}>
              {canAccept && (
                <View className={classnames(styles.mccBtn, styles.mccBtnPrimary)} onClick={() => openModal('accept')}>
                  <Text>📥 MCC接单处理</Text>
                </View>
              )}
              {canFeedback && (
                <View className={classnames(styles.mccBtn, styles.mccBtnOutline)} onClick={() => openModal('feedback')}>
                  <Text>📝 填写处理反馈</Text>
                </View>
              )}
              {canResolve && (
                <View className={classnames(styles.mccBtn, styles.mccBtnSuccess)} onClick={() => openModal('resolve')}>
                  <Text>✅ 填写处理说明并解决</Text>
                </View>
              )}
              {canClose && (
                <View className={classnames(styles.mccBtn, styles.mccBtnPrimary)} onClick={() => openModal('close')}>
                  <Text>🔒 关闭工单</Text>
                </View>
              )}
            </View>
          ) : (
            <View className={styles.mccInfoText}>
              当前状态：{getReportStatusText(record.status)}，等待下一环节处理
            </View>
          )}
        </View>
      )}

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>飞机 &amp; 现场信息</Text>
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

      <View className={styles.timelineSection}>
        <Text className={styles.timelineTitle}>处理进度时间线</Text>
        <View className={styles.timelineList}>
          {record.progress && record.progress.length > 0 ? (
            record.progress.map((item, idx) => {
              const isLast = idx === record.progress.length - 1;
              const isSuccess = item.node === 'resolved' || item.node === 'closed';
              return (
                <View key={idx} className={styles.timelineItem}>
                  <View
                    className={classnames(
                      styles.timelineDot,
                      isLast && !isSuccess && styles.timelineDotActive,
                      isSuccess && styles.timelineDotSuccess
                    )}
                  />
                  <View className={styles.timelineItemTitle}>
                    <Text>{item.title}</Text>
                    <Text className={styles.timelineItemTime}>{item.time.slice(5, 16)}</Text>
                  </View>
                  {item.description && (
                    <Text className={styles.timelineItemDesc}>{item.description}</Text>
                  )}
                  {item.operator && (
                    <Text className={styles.timelineItemOperator}>处理人：{item.operator}</Text>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={{ fontSize: '28rpx', color: '#86909C' }}>暂无处理进度</Text>
          )}
        </View>
      </View>

      {record.status === 'resolved' && (record.resolution || record.handler || record.resolvedAt) && !record.closedAt && (
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

      {!isClosed && record.status !== 'resolved' && (
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

      <View className={styles.backBtn} onClick={handleBack}>
        <Text>返回列表</Text>
      </View>

      {/* 操作弹窗 */}
      {modalType && modalConfig[modalType] && (
        <View className={styles.modalMask} onClick={() => setModalType(null)}>
          <View className={styles.modalCard} onClick={e => e.stopPropagation && e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>{modalConfig[modalType].title}</Text>
            </View>
            <View className={styles.modalBody}>
              {(modalType === 'feedback' || modalType === 'resolve' || modalType === 'close' || modalType === 'accept') && (
                <>
                  <Text className={styles.modalFieldLabel}>{modalConfig[modalType].placeholder}</Text>
                  <Textarea
                    className={styles.modalTextarea}
                    placeholder={modalConfig[modalType].placeholder}
                    value={inputText}
                    maxlength={200}
                    onInput={(e: any) => setInputText(e.detail.value)}
                  />
                </>
              )}
            </View>
            <View className={styles.modalFooter}>
              <View className={classnames(styles.modalBtn, styles.modalBtnCancel)} onClick={() => setModalType(null)}>
                <Text>取消</Text>
              </View>
              <View className={classnames(styles.modalBtn, styles.modalBtnConfirm)} onClick={submitModal}>
                <Text>{modalConfig[modalType].submitText}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReportDetailPage;
