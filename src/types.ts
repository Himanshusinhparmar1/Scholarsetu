export type UserRole = 'student' | 'institution' | 'government' | 'admin';

export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state?: string;
  institutionId?: string;
  status: UserStatus;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  homeState: string;
  studyState: string;
  institutionId: string;
  institutionName?: string;
  course: string;
  enrollmentNumber: string;
  academicYear: string;
  category: string;
  familyIncome: number;
  aadhaarNumber?: string;
  bankAccount?: string;
  isVerified?: boolean;
}

export type InstitutionType = 'Government' | 'Private' | 'University' | 'Polytechnic' | 'ITI' | 'Other';
export type InstitutionVerificationStatus = 'verified' | 'pending' | 'rejected';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  state: string;
  district: string;
  city: string;
  address: string;
  affiliation: string;
  institutionCode: string;
  verificationStatus: InstitutionVerificationStatus;
  contactEmail: string;
  contactPhone: string;
  nodalOfficerName?: string;
}

export type ScholarshipType = 'Central Government' | 'State Government' | 'University' | 'Private';
export type ScholarshipStatus = 'Active' | 'Upcoming' | 'Closed';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: ScholarshipType;
  description: string;
  eligibility: string;
  homeStates: string[]; // empty means all states
  studyStates: string[]; // empty means all states
  courses: string[];
  categories: string[];
  maxIncome: number;
  minAcademicMarks?: number;
  requiredDocuments: string[];
  deadline: string;
  amount: number;
  applicationLink?: string;
  status: ScholarshipStatus;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Payment Pending'
  | 'Payment Completed'
  | 'Institution Verification Pending'
  | 'Institution Verified'
  | 'Institution Rejected'
  | 'Government Verification Pending'
  | 'Approved'
  | 'Rejected'
  | 'Correction Required'
  | 'Withdrawn';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type VerificationStepStatus = 'Pending' | 'Verified' | 'Approved' | 'Rejected' | 'Correction Required';

export interface Application {
  id: string;
  applicationNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  amount: number;
  institutionId: string;
  institutionName: string;
  homeState: string;
  studyState: string;
  course: string;
  enrollmentNumber: string;
  academicYear: string;
  category: string;
  familyIncome: number;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  institutionVerificationStatus: VerificationStepStatus;
  governmentVerificationStatus: VerificationStepStatus;
  documents?: DocumentItem[];
  rejectionReason?: string;
  correctionRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  applicationId: string;
  studentId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  uploadedAt: string;
}

export interface PaymentRecord {
  id: string;
  applicationId: string;
  studentId: string;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}

export interface VerificationLog {
  id: string;
  applicationId: string;
  institutionId: string;
  verifiedBy: string;
  verifierRole: string;
  status: string;
  remarks: string;
  verifiedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemStats {
  totalStudents: number;
  totalInstitutions: number;
  totalScholarships: number;
  totalApplications: number;
  pendingVerifications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalCollectedFees: number;
  applicationFee: number;
}
