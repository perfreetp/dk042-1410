import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { VerifyRecord } from '@/types';
import { getReleaseStatusText, formatDate } from '@/utils/format';
import { historyList as mockHistoryList } from '@/data/historyList';

const PRESET_VERIFY_DETAIL_KEY = 'presetVerifyDetail';
const NEW_HISTORY_KEY = 'newVerifyHistoryList';

const VerifyDetailPage: React.FC = () => {
  const router = useRouter();
  const [record, setRecord] = useState<VerifyRecord | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);

  const loadRecord = useCallback(() => {
    const urlId = router.params.id;

    try {
      const preset = Taro.getStorageSync(PRESET_VERIFY_DETAIL_KEY);
      const newRaw = Taro.getStorageSync(NEW_HISTORY_KEY);
      const newList: VerifyRecord[] = Array.isArray(newRaw) ? newRaw : [];
      const merged = [...newList, ...mockHistoryList];

      let found: VerifyRecord | undefined = preset;

      if (urlId && !found) {
        found = merged.find(r => r.id === urlId);
      }
      if (!found && urlId) {
        found = merged.find(r => r.id === urlId);
      }

      if (found) {
        setRecord(found);
        try { Taro.removeStorageSync(PRESET_VERIFY_DETAIL_KEY); } catch (_) { /**/ }
      } else {
        setRecord(null);
      }
    } catch (e) {
      console.error('[VerifyDetail] 加载记录失败:', e);
      setRecord(null);
    }
  }, [router.params.id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 }).catch(() => {
      Taro.switchTab({ url: '/pages/mine/index' });
    });
  };

  const handleSaveVoucher = () => {
    Taro.showToast({ title: '凭证已保存至相册', icon: 'success' });
  };

  const handleShareVoucher = () => {
    Taro.showToast({ title: '分享链接已生成', icon: 'success' });
  };

  if (!record) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.emptyState}>
          <View className={styles.emptyIcon}>
            <Text>📋</Text>
          </View>
          <Text className={styles.emptyTitle}>未找到核验记录</Text>
          <Text className={styles.emptyDesc}>请返回历史记录列表重新打开</Text>
        </View>
      </View>
    );
  }

  const statusClassMap = {
    pass: styles.statusPass,
    review: styles.statusReview,
    reject: styles.statusReject
  };
  const statusText = getReleaseStatusText(record.releaseStatus);

  const lifeHoursRemain = record.lifeHoursLimit && record.lifeHoursUsed != null
    ? record.lifeHoursLimit - record.lifeHoursUsed
    : undefined;
  const cyclesRemain = record.cyclesLimit && record.cyclesUsed != null
    ? record.cyclesLimit - record.cyclesUsed
    : undefined;
  const isHoursLow = lifeHoursRemain != null && lifeHoursRemain <= 200;
  const isHoursDanger = lifeHoursRemain != null && lifeHoursRemain <= 50;
  const isCyclesLow = cyclesRemain != null && cyclesRemain <= 300;
  const isCyclesDanger = cyclesRemain != null && cyclesRemain <= 100;

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerBar}>
        <View className={styles.headerTop}>
          <View className={styles.headerStatusBlock}>
            <View className={classnames(styles.statusBadge, statusClassMap[record.releaseStatus])}>
              <Text>{statusText}</Text>
            </View>
          </View>
        </View>
        <Text className={styles.headerReportNo}>{record.partName || '寿命件'}</Text>
        <View className={styles.headerMeta}>
          <Text>序号：{record.serialNumber}</Text>
          <Text>{'\n'}</Text>
          <Text>核验时间：{formatDate(record.signedAt || record.verifiedAt)}</Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>飞机 &amp; 确认信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>飞机号</Text>
          <Text className={styles.infoValue}>{record.aircraftNo || '—'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>装机位置</Text>
          <Text className={styles.infoValue}>{record.position || '—'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>航班号</Text>
          <Text className={styles.infoValue}>{record.flightNo || '—'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>核验人员</Text>
          <Text className={styles.infoValue}>{record.signedBy || record.verifier || '—'}</Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>零件信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>零件名称</Text>
          <Text className={styles.infoValue}>{record.partName || '—'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>零件序号</Text>
          <Text className={styles.infoValue}>{record.serialNumber}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>件号 P/N</Text>
          <Text className={styles.infoValue}>{record.partNumber || '—'}</Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>寿命 &amp; 循环</Text>
        <View className={styles.lifeGrid}>
          <View className={styles.lifeCell}>
            <Text className={styles.lifeCellLabel}>已用小时</Text>
            <Text className={styles.lifeCellValue}>
              {record.lifeHoursUsed != null ? `${record.lifeHoursUsed} FH` : '—'}
            </Text>
          </View>
          <View className={styles.lifeCell}>
            <Text className={styles.lifeCellLabel}>小时上限</Text>
            <Text className={styles.lifeCellValue}>
              {record.lifeHoursLimit != null ? `${record.lifeHoursLimit} FH` : '—'}
            </Text>
          </View>
          <View className={styles.lifeCell}>
            <Text className={styles.lifeCellLabel}>剩余小时</Text>
            <Text className={classnames(
              styles.lifeCellValue,
              isHoursDanger && styles.danger,
              !isHoursDanger && isHoursLow && styles.low
            )}>
              {lifeHoursRemain != null ? `${lifeHoursRemain} FH` : '—'}
            </Text>
          </View>
          <View className={styles.lifeCell}>
            <Text className={styles.lifeCellLabel}>剩余循环</Text>
            <Text className={classnames(
              styles.lifeCellValue,
              isCyclesDanger && styles.danger,
              !isCyclesDanger && isCyclesLow && styles.low
            )}>
              {cyclesRemain != null ? `${cyclesRemain} FC` : '—'}
            </Text>
          </View>
        </View>
        <View style={{ height: '24rpx' }} />
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>已用循环</Text>
          <Text className={styles.infoValue}>
            {record.cyclesUsed != null ? `${record.cyclesUsed} FC` : '—'}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>循环上限</Text>
          <Text className={styles.infoValue}>
            {record.cyclesLimit != null ? `${record.cyclesLimit} FC` : '—'}
          </Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>放行限制</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>MEL 限制</Text>
          <Text className={classnames(
            styles.infoValue,
            record.melRestriction && styles.infoValueWarn
          )}>
            {record.melRestriction || '无'}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>CDL 限制</Text>
          <Text className={classnames(
            styles.infoValue,
            record.cdlRestriction && styles.infoValueWarn
          )}>
            {record.cdlRestriction || '无'}
          </Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>签署记录</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>核验结果</Text>
          <Text className={classnames(
            styles.infoValue,
            record.releaseStatus === 'review' && styles.infoValueWarn,
            record.releaseStatus === 'reject' && styles.infoValueDanger
          )}>{statusText}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>签署人员</Text>
          <Text className={styles.infoValue}>{record.signedBy || record.verifier || '—'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>签署时间</Text>
          <Text className={styles.infoValue}>{formatDate(record.signedAt || record.verifiedAt)}</Text>
        </View>
        {record.remark && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>备注</Text>
            <Text className={styles.infoValue}>{record.remark}</Text>
          </View>
        )}
      </View>

      <View className={styles.actionRow}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text>返回</Text>
        </View>
        <View className={styles.exportBtn} onClick={() => setShowVoucher(true)}>
          <Text>📄 导出放行凭证</Text>
        </View>
      </View>

      {/* 放行凭证弹窗 */}
      {showVoucher && record && (
        <View className={styles.voucherMask} onClick={() => setShowVoucher(false)}>
          <View className={styles.voucherCard} onClick={e => e.stopPropagation && e.stopPropagation()}>
            <View className={styles.voucherHeader}>
              <View className={styles.voucherClose} onClick={() => setShowVoucher(false)}>
                <Text>×</Text>
              </View>
              <Text className={styles.voucherTitle}>寿命件核验放行凭证</Text>
              <Text className={styles.voucherSub}>LIFE LIMITED PART RELEASE CERTIFICATE</Text>
            </View>

            <ScrollView className={styles.voucherBody} scrollY>
              {/* 飞机确认 */}
              <View className={styles.voucherBlock}>
                <Text className={styles.voucherBlockTitle}>✈️ 飞机 &amp; 确认信息</Text>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>飞机注册号</Text>
                  <Text className={styles.voucherInfoValue}>{record.aircraftNo || '—'}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>装机位置</Text>
                  <Text className={styles.voucherInfoValue}>{record.position || '—'}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>关联航班</Text>
                  <Text className={styles.voucherInfoValue}>{record.flightNo || '—'}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>核验结论</Text>
                  <View className={classnames(styles.voucherStatus, styles[record.releaseStatus])}>
                    <Text>{getReleaseStatusText(record.releaseStatus)}</Text>
                  </View>
                </View>
              </View>

              {/* 零件信息 */}
              <View className={styles.voucherBlock}>
                <Text className={styles.voucherBlockTitle}>🔧 寿命件信息</Text>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>零件名称</Text>
                  <Text className={styles.voucherInfoValue}>{record.partName || '—'}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>零件序号 S/N</Text>
                  <Text className={styles.voucherInfoValue}>{record.serialNumber}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>件号 P/N</Text>
                  <Text className={styles.voucherInfoValue}>{record.partNumber || '—'}</Text>
                </View>
              </View>

              {/* 寿命与循环 */}
              <View className={styles.voucherBlock}>
                <Text className={styles.voucherBlockTitle}>⏱ 寿命 / 循环</Text>
                <View className={styles.voucherLifeRow}>
                  <View className={styles.voucherLifeCell}>
                    <Text className={styles.voucherLifeLabel}>已用小时 (FH)</Text>
                    <Text className={styles.voucherLifeValue}>
                      {record.lifeHoursUsed != null ? record.lifeHoursUsed : '—'}
                    </Text>
                  </View>
                  <View className={styles.voucherLifeCell}>
                    <Text className={styles.voucherLifeLabel}>小时上限</Text>
                    <Text className={styles.voucherLifeValue}>
                      {record.lifeHoursLimit != null ? record.lifeHoursLimit : '—'}
                    </Text>
                  </View>
                  <View className={styles.voucherLifeCell}>
                    <Text className={styles.voucherLifeLabel}>已用循环 (FC)</Text>
                    <Text className={styles.voucherLifeValue}>
                      {record.cyclesUsed != null ? record.cyclesUsed : '—'}
                    </Text>
                  </View>
                  <View className={styles.voucherLifeCell}>
                    <Text className={styles.voucherLifeLabel}>循环上限</Text>
                    <Text className={styles.voucherLifeValue}>
                      {record.cyclesLimit != null ? record.cyclesLimit : '—'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 放行限制 */}
              <View className={styles.voucherBlock}>
                <Text className={styles.voucherBlockTitle}>📋 放行限制 (MEL / CDL)</Text>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>MEL 限制</Text>
                  <Text className={styles.voucherInfoValue}>{record.melRestriction || '无'}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>CDL 限制</Text>
                  <Text className={styles.voucherInfoValue}>{record.cdlRestriction || '无'}</Text>
                </View>
                {record.remark && (
                  <View className={styles.voucherInfoRow}>
                    <Text className={styles.voucherInfoLabel}>备注</Text>
                    <Text className={styles.voucherInfoValue}>{record.remark}</Text>
                  </View>
                )}
              </View>

              {/* 签署 */}
              <View className={styles.voucherBlock}>
                <Text className={styles.voucherBlockTitle}>✍️ 签署信息</Text>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>放行签署人</Text>
                  <Text className={styles.voucherInfoValue}>{record.signedBy || record.verifier || '—'}</Text>
                </View>
                <View className={styles.voucherInfoRow}>
                  <Text className={styles.voucherInfoLabel}>签署时间</Text>
                  <Text className={styles.voucherInfoValue}>
                    {formatDate(record.signedAt || record.verifiedAt)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View className={styles.voucherFooter}>
              <View className={styles.voucherSignArea}>
                <Text className={styles.voucherSignLabel}>RELEASED BY</Text>
                <Text className={styles.voucherSignName}>{record.signedBy || record.verifier || '张伟'}</Text>
              </View>
              <View className={classnames(styles.voucherStamp, styles[record.releaseStatus])}>
                <Text>LIFE{'\n'}PART{'\n'}CHECKED</Text>
              </View>
            </View>

            <View className={styles.voucherFooterActions}>
              <View className={classnames(styles.voucherActionBtn, styles.voucherShare)} onClick={handleShareVoucher}>
                <Text>🔗 分享给班组长</Text>
              </View>
              <View className={classnames(styles.voucherActionBtn, styles.voucherSave)} onClick={handleSaveVoucher}>
                <Text>📥 保存凭证</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default VerifyDetailPage;
