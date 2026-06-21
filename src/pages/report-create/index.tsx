import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input, Textarea, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ReportType, ReportRecord } from '@/types';
import { getReportTypeText } from '@/utils/format';

const DEMO_PHOTOS = [
  'https://picsum.photos/id/3/600/400',
  'https://picsum.photos/id/6/600/400',
  'https://picsum.photos/id/9/600/400'
];

const TYPE_OPTIONS: Array<{
  key: ReportType;
  icon: string;
  name: string;
  desc: string;
}> = [
  { key: 'blur', icon: '🌫', name: '铭牌模糊', desc: '氧化、磨损、看不清' },
  { key: 'mismatch', icon: '⚠️', name: '序号不符', desc: '实物与系统记录不一致' },
  { key: 'noRecord', icon: '❓', name: '系统无记录', desc: '未找到该零件信息' },
  { key: 'other', icon: '📝', name: '其他异常', desc: '其他需要上报的情况' }
];

const presetReportStorage = 'presetReportContext';
const newReportListStorage = 'newReportList';

const ReportCreatePage: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('blur');
  const [serialNumber, setSerialNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [aircraftNo, setAircraftNo] = useState('');
  const [position, setPosition] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [remark, setRemark] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hasPreset, setHasPreset] = useState(false);

  useEffect(() => {
    const ctx = Taro.getStorageSync(presetReportStorage);
    if (ctx) {
      console.log('[ReportCreate] 接收到预设上下文:', ctx);
      if (ctx.reportType) setReportType(ctx.reportType);
      if (ctx.serialNumber) setSerialNumber(ctx.serialNumber);
      if (ctx.partName) setPartName(ctx.partName);
      if (ctx.aircraftNo) setAircraftNo(ctx.aircraftNo);
      if (ctx.position) setPosition(ctx.position);
      if (ctx.flightNo) setFlightNo(ctx.flightNo);
      setHasPreset(true);
      Taro.removeStorageSync(presetReportStorage);
    }
  }, []);

  const handleChoosePhoto = async () => {
    if (photos.length >= 6) {
      Taro.showToast({ title: '最多上传6张照片', icon: 'none' });
      return;
    }
    try {
      const res = await Taro.chooseMedia({
        count: 6 - photos.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      });
      if (res.tempFiles && res.tempFiles.length > 0) {
        const newUrls = res.tempFiles.map(f => f.tempFilePath);
        const finalUrls = photos.concat(newUrls).slice(0, 6);
        console.log('[ReportCreate] 新选照片:', finalUrls);
        setPhotos(finalUrls);
      }
    } catch (e) {
      console.warn('[ReportCreate] 选择照片失败，使用demo图', e);
      const remaining = Math.min(6 - photos.length, DEMO_PHOTOS.length);
      if (remaining > 0) {
        const demoNew = DEMO_PHOTOS.slice(0, remaining);
        setPhotos(photos.concat(demoNew).slice(0, 6));
      }
    }
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const canSubmit = aircraftNo.trim() && position.trim() && flightNo.trim() && !submitting;

  const handleSubmit = () => {
    if (!aircraftNo.trim()) return Taro.showToast({ title: '请输入飞机号', icon: 'none' });
    if (!position.trim()) return Taro.showToast({ title: '请输入停场位置', icon: 'none' });
    if (!flightNo.trim()) return Taro.showToast({ title: '请输入航班号', icon: 'none' });

    setSubmitting(true);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const reportedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const reportNo = `RPT-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(Math.floor(Math.random() * 900) + 100)}`;

    const newRecord: ReportRecord = {
      id: 'new-' + Date.now(),
      reportNo,
      reportType,
      serialNumber: serialNumber.trim() || undefined,
      partName: partName.trim() || undefined,
      aircraftNo: aircraftNo.trim(),
      position: position.trim(),
      flightNo: flightNo.trim(),
      photos: photos.length > 0 ? photos : [DEMO_PHOTOS[0]],
      remark: remark.trim() || '一线维修现场拍照上报',
      reporter: '张伟',
      reportedAt,
      status: 'pending',
      progress: [
        {
          node: 'pending',
          title: '已提交待处理',
          description: `一线维修人员${getReportTypeText(reportType)}，提交MCC处理`,
          operator: '张伟',
          time: reportedAt
        }
      ]
    };

    console.log('[ReportCreate] 提交上报单:', newRecord);

    try {
      const existingRaw = Taro.getStorageSync(newReportListStorage);
      const existing: ReportRecord[] = Array.isArray(existingRaw) ? existingRaw : [];
      existing.unshift(newRecord);
      Taro.setStorageSync(newReportListStorage, existing);
    } catch (e) {
      console.error('[ReportCreate] 写入 storage 失败:', e);
    }

    Taro.showModal({
      title: '上报提交成功',
      content: `上报单：${reportNo}\n已提交MCC处理，状态：待处理\n\n是否返回上报列表查看？`,
      confirmText: '查看列表',
      cancelText: '继续填单',
      success: (res) => {
        setSubmitting(false);
        if (res.confirm) {
          console.log('[ReportCreate] 返回上报列表');
          Taro.switchTab({ url: '/pages/report/index' });
        } else {
          setRemark('');
          setPhotos([]);
          Taro.showToast({ title: '可继续上报新单', icon: 'success' });
        }
      },
      fail: () => {
        setSubmitting(false);
        Taro.switchTab({ url: '/pages/report/index' });
      }
    });
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>异常类型</Text>
        <View className={styles.typeGrid}>
          {TYPE_OPTIONS.map(opt => (
            <View
              key={opt.key}
              className={classnames(styles.typeItem, reportType === opt.key && styles.typeActive)}
              onClick={() => setReportType(opt.key)}
            >
              <Text className={styles.typeIcon}>{opt.icon}</Text>
              <Text className={styles.typeName}>{opt.name}</Text>
              <Text className={styles.typeDesc}>{opt.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>零件信息</Text>
        {(serialNumber || partName) && hasPreset && (
          <View className={styles.presetTag}>
            <Text>✓ 由核验页自动带入系统无记录信息</Text>
          </View>
        )}
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>零件序号 (SN)</Text>
          <Input
            className={styles.formInput}
            placeholder='如铭牌不清可留空'
            placeholderStyle='color: #C9CDD4'
            value={serialNumber}
            onInput={e => setSerialNumber(e.detail.value)}
          />
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>零件名称</Text>
          <Input
            className={styles.formInput}
            placeholder='如：刹车组件 / APU燃油泵'
            placeholderStyle='color: #C9CDD4'
            value={partName}
            onInput={e => setPartName(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>现场信息</Text>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>飞机号
          </Text>
          <Input
            className={styles.formInput}
            placeholder='如：B-1234'
            placeholderStyle='color: #C9CDD4'
            value={aircraftNo}
            onInput={e => setAircraftNo(e.detail.value)}
          />
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>停场/装机位置
          </Text>
          <Input
            className={styles.formInput}
            placeholder='如：左发#1 / 主起落架右 / T3停机位'
            placeholderStyle='color: #C9CDD4'
            value={position}
            onInput={e => setPosition(e.detail.value)}
          />
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>航班号
          </Text>
          <Input
            className={styles.formInput}
            placeholder='如：CA1831'
            placeholderStyle='color: #C9CDD4'
            value={flightNo}
            onInput={e => setFlightNo(e.detail.value)}
          />
          <Text className={styles.inputHint}>短停航班号方便MCC快速定位航段</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>现场照片 ({photos.length}/6)</Text>
        <View className={styles.photoUploadArea}>
          {photos.map((url, idx) => (
            <View key={idx} className={styles.photoItem}>
              <Image className={styles.photoImg} src={url} mode='aspectFill' />
              <View className={styles.photoRemove} onClick={(e) => handleRemovePhoto(idx, e as any)}>
                <Text>×</Text>
              </View>
            </View>
          ))}
          {photos.length < 6 && (
            <View className={styles.photoAddBtn} onClick={handleChoosePhoto}>
              <Text className={styles.photoAddIcon}>＋</Text>
              <Text className={styles.photoAddText}>拍照/相册</Text>
            </View>
          )}
          <Text className={styles.photoHint}>建议拍：铭牌全景 + 零件装机位置特写 + 局部磨损/异常特写</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>异常说明</Text>
        <View className={styles.formRow}>
          <Textarea
            className={styles.formTextarea}
            placeholder='请简要描述异常情况，如：铭牌氧化严重，最后3位字符无法识别；或实物序号与履历本记载不符等。'
            placeholderStyle='color: #C9CDD4'
            value={remark}
            onInput={e => setRemark(e.detail.value)}
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.bottomActions}>
        <Button className={styles.cancelBtn} onClick={handleCancel}>
          取消
        </Button>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.submitBtnDisabled)}
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? '提交中...' : '📤 提交MCC处理'}
        </Button>
      </View>
    </View>
  );
};

export default ReportCreatePage;
