export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const getReleaseStatusText = (status: 'pass' | 'review' | 'reject'): string => {
  const map = {
    pass: '可放行',
    review: '需复核',
    reject: '禁止放行'
  };
  return map[status];
};

export const getReportTypeText = (type: 'blur' | 'mismatch' | 'noRecord' | 'other'): string => {
  const map = {
    blur: '铭牌模糊',
    mismatch: '序号不符',
    noRecord: '系统无记录',
    other: '其他异常'
  };
  return map[type];
};

export const getReportStatusText = (status: 'pending' | 'processing' | 'resolved' | 'closed'): string => {
  const map = {
    pending: '待接单',
    processing: '处理中',
    resolved: '待关闭',
    closed: '已关闭'
  };
  return map[status];
};

export const getReviewConclusionText = (c?: 'releasable' | 'needReplace' | 'notReleasable'): string => {
  const map = {
    releasable: '可放行',
    needReplace: '需后续换件',
    notReleasable: '不可放行'
  };
  return c ? map[c] : '—';
};
