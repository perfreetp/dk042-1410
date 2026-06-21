export type ReleaseStatus = 'pass' | 'review' | 'reject';

export type ReportStatus = 'pending' | 'processing' | 'resolved';

export type ReportType = 'blur' | 'mismatch' | 'noRecord' | 'other';

export interface PartInfo {
  id: string;
  serialNumber: string;
  partNumber: string;
  partName: string;
  isLifeControlled: boolean;
  lifeHours: number;
  lifeCycles: number;
  remainingHours: number;
  remainingCycles: number;
  hasMELRestriction: boolean;
  melCode?: string;
  melDescription?: string;
  hasCDLRestriction: boolean;
  cdlCode?: string;
  cdlDescription?: string;
  lastInstallSigner: string;
  lastInstallTime: string;
  lastInstallFlight: string;
  lastInstallPosition: string;
  releaseStatus: ReleaseStatus;
  releaseReason?: string;
}

export interface TodoVerifyItem {
  id: string;
  aircraftNo: string;
  position: string;
  flightNo: string;
  partName: string;
  serialNumber: string;
  deadline: string;
  priority: 'high' | 'normal';
  createdAt: string;
}

export interface VerifyRecord {
  id: string;
  serialNumber: string;
  partName: string;
  aircraftNo: string;
  position: string;
  releaseStatus: ReleaseStatus;
  verifier: string;
  verifiedAt: string;
  flightNo?: string;
}

export type ReportProgressNode = 'pending' | 'mccAccepted' | 'feedback' | 'resolved' | 'closed';

export interface ReportProgressItem {
  node: ReportProgressNode;
  title: string;
  description: string;
  operator?: string;
  time: string;
}

export interface ReportRecord {
  id: string;
  reportNo: string;
  reportType: ReportType;
  serialNumber?: string;
  partName?: string;
  aircraftNo: string;
  position: string;
  flightNo: string;
  photos: string[];
  remark: string;
  reporter: string;
  reportedAt: string;
  status: ReportStatus;
  handler?: string;
  resolvedAt?: string;
  resolution?: string;
  progress: ReportProgressItem[];
}
