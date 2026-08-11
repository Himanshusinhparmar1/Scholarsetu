import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  ProfileModel,
  InstitutionModel,
  ScholarshipModel,
  ApplicationModel,
  DocumentModel,
  PaymentModel,
  VerificationModel,
  NotificationModel,
  AuditLogModel,
  SettingModel,
} from './models.js';

// In-Memory Database store with seed data & helper methods
// Supports both MongoDB via Mongoose and Fallback In-Memory Engine for instant zero-config startup!

export interface DBState {
  users: any[];
  profiles: any[];
  institutions: any[];
  scholarships: any[];
  applications: any[];
  documents: any[];
  payments: any[];
  verifications: any[];
  notifications: any[];
  auditLogs: any[];
  settings: { [key: string]: any };
}

const initialFee = 150;

// Initialize seed data
export const db: DBState = {
  users: [],
  profiles: [],
  institutions: [],
  scholarships: [],
  applications: [],
  documents: [],
  payments: [],
  verifications: [],
  notifications: [],
  auditLogs: [],
  settings: {
    application_fee: initialFee,
  },
};

// Seed Helper
export async function seedInitialData() {
  const hashedPasswordStudent = await bcrypt.hash('Student@123', 10);
  const hashedPasswordInst = await bcrypt.hash('Inst@123', 10);
  const hashedPasswordGovt = await bcrypt.hash('Govt@123', 10);
  const hashedPasswordAdmin = await bcrypt.hash('Admin@123', 10);

  // 1. Institutions
  db.institutions = [
    {
      id: 'inst_001',
      name: 'COEP Technological University, Pune',
      type: 'Government',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Pune',
      address: 'Wellesley Rd, Shivajinagar, Pune, Maharashtra 411005',
      affiliation: 'Savitribai Phule Pune University / Autonomous',
      institutionCode: 'MH-ENG-0021',
      verificationStatus: 'verified',
      contactEmail: 'coep.nodal@coep.ac.in',
      contactPhone: '+91 20 2550 7000',
      nodalOfficerName: 'Prof. S. K. Kulkarni',
    },
    {
      id: 'inst_002',
      name: 'Indian Institute of Technology Gandhinagar (IITGN)',
      type: 'Government',
      state: 'Gujarat',
      district: 'Gandhinagar',
      city: 'Gandhinagar',
      address: 'Palaj, Gandhinagar, Gujarat 382355',
      affiliation: 'Institute of National Importance (IIT)',
      institutionCode: 'GJ-IIT-0001',
      verificationStatus: 'verified',
      contactEmail: 'iitg.nodal@iitgn.ac.in',
      contactPhone: '+91 79 2395 2000',
      nodalOfficerName: 'Dr. Rajesh Mehta',
    },
    {
      id: 'inst_003',
      name: 'Indian Institute of Science (IISc), Bengaluru',
      type: 'Government',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      city: 'Bengaluru',
      address: 'CV Raman Rd, Bengaluru, Karnataka 560012',
      affiliation: 'Deemed University / INI',
      institutionCode: 'KA-UNI-0005',
      verificationStatus: 'verified',
      contactEmail: 'iisc.nodal@iisc.ac.in',
      contactPhone: '+91 80 2293 2008',
      nodalOfficerName: 'Dr. Ramesh Rao',
    },
    {
      id: 'inst_004',
      name: 'Veermata Jijabai Technological Institute (VJTI)',
      type: 'Government',
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai',
      address: 'H. R. Mahajani Marg, Matunga, Mumbai, Maharashtra 400019',
      affiliation: 'University of Mumbai / Autonomous',
      institutionCode: 'MH-ENG-0010',
      verificationStatus: 'verified',
      contactEmail: 'vjti.nodal@vjti.ac.in',
      contactPhone: '+91 22 2419 8100',
      nodalOfficerName: 'Prof. A. V. Deshmukh',
    },
    {
      id: 'inst_005',
      name: 'Nirma University, Ahmedabad',
      type: 'Private',
      state: 'Gujarat',
      district: 'Ahmedabad',
      city: 'Ahmedabad',
      address: 'Sarkhej - Gandhinagar Hwy, Gota, Ahmedabad, Gujarat 382481',
      affiliation: 'Nirma University',
      institutionCode: 'GJ-UNI-0044',
      verificationStatus: 'verified',
      contactEmail: 'nirma.nodal@nirmauni.ac.in',
      contactPhone: '+91 79 7165 2000',
      nodalOfficerName: 'Prof. Hemant Joshi',
    },
    {
      id: 'inst_006',
      name: 'Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat',
      type: 'Government',
      state: 'Gujarat',
      district: 'Surat',
      city: 'Surat',
      address: 'Ichchhanath, Surat, Gujarat 395007',
      affiliation: 'Institute of National Importance (NIT)',
      institutionCode: 'GJ-NIT-0001',
      verificationStatus: 'verified',
      contactEmail: 'svnit.nodal@svnit.ac.in',
      contactPhone: '+91 261 225 9571',
      nodalOfficerName: 'Dr. Manish Patel',
    },
    {
      id: 'inst_007',
      name: 'Delhi Technological University (DTU)',
      type: 'Government',
      state: 'Delhi',
      district: 'North West Delhi',
      city: 'New Delhi',
      address: 'Shahbad Daulatpur, Main Bawana Road, Delhi 110042',
      affiliation: 'Delhi Technological University',
      institutionCode: 'DL-UNI-0008',
      verificationStatus: 'verified',
      contactEmail: 'dtu.nodal@dtu.ac.in',
      contactPhone: '+91 11 2787 1018',
      nodalOfficerName: 'Dr. Sunita Sharma',
    },
    {
      id: 'inst_008',
      name: 'BITS Pilani',
      type: 'Private',
      state: 'Rajasthan',
      district: 'Jhunjhunu',
      city: 'Pilani',
      address: 'Vidya Vihar, Pilani, Rajasthan 333031',
      affiliation: 'Deemed University',
      institutionCode: 'RJ-UNI-0012',
      verificationStatus: 'verified',
      contactEmail: 'bits.nodal@pilani.bits-pilani.ac.in',
      contactPhone: '+91 1596 245 073',
      nodalOfficerName: 'Prof. B. R. Singh',
    },
    {
      id: 'inst_009',
      name: 'PSG College of Technology',
      type: 'Private',
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      city: 'Coimbatore',
      address: 'Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641004',
      affiliation: 'Anna University',
      institutionCode: 'TN-ENG-0089',
      verificationStatus: 'verified',
      contactEmail: 'psg.nodal@psgtech.ac.in',
      contactPhone: '+91 422 257 2177',
      nodalOfficerName: 'Dr. K. Swaminathan',
    },
    {
      id: 'inst_010',
      name: 'Government Polytechnic Ahmedabad',
      type: 'Polytechnic',
      state: 'Gujarat',
      district: 'Ahmedabad',
      city: 'Ahmedabad',
      address: 'Near Panjrapole, Ambawadi, Ahmedabad, Gujarat 380015',
      affiliation: 'Gujarat Technological University (GTU)',
      institutionCode: 'GJ-POLY-0003',
      verificationStatus: 'verified',
      contactEmail: 'gpahmedabad@gujarat.gov.in',
      contactPhone: '+91 79 2630 1560',
      nodalOfficerName: 'Er. C. M. Patel',
    },
  ];

  // 2. Users
  db.users = [
    {
      id: 'usr_student_1',
      name: 'Rahul Patel',
      email: 'student@scholarsetu.in',
      phone: '+91 98765 43210',
      passwordHash: hashedPasswordStudent,
      role: 'student',
      state: 'Gujarat',
      status: 'active',
      createdAt: new Date('2026-01-15').toISOString(),
    },
    {
      id: 'usr_student_2',
      name: 'Ananya Sharma',
      email: 'ananya@scholarsetu.in',
      phone: '+91 98123 45678',
      passwordHash: hashedPasswordStudent,
      role: 'student',
      state: 'Rajasthan',
      status: 'active',
      createdAt: new Date('2026-01-20').toISOString(),
    },
    {
      id: 'usr_inst_1',
      name: 'Prof. S. K. Kulkarni',
      email: 'coep.nodal@coep.ac.in',
      phone: '+91 94220 11223',
      passwordHash: hashedPasswordInst,
      role: 'institution',
      state: 'Maharashtra',
      institutionId: 'inst_001',
      status: 'active',
      createdAt: new Date('2026-01-10').toISOString(),
    },
    {
      id: 'usr_inst_2',
      name: 'Dr. Rajesh Mehta',
      email: 'iitg.nodal@iitgn.ac.in',
      phone: '+91 98250 88776',
      passwordHash: hashedPasswordInst,
      role: 'institution',
      state: 'Gujarat',
      institutionId: 'inst_002',
      status: 'active',
      createdAt: new Date('2026-01-12').toISOString(),
    },
    {
      id: 'usr_govt_gj',
      name: 'Shri V. P. Solanki (Gujarat Dept of Education)',
      email: 'admin.gujarat@scholarships.gov.in',
      phone: '+91 79 2325 3300',
      passwordHash: hashedPasswordGovt,
      role: 'government',
      state: 'Gujarat',
      status: 'active',
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: 'usr_govt_mh',
      name: 'Smt. Madhuri Patil (MahaDBT Officer)',
      email: 'admin.maharashtra@scholarships.gov.in',
      phone: '+91 22 2202 5220',
      passwordHash: hashedPasswordGovt,
      role: 'government',
      state: 'Maharashtra',
      status: 'active',
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: 'usr_super_admin',
      name: 'ScholarSetu Chief Administrator',
      email: 'admin@scholarsetu.in',
      phone: '+91 11 2338 1234',
      passwordHash: hashedPasswordAdmin,
      role: 'admin',
      state: 'Delhi',
      status: 'active',
      createdAt: new Date('2026-01-01').toISOString(),
    },
  ];

  // 3. Profiles
  db.profiles = [
    {
      userId: 'usr_student_1',
      homeState: 'Gujarat',
      studyState: 'Maharashtra',
      institutionId: 'inst_001',
      institutionName: 'COEP Technological University, Pune',
      course: 'B.Tech Computer Engineering',
      enrollmentNumber: '2023-COEP-CS-084',
      academicYear: '3rd Year',
      category: 'OBC',
      familyIncome: 250000,
      aadhaarNumber: 'XXXX-XXXX-7890',
      bankAccount: 'SBIN0001234 / Acc: 3098****123',
      isVerified: true,
    },
    {
      userId: 'usr_student_2',
      homeState: 'Rajasthan',
      studyState: 'Karnataka',
      institutionId: 'inst_003',
      institutionName: 'Indian Institute of Science (IISc), Bengaluru',
      course: 'M.Tech Artificial Intelligence',
      enrollmentNumber: '2024-IISC-AI-012',
      academicYear: '1st Year',
      category: 'General',
      familyIncome: 450000,
      aadhaarNumber: 'XXXX-XXXX-4321',
      bankAccount: 'HDFC0005678 / Acc: 5010****432',
      isVerified: false,
    },
  ];

  // 4. Scholarships
  db.scholarships = [
    {
      id: 'sch_001',
      name: 'Inter-State Post-Matric Scholarship Scheme for SC/ST/OBC Students',
      provider: 'Ministry of Social Justice & Empowerment, Govt of India',
      type: 'Central Government',
      description:
        'Provides financial assistance to SC/ST/OBC students belonging to one State who are enrolled in higher education institutions in another State.',
      eligibility:
        'Student must belong to SC/ST/OBC/EWS category, studying outside home State, enrolled in a recognized degree/diploma program.',
      homeStates: [], // All states eligible
      studyStates: [],
      courses: ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBBS', 'MBA', 'Diploma'],
      categories: ['SC', 'ST', 'OBC', 'EWS'],
      maxIncome: 600000,
      minAcademicMarks: 60,
      requiredDocuments: [
        'Aadhaar / ID Proof',
        'Bonafide Certificate',
        'Domicile Certificate of Home State',
        'Income Certificate',
        'College Fee Receipt',
        'Marksheet of Qualifying Exam',
      ],
      deadline: '2026-10-31',
      amount: 48000,
      applicationLink: 'https://scholarships.gov.in',
      status: 'Active',
    },
    {
      id: 'sch_002',
      name: 'Mukhyamantri Yuva Swavalamban Yojana (MYSY Out-of-State Special)',
      provider: 'Education Department, Government of Gujarat',
      type: 'State Government',
      description:
        'Special scholarship scheme for Gujarati domicile students pursuing engineering, medical, or higher degree courses in premier institutions across India.',
      eligibility:
        'Domicile of Gujarat, minimum 80 percentile in Class 12th, annual family income below ₹6.00 Lakhs, studying in recognized institution in India.',
      homeStates: ['Gujarat'],
      studyStates: [],
      courses: ['B.Tech', 'MBBS', 'B.Arch', 'B.Pharm', 'M.Tech'],
      categories: ['General', 'OBC', 'EWS', 'SC', 'ST'],
      maxIncome: 600000,
      minAcademicMarks: 75,
      requiredDocuments: [
        'Gujarat Domicile Certificate',
        'Class 12th Marksheet',
        'Institution Verification Certificate',
        'Income Certificate issued by Mamlatdar',
        'Bank Passbook Copy',
      ],
      deadline: '2026-09-30',
      amount: 50000,
      applicationLink: 'https://mysy.guj.nic.in',
      status: 'Active',
    },
    {
      id: 'sch_003',
      name: 'Rajarshi Chhatrapati Shahu Maharaj Inter-State Assistance Scheme',
      provider: 'Higher & Technical Education Department, Govt of Maharashtra',
      type: 'State Government',
      description:
        'Financial aid for economically backward class (EBC) students of Maharashtra studying in premier technical and professional colleges outside Maharashtra.',
      eligibility:
        'Maharashtra Domicile, Family income up to ₹8.00 Lakhs, enrolled in government or accredited private professional colleges.',
      homeStates: ['Maharashtra'],
      studyStates: [],
      courses: ['B.Tech', 'M.Tech', 'MBBS', 'MBA', 'B.Pharm'],
      categories: ['General', 'EWS', 'OBC', 'SBC'],
      maxIncome: 800000,
      minAcademicMarks: 65,
      requiredDocuments: [
        'Maharashtra Domicile',
        'Income Certificate',
        'Bonafide Student Certificate',
        'CAP Allotment Letter / Admission Proof',
        'Aadhaar Linked Bank Account',
      ],
      deadline: '2026-11-15',
      amount: 60000,
      applicationLink: 'https://mahadbt.maharashtra.gov.in',
      status: 'Active',
    },
    {
      id: 'sch_004',
      name: 'Pragati Scholarship Scheme for Girl Students (AICTE Technical Education)',
      provider: 'All India Council for Technical Education (AICTE)',
      type: 'Central Government',
      description:
        'Scholarship aimed at empowering girl students admitted to AICTE approved technical diploma/degree institutions across any Indian state.',
      eligibility:
        'Female student admitted to 1st year or 2nd year (Lateral Entry) of Degree/Diploma course, maximum two girls per family, income up to ₹8 Lakhs.',
      homeStates: [],
      studyStates: [],
      courses: ['B.Tech', 'Diploma in Engineering'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      maxIncome: 800000,
      minAcademicMarks: 60,
      requiredDocuments: [
        'AICTE College Admission Proof',
        'Aadhaar Card',
        'Family Income Certificate',
        'Class 10th & 12th Marksheet',
        'Institution Verification Form',
      ],
      deadline: '2026-10-15',
      amount: 50000,
      applicationLink: 'https://www.aicte-india.org',
      status: 'Active',
    },
    {
      id: 'sch_005',
      name: 'Ishan Uday Special Scholarship for North Eastern Region',
      provider: 'University Grants Commission (UGC)',
      type: 'Central Government',
      description:
        'Special scholarship scheme for students from the 8 North Eastern States studying general degree, professional or technical courses in any Indian state.',
      eligibility:
        'Domicile of Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim or Tripura. Family income below ₹4.5 Lakhs.',
      homeStates: [
        'Assam',
        'Arunachal Pradesh',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Sikkim',
        'Tripura',
      ],
      studyStates: [],
      courses: ['B.A', 'B.Sc', 'B.Com', 'B.Tech', 'MBBS', 'BBA'],
      categories: ['General', 'SC', 'ST', 'OBC'],
      maxIncome: 450000,
      minAcademicMarks: 60,
      requiredDocuments: [
        'NE Domicile Certificate',
        'Annual Income Certificate',
        'Bonafide Certificate from College',
        'Aadhaar Card',
      ],
      deadline: '2026-12-01',
      amount: 78000,
      status: 'Active',
    },
  ];

  // 5. Sample Applications
  db.applications = [
    {
      id: 'app_001',
      applicationNumber: 'SS-2026-000101',
      studentId: 'usr_student_1',
      studentName: 'Rahul Patel',
      studentEmail: 'student@scholarsetu.in',
      studentPhone: '+91 98765 43210',
      scholarshipId: 'sch_002',
      scholarshipName: 'Mukhyamantri Yuva Swavalamban Yojana (MYSY Out-of-State Special)',
      provider: 'Education Department, Government of Gujarat',
      amount: 50000,
      institutionId: 'inst_001',
      institutionName: 'COEP Technological University, Pune',
      homeState: 'Gujarat',
      studyState: 'Maharashtra',
      course: 'B.Tech Computer Engineering',
      enrollmentNumber: '2023-COEP-CS-084',
      academicYear: '3rd Year',
      category: 'OBC',
      familyIncome: 250000,
      status: 'Institution Verification Pending',
      paymentStatus: 'Paid',
      institutionVerificationStatus: 'Pending',
      governmentVerificationStatus: 'Pending',
      documents: [
        {
          id: 'doc_101',
          applicationId: 'app_001',
          studentId: 'usr_student_1',
          documentType: 'Gujarat Domicile Certificate',
          fileName: 'Rahul_Patel_Domicile_GJ.pdf',
          fileUrl: '/api/documents/doc_101',
          verificationStatus: 'Pending',
          uploadedAt: new Date('2026-02-01').toISOString(),
        },
        {
          id: 'doc_102',
          applicationId: 'app_001',
          studentId: 'usr_student_1',
          documentType: 'COEP Bonafide & Fee Receipt',
          fileName: 'COEP_Bonafide_Rahul.pdf',
          fileUrl: '/api/documents/doc_102',
          verificationStatus: 'Pending',
          uploadedAt: new Date('2026-02-01').toISOString(),
        },
        {
          id: 'doc_103',
          applicationId: 'app_001',
          studentId: 'usr_student_1',
          documentType: 'Income Certificate',
          fileName: 'Income_Certificate_2025_26.pdf',
          fileUrl: '/api/documents/doc_103',
          verificationStatus: 'Pending',
          uploadedAt: new Date('2026-02-01').toISOString(),
        },
      ],
      createdAt: new Date('2026-02-01T10:30:00Z').toISOString(),
      updatedAt: new Date('2026-02-01T10:30:00Z').toISOString(),
    },
    {
      id: 'app_002',
      applicationNumber: 'SS-2026-000102',
      studentId: 'usr_student_1',
      studentName: 'Rahul Patel',
      studentEmail: 'student@scholarsetu.in',
      studentPhone: '+91 98765 43210',
      scholarshipId: 'sch_001',
      scholarshipName: 'Inter-State Post-Matric Scholarship Scheme for SC/ST/OBC Students',
      provider: 'Ministry of Social Justice & Empowerment, Govt of India',
      amount: 48000,
      institutionId: 'inst_001',
      institutionName: 'COEP Technological University, Pune',
      homeState: 'Gujarat',
      studyState: 'Maharashtra',
      course: 'B.Tech Computer Engineering',
      enrollmentNumber: '2023-COEP-CS-084',
      academicYear: '3rd Year',
      category: 'OBC',
      familyIncome: 250000,
      status: 'Institution Verified',
      paymentStatus: 'Paid',
      institutionVerificationStatus: 'Verified',
      governmentVerificationStatus: 'Pending',
      documents: [
        {
          id: 'doc_201',
          applicationId: 'app_002',
          studentId: 'usr_student_1',
          documentType: 'Aadhaar Card',
          fileName: 'Rahul_Aadhaar.pdf',
          fileUrl: '/api/documents/doc_201',
          verificationStatus: 'Verified',
          uploadedAt: new Date('2026-01-22').toISOString(),
        },
      ],
      createdAt: new Date('2026-01-22T14:15:00Z').toISOString(),
      updatedAt: new Date('2026-01-25T09:00:00Z').toISOString(),
    },
  ];

  // 6. Payments
  db.payments = [
    {
      id: 'pay_001',
      applicationId: 'app_001',
      studentId: 'usr_student_1',
      amount: 150,
      status: 'Paid',
      transactionId: 'TXN_SETU_20260201_998811',
      paymentMethod: 'UPI / Razorpay Sandbox',
      createdAt: new Date('2026-02-01T10:30:00Z').toISOString(),
    },
    {
      id: 'pay_002',
      applicationId: 'app_002',
      studentId: 'usr_student_1',
      amount: 150,
      status: 'Paid',
      transactionId: 'TXN_SETU_20260122_445566',
      paymentMethod: 'Net Banking Sandbox',
      createdAt: new Date('2026-01-22T14:15:00Z').toISOString(),
    },
  ];

  // 7. Notifications
  db.notifications = [
    {
      id: 'notif_001',
      userId: 'usr_student_1',
      title: 'Application Submitted',
      message:
        'Your application #SS-2026-000101 for MYSY Scholarship was submitted successfully and sent to COEP Pune for institution verification.',
      type: 'success',
      read: false,
      createdAt: new Date('2026-02-01T10:31:00Z').toISOString(),
    },
    {
      id: 'notif_002',
      userId: 'usr_inst_1',
      title: 'New Verification Request',
      message:
        'Student Rahul Patel (Enrollment: 2023-COEP-CS-084) from Home State Gujarat requested enrollment verification for Application #SS-2026-000101.',
      type: 'info',
      read: false,
      createdAt: new Date('2026-02-01T10:31:00Z').toISOString(),
    },
  ];

  // 8. Audit Logs
  db.auditLogs = [
    {
      id: 'log_001',
      userId: 'usr_student_1',
      userName: 'Rahul Patel',
      userRole: 'student',
      action: 'APPLICATION_SUBMITTED',
      resource: 'Application',
      resourceId: 'app_001',
      details: 'Submitted application SS-2026-000101 for MYSY scholarship with ₹150 fee paid.',
      ipAddress: '127.0.0.1',
      timestamp: new Date('2026-02-01T10:30:00Z').toISOString(),
    },
  ];

  console.log('✅ In-memory database seeded successfully with realistic Indian college & scholarship data!');
}

let isMongoConnected = false;

export function getDBStatus() {
  const readyState = mongoose.connection.readyState;
  const stateNames = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const host = mongoose.connection.host || 'N/A';
  const name = mongoose.connection.name || 'scholarsetu';

  return {
    isMongoConnected: readyState === 1,
    readyState,
    readyStateName: stateNames[readyState] || 'Disconnected',
    host,
    dbName: name,
    mongoUriConfigured: !!(process.env.MONGODB_URI || process.env.MONGO_URI),
  };
}

export async function syncMongoSeed() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0 && db.users.length > 0) {
      console.log('🌱 Populating MongoDB collections with initial master seed data...');
      await UserModel.insertMany(db.users);
      await ProfileModel.insertMany(db.profiles);
      await InstitutionModel.insertMany(db.institutions);
      await ScholarshipModel.insertMany(db.scholarships);
      await ApplicationModel.insertMany(db.applications);
      await DocumentModel.insertMany(db.documents);
      await PaymentModel.insertMany(db.payments);
      await VerificationModel.insertMany(db.verifications);
      await NotificationModel.insertMany(db.notifications);
      await AuditLogModel.insertMany(db.auditLogs);
      console.log('✅ MongoDB collections populated successfully with seed data!');
    }
  } catch (err: any) {
    console.error('⚠️ MongoDB seed synchronization note:', err.message);
  }
}

// Function to attempt Mongo connection
export async function saveUser(user: any) {
  const existingIdx = db.users.findIndex((u) => u.id === user.id);
  if (existingIdx >= 0) {
    db.users[existingIdx] = user;
  } else {
    db.users.push(user);
  }
  if (mongoose.connection.readyState === 1) {
    try {
      await UserModel.findOneAndUpdate({ id: user.id } as any, user, { upsert: true, new: true });
    } catch (err: any) {
      console.error('Mongo saveUser error:', err.message);
    }
  }
}

export async function saveProfile(profile: any) {
  const existingIdx = db.profiles.findIndex((p) => p.userId === profile.userId);
  if (existingIdx >= 0) {
    db.profiles[existingIdx] = { ...db.profiles[existingIdx], ...profile };
  } else {
    db.profiles.push(profile);
  }
  if (mongoose.connection.readyState === 1) {
    try {
      await ProfileModel.findOneAndUpdate({ userId: profile.userId } as any, profile, { upsert: true, new: true });
    } catch (err: any) {
      console.error('Mongo saveProfile error:', err.message);
    }
  }
}

export async function saveApplication(app: any) {
  const existingIdx = db.applications.findIndex((a) => a.id === app.id);
  if (existingIdx >= 0) {
    db.applications[existingIdx] = { ...db.applications[existingIdx], ...app };
  } else {
    db.applications.push(app);
  }
  if (mongoose.connection.readyState === 1) {
    try {
      await ApplicationModel.findOneAndUpdate({ id: app.id } as any, app, { upsert: true, new: true });
    } catch (err: any) {
      console.error('Mongo saveApplication error:', err.message);
    }
  }
}

export async function saveScholarship(sch: any) {
  const existingIdx = db.scholarships.findIndex((s) => s.id === sch.id);
  if (existingIdx >= 0) {
    db.scholarships[existingIdx] = { ...db.scholarships[existingIdx], ...sch };
  } else {
    db.scholarships.push(sch);
  }
  if (mongoose.connection.readyState === 1) {
    try {
      await ScholarshipModel.findOneAndUpdate({ id: sch.id } as any, sch, { upsert: true, new: true });
    } catch (err: any) {
      console.error('Mongo saveScholarship error:', err.message);
    }
  }
}

export async function saveInstitution(inst: any) {
  const existingIdx = db.institutions.findIndex((i) => i.id === inst.id);
  if (existingIdx >= 0) {
    db.institutions[existingIdx] = { ...db.institutions[existingIdx], ...inst };
  } else {
    db.institutions.push(inst);
  }
  if (mongoose.connection.readyState === 1) {
    try {
      await InstitutionModel.findOneAndUpdate({ id: inst.id } as any, inst, { upsert: true, new: true });
    } catch (err: any) {
      console.error('Mongo saveInstitution error:', err.message);
    }
  }
}

export async function savePayment(payment: any) {
  db.payments.push(payment);
  if (mongoose.connection.readyState === 1) {
    try {
      await PaymentModel.create(payment);
    } catch (err: any) {
      console.error('Mongo savePayment error:', err.message);
    }
  }
}

export async function saveVerification(verification: any) {
  db.verifications.push(verification);
  if (mongoose.connection.readyState === 1) {
    try {
      await VerificationModel.create(verification);
    } catch (err: any) {
      console.error('Mongo saveVerification error:', err.message);
    }
  }
}

export async function saveNotification(notif: any) {
  db.notifications.unshift(notif);
  if (mongoose.connection.readyState === 1) {
    try {
      await NotificationModel.create(notif);
    } catch (err: any) {
      console.error('Mongo saveNotification error:', err.message);
    }
  }
}

export async function saveAuditLog(log: any) {
  db.auditLogs.unshift(log);
  if (mongoose.connection.readyState === 1) {
    try {
      await AuditLogModel.create(log);
    } catch (err: any) {
      console.error('Mongo saveAuditLog error:', err.message);
    }
  }
}

export async function initDB() {
  await seedInitialData();

  const mongoUri =
    process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/scholarsetu';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB connected successfully via Mongoose to [${mongoose.connection.host}/${mongoose.connection.name}]!`);
    await syncMongoSeed();
  } catch (err: any) {
    isMongoConnected = false;
    console.log(
      '⚠️ MongoDB connection note: Local/Remote MongoDB instance not detected or server selection timed out. Operating seamlessly with in-memory database engine!'
    );
  }
}
