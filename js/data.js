// Seed data for Orbit by Niph Code (OSIS SMK Nusantara)
window.ORBIT_DATA = {
  roles: {
    Secretary: {
      role: 'Secretary',
      name: 'Nabila Putri',
      initials: 'NP',
      className: 'XI RPL 1',
      description: 'Manages documents, meeting minutes, forms, and member records.',
      canEditDocuments: true,
      canEditMembers: true,
      canEditFinance: false
    },
    Treasurer: {
      role: 'Treasurer',
      name: 'Rizky Ramadhan',
      initials: 'RR',
      className: 'XI AKL 2',
      description: 'Records income, expenses, and monitors the organization cash balance.',
      canEditDocuments: false,
      canEditMembers: false,
      canEditFinance: true
    },
    Member: {
      role: 'Member',
      name: 'Salsa Anindya',
      initials: 'SA',
      className: 'X DKV 1',
      description: 'Read-only access to review organization documents, finances, and records.',
      canEditDocuments: false,
      canEditMembers: false,
      canEditFinance: false
    }
  },

  organization: {
    name: 'OSIS SMK Nusantara',
    period: '2026/2027',
    advisor: 'Bu Ratna Dewi, S.Pd.',
    school: 'SMK Nusantara',
    email: 'osis@smknusantara.sch.id',
    room: 'Student Center Room 204'
  },

  activitiesThisMonth: 4,

  members: [
    {
      id: 'MEM-001',
      name: 'Aditya Pratama',
      className: 'XII TKJ 1',
      position: 'President',
      joinDate: '2025-08-14'
    },
    {
      id: 'MEM-002',
      name: 'Bagas Saputra',
      className: 'XII RPL 2',
      position: 'Vice President',
      joinDate: '2025-08-14'
    },
    {
      id: 'MEM-003',
      name: 'Nabila Putri',
      className: 'XI RPL 1',
      position: 'Secretary',
      joinDate: '2025-08-14'
    },
    {
      id: 'MEM-004',
      name: 'Dewi Lestari',
      className: 'XI OTKP 1',
      position: 'Deputy Secretary',
      joinDate: '2025-08-18'
    },
    {
      id: 'MEM-005',
      name: 'Rizky Ramadhan',
      className: 'XI AKL 2',
      position: 'Treasurer',
      joinDate: '2025-08-14'
    },
    {
      id: 'MEM-006',
      name: 'Fajar Nugroho',
      className: 'XI TKJ 2',
      position: 'Academic & Tech Head',
      joinDate: '2025-08-18'
    },
    {
      id: 'MEM-007',
      name: 'Keisha Maharani',
      className: 'XI DKV 2',
      position: 'Arts & Media Head',
      joinDate: '2025-08-20'
    },
    {
      id: 'MEM-008',
      name: 'Dimas Prakoso',
      className: 'X TKJ 1',
      position: 'Sports Coordinator',
      joinDate: '2026-07-20'
    },
    {
      id: 'MEM-009',
      name: 'Aulia Zahra',
      className: 'X RPL 2',
      position: 'Community Coordinator',
      joinDate: '2026-07-20'
    },
    {
      id: 'MEM-010',
      name: 'Reza Kurniawan',
      className: 'X AKL 1',
      position: 'Logistics Coordinator',
      joinDate: '2026-07-22'
    },
    {
      id: 'MEM-011',
      name: 'Salsa Anindya',
      className: 'X DKV 1',
      position: 'Member',
      joinDate: '2026-07-20'
    },
    {
      id: 'MEM-012',
      name: 'Tiara Kusuma',
      className: 'X OTKP 2',
      position: 'Member',
      joinDate: '2026-07-25'
    }
  ],

  documents: [
    {
      id: 'DOC-108',
      title: 'Pensi Committee Kickoff Meeting Minutes',
      category: 'Meeting Minutes',
      status: 'Final',
      uploadedBy: 'Nabila Putri',
      date: '2026-11-22',
      fileName: 'pensi-kickoff-minutes-nov2026.pdf',
      fileSize: '420 KB',
      notes: 'Assigned stage logistics, sponsorship outreach, and ticketing schedule for the December Art Festival.'
    },
    {
      id: 'DOC-107',
      title: 'School Art & Music Festival (Pensi) Sponsorship Proposal',
      category: 'Proposal',
      status: 'Draft',
      uploadedBy: 'Nabila Putri',
      date: '2026-11-18',
      fileName: 'pensi-2026-sponsorship-proposal-v2.pdf',
      fileSize: '1.8 MB',
      notes: 'Pending final budget sign-off from Bu Ratna Dewi, S.Pd. before sending to external partners.'
    },
    {
      id: 'DOC-106',
      title: 'Q1 Organizational Work Program Evaluation Report',
      category: 'Report',
      status: 'Draft',
      uploadedBy: 'Nabila Putri',
      date: '2026-11-10',
      fileName: 'osis-q1-evaluation-report.docx',
      fileSize: '690 KB',
      notes: 'Summarizes completion rate of July-October student council programs and attendance stats.'
    },
    {
      id: 'DOC-105',
      title: 'OSIS Monthly Coordination Meeting — October 2026',
      category: 'Meeting Minutes',
      status: 'Final',
      uploadedBy: 'Nabila Putri',
      date: '2026-10-12',
      fileName: 'coordination-minutes-oct2026.pdf',
      fileSize: '380 KB',
      notes: 'Reviewed October budget balance, equipment inventory, and Leadership Workshop preparations.'
    },
    {
      id: 'DOC-104',
      title: 'Independence Day Event Accountability Report (LPJ)',
      category: 'Report',
      status: 'Final',
      uploadedBy: 'Nabila Putri',
      date: '2026-09-02',
      fileName: 'lpj-hut-ri-2026-final.pdf',
      fileSize: '2.4 MB',
      notes: 'Full activity report and financial receipts approved by the Principal and Student Affairs.'
    },
    {
      id: 'DOC-103',
      title: 'Equipment Borrowing Request Form',
      category: 'Form',
      status: 'Final',
      uploadedBy: 'Dewi Lestari',
      date: '2026-08-25',
      fileName: 'equipment-borrowing-form-2026.pdf',
      fileSize: '215 KB',
      notes: 'Standard digital form for clubs requesting sound system, projectors, or tents.'
    },
    {
      id: 'DOC-102',
      title: 'Student Orientation Week (MPLS) Budget & Event Proposal',
      category: 'Proposal',
      status: 'Final',
      uploadedBy: 'Nabila Putri',
      date: '2026-07-18',
      fileName: 'mpls-2026-official-proposal.pdf',
      fileSize: '1.5 MB',
      notes: 'Approved proposal covering 350 incoming Grade X students across 3 orientation days.'
    },
    {
      id: 'DOC-101',
      title: 'New Member Registration Form 2026/2027',
      category: 'Form',
      status: 'Final',
      uploadedBy: 'Nabila Putri',
      date: '2026-07-10',
      fileName: 'osis-open-recruitment-form.pdf',
      fileSize: '310 KB',
      notes: 'Used during Grade X recruitment week; replaced printed paper registration sheets.'
    }
  ],

  transactions: [
    {
      id: 'TRX-015',
      date: '2026-11-19',
      description: 'Sound system deposit for School Art Festival (Pensi)',
      category: 'Event Operations',
      type: 'Expense',
      amount: 1200000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-014',
      date: '2026-11-04',
      description: 'Pensi 2026 sponsor booth early deposit',
      category: 'Sponsorship',
      type: 'Income',
      amount: 2000000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-013',
      date: '2026-10-27',
      description: 'Printing accountability reports and archive folders',
      category: 'Supplies & Printing',
      type: 'Expense',
      amount: 210000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-012',
      date: '2026-10-14',
      description: 'Leadership Workshop speaker honorarium',
      category: 'Event Operations',
      type: 'Expense',
      amount: 750000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-011',
      date: '2026-10-06',
      description: 'Monthly officer & member dues — October 2026',
      category: 'Membership Dues',
      type: 'Income',
      amount: 600000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-010',
      date: '2026-09-22',
      description: 'Portable wireless microphone and stand purchase',
      category: 'Equipment',
      type: 'Expense',
      amount: 850000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-009',
      date: '2026-09-08',
      description: 'Monthly officer & member dues — September 2026',
      category: 'Membership Dues',
      type: 'Income',
      amount: 600000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-008',
      date: '2026-08-19',
      description: 'Local bookstore sponsorship for Literacy Week',
      category: 'Sponsorship',
      type: 'Income',
      amount: 1500000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-007',
      date: '2026-08-15',
      description: 'Independence Day tournament prizes & stage props',
      category: 'Event Operations',
      type: 'Expense',
      amount: 1150000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-006',
      date: '2026-08-05',
      description: 'Monthly officer & member dues — August 2026',
      category: 'Membership Dues',
      type: 'Income',
      amount: 600000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-005',
      date: '2026-07-24',
      description: 'MPLS committee snacks and bottled water (3 days)',
      category: 'Refreshments',
      type: 'Expense',
      amount: 480000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-004',
      date: '2026-07-21',
      description: 'MPLS welcome kits & name tags for 350 new students',
      category: 'Event Operations',
      type: 'Expense',
      amount: 1450000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-003',
      date: '2026-07-12',
      description: 'School MPLS orientation operational budget grant',
      category: 'School Subsidy',
      type: 'Income',
      amount: 3200000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-002',
      date: '2026-06-18',
      description: 'Annual work program handbook printing & binding',
      category: 'Supplies & Printing',
      type: 'Expense',
      amount: 320000,
      recordedBy: 'Rizky Ramadhan'
    },
    {
      id: 'TRX-001',
      date: '2026-06-10',
      description: 'School Student Affairs operational subsidy Q2',
      category: 'School Subsidy',
      type: 'Income',
      amount: 2500000,
      recordedBy: 'Rizky Ramadhan'
    }
  ],

  history: [
    {
      id: 'HIS-010',
      actor: 'Nabila Putri',
      role: 'Secretary',
      action: 'Uploaded document "Pensi Committee Kickoff Meeting Minutes"',
      section: 'Documents',
      time: '22 Nov 2026, 15:40'
    },
    {
      id: 'HIS-009',
      actor: 'Rizky Ramadhan',
      role: 'Treasurer',
      action: 'Recorded expense Rp 1.200.000 — Sound system deposit for School Art Festival (Pensi)',
      section: 'Finance',
      time: '19 Nov 2026, 14:15'
    },
    {
      id: 'HIS-008',
      actor: 'Nabila Putri',
      role: 'Secretary',
      action: 'Saved draft proposal "School Art & Music Festival (Pensi) Sponsorship Proposal"',
      section: 'Documents',
      time: '18 Nov 2026, 10:25'
    },
    {
      id: 'HIS-007',
      actor: 'Nabila Putri',
      role: 'Secretary',
      action: 'Uploaded draft report "Q1 Organizational Work Program Evaluation Report"',
      section: 'Documents',
      time: '10 Nov 2026, 16:05'
    },
    {
      id: 'HIS-006',
      actor: 'Rizky Ramadhan',
      role: 'Treasurer',
      action: 'Recorded income Rp 2.000.000 — Pensi 2026 sponsor booth early deposit',
      section: 'Finance',
      time: '4 Nov 2026, 11:30'
    },
    {
      id: 'HIS-005',
      actor: 'Rizky Ramadhan',
      role: 'Treasurer',
      action: 'Recorded expense Rp 210.000 — Printing accountability reports and archive folders',
      section: 'Finance',
      time: '27 Oct 2026, 13:50'
    },
    {
      id: 'HIS-004',
      actor: 'Rizky Ramadhan',
      role: 'Treasurer',
      action: 'Recorded expense Rp 750.000 — Leadership Workshop speaker honorarium',
      section: 'Finance',
      time: '14 Oct 2026, 16:20'
    },
    {
      id: 'HIS-003',
      actor: 'Nabila Putri',
      role: 'Secretary',
      action: 'Published final minutes "OSIS Monthly Coordination Meeting — October 2026"',
      section: 'Documents',
      time: '12 Oct 2026, 15:10'
    },
    {
      id: 'HIS-002',
      actor: 'Rizky Ramadhan',
      role: 'Treasurer',
      action: 'Recorded expense Rp 850.000 — Portable wireless microphone and stand purchase',
      section: 'Finance',
      time: '22 Sep 2026, 11:05'
    },
    {
      id: 'HIS-001',
      actor: 'Nabila Putri',
      role: 'Secretary',
      action: 'Added new member Tiara Kusuma (X OTKP 2 — Member)',
      section: 'Members',
      time: '25 Jul 2026, 09:30'
    }
  ]
};
