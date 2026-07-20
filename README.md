db.json

{
  "employees": [],
  "departments": [],
  "attendanceLogs": [],
  "leaveRequests": [],
  "payrolls": [],
  "roles": [],
  "permissions": [],
  "holidays": [],
  "projects": [],
  "tasks": [],
  "announcements": []
}


I am building my own db.json for json-server. I wanted db.json to be used for my frontend employee management application. Below is the sample employee schema i have prepared. Act smart and give me node scrip to generate 200+ fake dummy data from this schema. Keep collection separate

{
  "id": "EMP001",
  "employeeCode": "EMS-2026-001",

  "personalInfo": {
    "firstName": "Aamod",
    "lastName": "Hardikar",
    "fullName": "Aamod Hardikar",
    "gender": "Male",
    "dateOfBirth": "2000-05-15",
    "maritalStatus": "Single",
    "bloodGroup": "O+",
    "nationality": "Indian",
    "email": "aamod.hardikar@company.com",
    "phone": "+91-9876543210",
    "alternatePhone": "+91-9876543211",
    "profileImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },

  "address": {
    "currentAddress": {
      "street": "College Road",
      "city": "Nashik",
      "state": "Maharashtra",
      "country": "India",
      "pincode": "422005"
    },
    "permanentAddress": {
      "street": "College Road",
      "city": "Nashik",
      "state": "Maharashtra",
      "country": "India",
      "pincode": "422005"
    }
  },

  "employment": {
    "designation": "Senior Frontend Developer",
    "departmentId": "DEPT001",
    "departmentName": "Engineering",
    "employeeType": "Full Time",
    "joiningDate": "2023-06-15",
    "workLocation": "Pune",
    "workMode": "Hybrid",
    "status": "Active",
    "probationEndDate": "2023-09-15",
    "manager": {
      "id": "EMP005",
      "name": "Rahul Sharma"
    }
  },

  "attendance": {
    "presentDays": 22,
    "absentDays": 1,
    "leaveDays": 2,
    "lateEntries": 3,
    "attendancePercentage": 95,
    "lastCheckIn": "2026-07-16T09:05:00",
    "lastCheckOut": "2026-07-16T18:15:00"
  },

  "salary": {
    "employeeCTC": 1800000,
    "monthlyGross": 150000,
    "basic": 75000,
    "hra": 30000,
    "specialAllowance": 25000,
    "pf": 1800,
    "professionalTax": 200,
    "otherDeductions": 1000,
    "netSalary": 147000,
    "currency": "INR"
  },

  "bankDetails": {
    "bankName": "HDFC Bank",
    "accountNumber": "XXXXXX4589",
    "ifscCode": "HDFC0001234",
    "branch": "Nashik"
  },

  "leaveBalance": {
    "casualLeave": 8,
    "sickLeave": 5,
    "earnedLeave": 12,
    "totalRemaining": 25
  },

  "performance": {
    "currentRating": 4.6,
    "lastAppraisalDate": "2026-04-01",
    "promotionEligible": true,
    "skills": [
      "React",
      "TypeScript",
      "Redux",
      "Node.js",
      "Jest"
    ]
  },

  "emergencyContact": {
    "name": "Anita Hardikar",
    "relationship": "Mother",
    "phone": "+91-9876543299"
  },

  "documents": [
    {
      "id": "DOC001",
      "type": "Aadhaar Card",
      "status": "Verified"
    },
    {
      "id": "DOC002",
      "type": "PAN Card",
      "status": "Verified"
    },
    {
      "id": "DOC003",
      "type": "Offer Letter",
      "status": "Uploaded"
    }
  ],

  "recentPayslip": {
    "month": "June",
    "year": 2026,
    "grossSalary": 150000,
    "deductions": 3000,
    "netSalary": 147000,
    "status": "Paid"
  },

  "createdAt": "2023-06-15T10:00:00Z",
  "updatedAt": "2026-07-16T18:00:00Z"
}