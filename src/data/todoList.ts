import { TodoVerifyItem } from '@/types';

export const todoList: TodoVerifyItem[] = [
  {
    id: 'todo-001',
    aircraftNo: 'B-1234',
    position: '左发#1',
    flightNo: 'CA1831',
    partName: '高压涡轮叶片',
    serialNumber: 'SN-HTB-20240315-0087',
    deadline: '2026-06-22 10:45',
    priority: 'high',
    createdAt: '2026-06-22 09:20:00'
  },
  {
    id: 'todo-002',
    aircraftNo: 'B-5678',
    position: '主起落架右',
    flightNo: 'MU5112',
    partName: '刹车组件',
    serialNumber: 'SN-BRK-20240820-1245',
    deadline: '2026-06-22 11:30',
    priority: 'high',
    createdAt: '2026-06-22 09:45:00'
  },
  {
    id: 'todo-003',
    aircraftNo: 'B-9012',
    position: 'APU舱',
    flightNo: 'CZ3108',
    partName: 'APU燃油泵',
    serialNumber: 'SN-APU-20250110-0321',
    deadline: '2026-06-22 14:00',
    priority: 'normal',
    createdAt: '2026-06-22 08:30:00'
  },
  {
    id: 'todo-004',
    aircraftNo: 'B-3456',
    position: '前货舱门',
    flightNo: 'HU7605',
    partName: '货舱门锁作动筒',
    serialNumber: 'SN-ACT-20241105-0891',
    deadline: '2026-06-22 15:20',
    priority: 'normal',
    createdAt: '2026-06-22 07:15:00'
  },
  {
    id: 'todo-005',
    aircraftNo: 'B-7890',
    position: '右机翼#5',
    flightNo: '3U8882',
    partName: '前缘缝翼滑轨',
    serialNumber: 'SN-TRK-20230618-2054',
    deadline: '2026-06-22 16:45',
    priority: 'normal',
    createdAt: '2026-06-22 06:50:00'
  }
];
