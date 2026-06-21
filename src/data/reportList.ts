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
    resolution: ''
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
    resolution: '已核实为录入错误，系统记录已更正为实物序号，可正常放行'
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
    resolution: '新装机件漏录，已补录系统，寿命起始值已设定，可正常放行'
  }
];
