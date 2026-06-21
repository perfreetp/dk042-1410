import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusCard from '@/components/StatusCard';
import { PartInfo, ReleaseStatus } from '@/types';
import { getPartInfoBySN, partInfoMock } from '@/data/partInfo';

const VerifyPage: React.FC = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [partInfo, setPartInfo] = useState<PartInfo | null>(null);
  const [searched, setSearched] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [aircraftNo, setAircraftNo] = useState('B-1234');
  const [position, setPosition] = useState('左发#1');
  const [contextFromTodo, setContextFromTodo] = useState<{ flightNo?: string; partName?: string } | null>(null);

  const presetSNList = useMemo(() => Object.keys(partInfoMock).slice(0, 3), []);

  useEffect(() => {
    const ctx = Taro.getStorageSync('presetVerifyContext');
    if (ctx && ctx.serialNumber) {
      console.log('[Verify] 从待办接收完整上下文:', ctx);
      setSerialNumber(ctx.serialNumber);
      setAircraftNo(ctx.aircraftNo);
      setPosition(ctx.position);
      setContextFromTodo({ flightNo: ctx.flightNo, partName: ctx.partName });
      handleVerify(ctx.serialNumber, ctx.aircraftNo, ctx.position);
      Taro.removeStorageSync('presetVerifyContext');
    }
  }, []);

  const handleScan = async () => {
    console.log('[Verify] 启动扫码');
    try {
      const res = await Taro.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode', 'barCode']
      });
      console.log('[Verify] 扫码结果:', res.result);
      if (res.result) {
        setSerialNumber(res.result);
        handleVerify(res.result);
      }
    } catch (e) {
      console.error('[Verify] 扫码失败:', e);
      Taro.showToast({ title: '扫码取消', icon: 'none' });
    }
  };

  const handleVerify = (sn?: string, overrideAircraft?: string, overridePosition?: string) => {
    const targetSN = sn || serialNumber;
    if (!targetSN.trim()) {
      Taro.showToast({ title: '请输入或扫描序号', icon: 'none' });
      return;
    }
    console.log('[Verify] 开始核验:', targetSN, '机位:', overrideAircraft || aircraftNo, overridePosition || position);
    setSearched(true);
    const result = getPartInfoBySN(targetSN.trim());
    if (result) {
      setPartInfo(result);
      setConfirmed(false);
      if (overrideAircraft && overridePosition) {
        setAircraftNo(overrideAircraft);
        setPosition(overridePosition);
      } else if (!contextFromTodo) {
        setAircraftNo('B-' + Math.floor(Math.random() * 9000 + 1000));
        const positions = ['左发#1', '右发#2', '主起落架右', 'APU舱', '前货舱门', '右机翼#5'];
        setPosition(positions[Math.floor(Math.random() * positions.length)]);
      }
      Taro.vibrateShort({ type: 'medium' });
    } else {
      console.warn('[Verify] 系统无该序号记录');
      setPartInfo(null);
      Taro.vibrateShort({ type: 'heavy' });
    }
  };

  const handleConfirmAction = (status: ReleaseStatus) => {
    if (!confirmed) {
      Taro.showToast({ title: '请先确认飞机号与位置一致', icon: 'none' });
      return;
    }
    console.log('[Verify] 签署确认:', status, '机号:', aircraftNo, '位置:', position);
    const actionText = status === 'pass' ? '已通过核验' : status === 'review' ? '已提交复核' : '已标记禁止放行';
    const statusText = status === 'pass' ? '可放行' : status === 'review' ? '需复核' : '禁止放行';
    const extraInfo = contextFromTodo?.flightNo ? ` 航班：${contextFromTodo.flightNo}` : '';
    Taro.showModal({
      title: '核验签署确认',
      content: `确认对以下信息执行「${statusText}」操作？\n\n飞机号：${aircraftNo}\n装机位置：${position}${extraInfo}\n零件序号：${serialNumber}`,
      confirmText: '确认签署',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: actionText, icon: 'success' });
          setContextFromTodo(null);
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/home/index' });
          }, 1500);
        }
      }
    });
  };

  const handleReportAbnormal = () => {
    console.log('[Verify] 跳转新建异常上报，携带序号:', serialNumber, '机号:', aircraftNo, '位置:', position);
    Taro.setStorageSync('presetReportContext', {
      reportType: 'noRecord' as const,
      serialNumber: serialNumber,
      partName: contextFromTodo?.partName,
      aircraftNo: aircraftNo,
      position: position,
      flightNo: contextFromTodo?.flightNo || ''
    });
    Taro.navigateTo({ url: '/pages/report-create/index' });
  };

  const hoursPercent = partInfo ? Math.round((partInfo.remainingHours / partInfo.lifeHours) * 100) : 0;
  const cyclesPercent = partInfo ? Math.round((partInfo.remainingCycles / partInfo.lifeCycles) * 100) : 0;
  const getBarClass = (pct: number) => {
    if (pct <= 0) return styles.rejectBar;
    if (pct <= 15) return styles.reviewBar;
    return styles.passBar;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.scanSection}>
        <Button className={styles.scanBtn} onClick={handleScan}>
          <Text className={styles.scanIcon}>📷</Text>
          <View className={styles.scanText}>
            <Text className={styles.scanMain}>扫描航材铭牌</Text>
            <Text className={styles.scanSub}>对准铭牌条码或二维码自动识别</Text>
          </View>
        </Button>

        <View className={styles.inputSection}>
          <Text className={styles.inputLabel}>或手动输入零件序号</Text>
          <View className={styles.inputRow}>
            <Input
              className={styles.snInput}
              placeholder='请输入序号 SN-XXXX'
              placeholderStyle='color: #C9CDD4'
              value={serialNumber}
              onInput={e => setSerialNumber(e.detail.value)}
              onConfirm={() => handleVerify()}
              confirmType='search'
            />
            <Button className={styles.verifyBtn} onClick={() => handleVerify()}>核验</Button>
          </View>
          <View className={styles.quickSNList}>
            {presetSNList.map(sn => (
              <View
                key={sn}
                className={styles.quickSNItem}
                onClick={() => { setSerialNumber(sn); handleVerify(sn); }}
              >
                <Text>{sn.slice(0, 15)}...</Text>
              </View>
            ))}
            <Text className={styles.confirmLabel} style={{ alignSelf: 'center', marginLeft: '8rpx' }}>
              （演示数据，点击试用）
            </Text>
          </View>
        </View>
      </View>

      {searched && partInfo && (
        <View className={styles.resultSection}>
          <Text className={styles.sectionTitle}>核验结果</Text>

          <View style={{ marginBottom: '24rpx' }}>
            <StatusCard status={partInfo.releaseStatus} reason={partInfo.releaseReason} />
          </View>

          <View className={styles.partCard}>
            <View className={styles.partHeader}>
              <View className={styles.partNameInfo}>
                <Text className={styles.partName}>{partInfo.partName}</Text>
                <Text className={styles.partNo}>件号: {partInfo.partNumber}</Text>
              </View>
              {partInfo.isLifeControlled && (
                <View className={styles.lifeBadge}>
                  <Text>⏱ 寿命控制</Text>
                </View>
              )}
            </View>

            <View className={styles.lifeStats}>
              <View className={styles.lifeItem}>
                <Text className={styles.lifeLabel}>剩余飞行小时</Text>
                <Text className={styles.lifeValue}>{partInfo.remainingHours.toLocaleString()}</Text>
                <Text className={styles.lifeUnit}>总寿命 {partInfo.lifeHours.toLocaleString()} FH</Text>
                <View className={styles.lifePercent}>
                  <View
                    className={styles.lifePercentBar + ' ' + getBarClass(hoursPercent)}
                    style={{ width: hoursPercent + '%' }}
                  />
                </View>
              </View>
              <View className={styles.lifeItem}>
                <Text className={styles.lifeLabel}>剩余飞行循环</Text>
                <Text className={styles.lifeValue}>{partInfo.remainingCycles.toLocaleString()}</Text>
                <Text className={styles.lifeUnit}>总寿命 {partInfo.lifeCycles.toLocaleString()} FC</Text>
                <View className={styles.lifePercent}>
                  <View
                    className={styles.lifePercentBar + ' ' + getBarClass(cyclesPercent)}
                    style={{ width: cyclesPercent + '%' }}
                  />
                </View>
              </View>
            </View>

            <View className={styles.restrictions}>
              <Text className={styles.restrictionTitle}>MEL / CDL 限制</Text>
              {partInfo.hasMELRestriction || partInfo.hasCDLRestriction ? (
                <View>
                  {partInfo.hasMELRestriction && partInfo.melCode && (
                    <View>
                      <View className={styles.restrictionTag + ' ' + styles.melTag}>
                        <Text>⚠ {partInfo.melCode}</Text>
                      </View>
                      {partInfo.melDescription && (
                        <View className={styles.restrictionDesc}>
                          <Text>{partInfo.melDescription}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  {partInfo.hasCDLRestriction && partInfo.cdlCode && (
                    <View style={{ marginTop: '16rpx' }}>
                      <View className={styles.restrictionTag + ' ' + styles.cdlTag}>
                        <Text>✕ {partInfo.cdlCode}</Text>
                      </View>
                      {partInfo.cdlDescription && (
                        <View className={styles.restrictionDesc}>
                          <Text>{partInfo.cdlDescription}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <Text className={styles.noRestriction}>✓ 无 MEL/CDL 关联限制</Text>
              )}
            </View>

            <View className={styles.installInfo}>
              <Text className={styles.installTitle}>最近一次装机记录</Text>
              <View className={styles.installRow}>
                <Text className={styles.installLabel}>签署人</Text>
                <Text className={styles.installValue}>{partInfo.lastInstallSigner}</Text>
              </View>
              <View className={styles.installRow}>
                <Text className={styles.installLabel}>装机时间</Text>
                <Text className={styles.installValue}>{partInfo.lastInstallTime}</Text>
              </View>
              <View className={styles.installRow}>
                <Text className={styles.installLabel}>装机航班</Text>
                <Text className={styles.installValue}>{partInfo.lastInstallFlight} · {partInfo.lastInstallPosition}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {searched && !partInfo && (
        <View className={styles.emptyHint}>
          <View className={styles.emptyIcon}>
            <Text>❓</Text>
          </View>
          <Text className={styles.emptyTitle}>系统无该序号记录</Text>
          <Text className={styles.emptyDesc}>
            可能是铭牌模糊识别错误，或该零件尚未录入系统。{'\n'}请仔细核对序号，或拍照上报给MCC处理。
          </Text>
          <Button
            className={classnames(styles.verifyBtn, styles.mainActionBtn)}
            style={{ marginTop: '32rpx', width: '100%', background: '#FF7D00' }}
            onClick={handleReportAbnormal}
          >
            拍照上报异常
          </Button>
        </View>
      )}

      {partInfo && (
        <View className={styles.confirmSection}>
          <View className={styles.aircraftConfirm}>
            <Text className={styles.confirmTitle}>⚠ 请确认实际飞机号与装机位置</Text>
            <View className={styles.confirmRow}>
              <View className={styles.confirmItem}>
                <Text className={styles.confirmLabel}>飞机号</Text>
                <Text className={styles.confirmValue}>{aircraftNo}</Text>
              </View>
              <View className={styles.confirmItem}>
                <Text className={styles.confirmLabel}>位置</Text>
                <Text className={styles.confirmValue}>{position}</Text>
              </View>
            </View>
            <View className={styles.checkboxRow} onClick={() => setConfirmed(!confirmed)}>
              <View className={classnames(styles.checkbox, confirmed && styles.checked)}>
                {confirmed && <Text style={{ color: '#fff', fontSize: '24rpx', fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text className={styles.checkboxText}>我已现场确认上述机号与位置与实物一致</Text>
            </View>
          </View>

          <View className={styles.bottomActions}>
            <Button className={styles.secondActionBtn} onClick={handleReportAbnormal}>
              异常上报
            </Button>
            <Button
              className={classnames(
                styles.mainActionBtn,
                partInfo.releaseStatus === 'pass' ? styles.passBtn :
                partInfo.releaseStatus === 'review' ? styles.reviewBtn : styles.rejectBtn
              )}
              onClick={() => handleConfirmAction(partInfo.releaseStatus)}
            >
              {partInfo.releaseStatus === 'pass' ? '✓ 签署放行' :
               partInfo.releaseStatus === 'review' ? '! 提交复核' : '✕ 标记禁飞'}
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default VerifyPage;
