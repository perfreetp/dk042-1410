import { ReportRecord } from '@/types';

export const reportList: ReportRecord[] = [
  {
    id: 'report-001',
    reportNo: 'RPT-20260622-001',
    reportType: 'blur',
    serialNumber: 'SN-ENG-2024XXXX-XXXX',
    partName: '发动机燃油滤',
    aircraftNo: 'B-2468',
    position: '右发#2',
    flightNo: 'CA1501',
    photos: ['https://picsum.photos/id/3/600/400'],
    remark: '铭牌严重氧化模糊，序号后几位无法辨认，请MCC核对库存记录',
    reporter: '张伟',
    reportedAt: '2026-06-22 08:45:00',
    status: 'processing',
    handler: '航材控制-李丽',
    progress: [
      {
        node: 'pending',
        title: '已提交待处理',
        description: '一线维修人员提交异常上报单',
        operator: '张伟',
        time: '2026-06-22 08:45:00'
      },
      {
        node: 'mccAccepted',
        title: 'MCC已接单',
        description: 'MCC调度员已分配给航材控制岗处理',
        operator: 'MCC值班-王芳',
        time: '2026-06-22 08:50:00'
      },
      {
        node: 'feedback',
        title: '处理中',
        description: '航材控制正在查询库存与出库记录，预计15分钟内回复',
        operator: '航材控制-李丽',
        time: '2026-06-22 09:02:00'
      }
    ]
  },
  {
    id: 'report-002',
    reportNo: 'RPT-20260621-003',
    reportType: 'mismatch',
    serialNumber: 'SN-LDG-20230512-0777',
    partName: '前起落架撑杆',
    aircraftNo: 'B-1357',
    position: '前起落架',
    flightNo: 'MU5303',
    photos: ['https://picsum.photos/id/6/600/400', 'https://picsum.photos/id/9/600/400'],
    remark: '实物铭牌序号SN-LDG-20230512-0777，系统记录为SN-LDG-20230512-0999，请核对',
    reporter: '李明',
    reportedAt: '2026-06-21 16:20:00',
    status: 'resolved',
    handler: 'MCC值班-王芳',
    resolvedAt: '2026-06-21 18:05:00',
    resolution: '已核实为录入错误，系统记录已更正为实物序号，可正常放行',
    progress: [
      {
        node: 'pending',
        title: '已提交待处理',
        description: '一线维修人员提交异常上报单',
        operator: '李明',
        time: '2026-06-21 16:20:00'
      },
      {
        node: 'mccAccepted',
        title: 'MCC已接单',
        description: 'MCC调度员已分配给质量工程部处理',
        operator: 'MCC值班-王芳',
        time: '2026-06-21 16:25:00'
      },
      {
        node: 'feedback',
        title: '已反馈进展',
        description: '质量工程正在调取履历本和入库单交叉核对',
        operator: '质量工程-陈磊',
        time: '2026-06-21 17:00:00'
      },
      {
        node: 'resolved',
        title: '已解决',
        description: '已核实为录入错误，系统记录已更正为实物序号，可正常放行',
        operator: '质量工程-陈磊',
        time: '2026-06-21 18:05:00'
      }
    ]
  },
  {
    id: 'report-003',
    reportNo: 'RPT-20260621-001',
    reportType: 'noRecord',
    partName: '空调散热风扇',
    aircraftNo: 'B-8642',
    position: '机身左#3',
    flightNo: 'CZ3521',
    photos: ['https://picsum.photos/id/1/600/400'],
    remark: '扫描铭牌系统无任何匹配记录，怀疑为未登记新件，请航材确认',
    reporter: '王强',
    reportedAt: '2026-06-21 09:15:00',
    status: 'resolved',
    handler: '航材控制-陈刚',
    resolvedAt: '2026-06-21 10:40:00',
    resolution: '新装机件漏录，已补录系统，寿命起始值已设定，可正常放行',
    progress: [
      {
        node: 'pending',
        title: '已提交待处理',
        description: '一线维修人员提交异常上报单',
        operator: '王强',
        time: '2026-06-21 09:15:00'
      },
      {
        node: 'mccAccepted',
        title: 'MCC已接单',
        description: 'MCC调度员已分配给航材控制处理',
        operator: 'MCC值班-刘阳',
        time: '2026-06-21 09:20:00'
      },
      {
        node: 'feedback',
        title: '已反馈进展',
        description: '航材正在查询批次入库与装机单',
        operator: '航材控制-陈刚',
        time: '2026-06-21 09:45:00'
      },
      {
        node: 'resolved',
        title: '已解决',
        description: '新装机件漏录，已补录系统，寿命起始值已设定，可正常放行',
        operator: '航材控制-陈刚',
        time: '2026-06-21 10:40:00'
      }
    ]
  }
];
