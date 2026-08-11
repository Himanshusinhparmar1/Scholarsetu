import mongoose from 'mongoose';

// 1. User Schema
const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'institution', 'government', 'admin'], required: true },
    state: { type: String, required: true },
    institutionId: { type: String },
    status: { type: String, default: 'active' },
  },
  { timestamps: true }
);

// 2. Student Profile Schema
const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    homeState: { type: String },
    studyState: { type: String },
    institutionId: { type: String },
    institutionName: { type: String },
    course: { type: String },
    enrollmentNumber: { type: String },
    academicYear: { type: String },
    category: { type: String },
    familyIncome: { type: Number },
    aadhaarNumber: { type: String },
    bankAccount: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 3. Institution Schema
const institutionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String },
    state: { type: String, required: true },
    district: { type: String },
    city: { type: String },
    address: { type: String },
    affiliation: { type: String },
    institutionCode: { type: String, required: true, unique: true },
    verificationStatus: { type: String, default: 'verified' },
    contactEmail: { type: String },
    contactPhone: { type: String },
    nodalOfficerName: { type: String },
  },
  { timestamps: true }
);

// 4. Scholarship Schema
const scholarshipSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, required: true },
    type: { type: String },
    description: { type: String },
    eligibility: { type: String },
    homeStates: [{ type: String }],
    studyStates: [{ type: String }],
    courses: [{ type: String }],
    categories: [{ type: String }],
    maxIncome: { type: Number },
    minAcademicMarks: { type: Number },
    requiredDocuments: [{ type: String }],
    deadline: { type: String },
    amount: { type: Number },
    applicationLink: { type: String },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

// 5. Application Schema
const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    applicationNumber: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    scholarshipId: { type: String, required: true },
    scholarshipName: { type: String, required: true },
    institutionId: { type: String, required: true },
    institutionName: { type: String, required: true },
    homeState: { type: String, required: true },
    studyState: { type: String, required: true },
    course: { type: String },
    academicYear: { type: String },
    familyIncome: { type: Number },
    requestedAmount: { type: Number },
    status: {
      type: String,
      enum: [
        'Draft',
        'Payment Pending',
        'Submitted',
        'Under Institution Verification',
        'Institution Verified',
        'Institution Rejected',
        'Under Home State Verification',
        'Approved',
        'Rejected',
        'Disbursed',
      ],
      default: 'Submitted',
    },
    institutionRemark: { type: String },
    homeStateRemark: { type: String },
    appliedAt: { type: String },
    updatedAtCustom: { type: String },
  },
  { timestamps: true }
);

// 6. Document Schema
const documentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    applicationId: { type: String, required: true },
    studentId: { type: String, required: true },
    documentType: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String },
    verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    verifiedBy: { type: String },
    verifiedAt: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

// 7. Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    applicationId: { type: String, required: true },
    studentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Paid' },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String },
    createdAtCustom: { type: String },
  },
  { timestamps: true }
);

// 8. Verification Schema
const verificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    applicationId: { type: String, required: true },
    stage: { type: String, enum: ['Institution', 'HomeStateGovt', 'SuperAdmin'], required: true },
    verifiedByUserId: { type: String, required: true },
    verifiedByName: { type: String, required: true },
    action: { type: String, enum: ['VERIFIED', 'REJECTED', 'FLAGGED', 'NEEDS_CORRECTION'], required: true },
    remarks: { type: String },
    timestampCustom: { type: String },
  },
  { timestamps: true }
);

// 9. Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false },
    createdAtCustom: { type: String },
  },
  { timestamps: true }
);

// 10. Audit Log Schema
const auditLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: String },
    ipAddress: { type: String },
    timestampCustom: { type: String },
  },
  { timestamps: true }
);

// 11. Settings Schema
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export const InstitutionModel = mongoose.models.Institution || mongoose.model('Institution', institutionSchema);
export const ScholarshipModel = mongoose.models.Scholarship || mongoose.model('Scholarship', scholarshipSchema);
export const ApplicationModel = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export const DocumentModel = mongoose.models.Document || mongoose.model('Document', documentSchema);
export const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export const VerificationModel = mongoose.models.Verification || mongoose.model('Verification', verificationSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export const SettingModel = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
