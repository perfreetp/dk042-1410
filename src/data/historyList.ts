import { VerifyRecord } from '@/types';

export const historyList: VerifyRecord[] = [
  {
    id: 'his-001',
    serialNumber: 'SN-HTB-20240315-0087',
    partName: '高压涡轮叶片',
    aircraftNo: 'B-1234',
    position: '左发#1',
    releaseStatus: 'pass',
    verifier: '张伟',
    verifiedAt: '2026-06-22 09:55:00',
    flightNo: 'CA1831'
  },
  {
    id: 'his-002',
    serialNumber: 'SN-BRK-20240820-1245',
    partName: '刹车组件',
    aircraftNo: 'B-5678',
    position: '主起落架右',
    releaseStatus: 'review',
    verifier: '李明',
    verifiedAt: '2026-06-22 08:30:00',
    flightNo: 'MU5112'
  },
  {
    id: 'his-003',
    serialNumber: 'SN-TRK-20230618-2054',
    partName: '前缘缝翼滑轨',
    aircraftNo: 'B-7890',
    position: '右机翼#5',
    releaseStatus: 'pass',
    verifier: '钱伟',
    verifiedAt: '2026-06-21 21:15:00',
    flightNo: '3U8882'
  },
  {
    id: 'his-004',
    serialNumber: 'SN-APU-20250110-0321',
    partName: 'APU燃油泵',
    aircraftNo: 'B-9012',
    position: 'APU舱',
    releaseStatus: 'reject',
    verifier: '王强',
    verifiedAt: '2026-06-21 19:40:00',
    flightNo: 'CZ3108'
  },
  {
    id: 'his-005',
    serialNumber: 'SN-ACT-20241105-0891',
    partName: '货舱门锁作动筒',
    aircraftNo: 'B-3456',
    position: '前货舱门',
    releaseStatus: 'pass',
    verifier: '赵军',
    verifiedAt: '2026-06-21 14:25:00',
    flightNo: 'HU7605'
  },
  {
    id: 'his-006',
    serialNumber: 'SN-ENG-20240120-0055',
    partName: '发动机点火嘴',
    aircraftNo: 'B-2233',
    position: '右发#3',
    releaseStatus: 'pass',
    verifier: '张伟',
    verifiedAt: '2026-06-20 17:50:00',
    flightNo: 'CA985'
  },
  {
    id: 'his-007',
    serialNumber: 'SN-HYD-20240930-1120',
    partName: '液压泵',
    aircraftNo: 'B-4455',
    position: '机身中央',
    releaseStatus: 'review',
    verifier: '李明',
    verifiedAt: '2026-06-20 11:10:00',
    flightNo: 'MU5155'
  }
];
