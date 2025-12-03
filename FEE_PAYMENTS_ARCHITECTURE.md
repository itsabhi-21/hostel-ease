# Fee Payments System - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Fee Payments    │  │  New Payment     │  │   Payment     │ │
│  │  List Page       │  │  Form Page       │  │   Details     │ │
│  │  /fee-payments   │  │  /fee-payments/  │  │   /fee-       │ │
│  │                  │  │  new             │  │   payments/   │ │
│  │  - Statistics    │  │                  │  │   [id]        │ │
│  │  - Filters       │  │  - Student       │  │               │ │
│  │  - Table         │  │    Dropdown      │  │  - Details    │ │
│  │  - Pagination    │  │  - Fee Type      │  │  - Mark Paid  │ │
│  └──────────────────┘  │  - Amount        │  │  - Status     │ │
│                        │  - Due Date      │  └───────────────┘ │
│                        └──────────────────┘                     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Student Dashboard Integration                │  │
│  │  - Pending Fees Card                                      │  │
│  │  - Quick Action Button                                    │  │
│  │  - Fee Count Display                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Sidebar Navigation                        │  │
│  │  - Fee Payments Link (All Roles)                          │  │
│  │  - CreditCard Icon                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Fee Payment Routes                           │  │
│  │              /api/fee-payments                            │  │
│  │                                                            │  │
│  │  GET    /                    - List all payments          │  │
│  │  GET    /stats               - Get statistics             │  │
│  │  GET    /:id                 - Get payment by ID          │  │
│  │  POST   /                    - Create payment             │  │
│  │  PUT    /:id/pay             - Mark as paid               │  │
│  │  PUT    /:id/status          - Update status              │  │
│  │  PUT    /:id                 - Update payment             │  │
│  │  DELETE /:id                 - Delete payment             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Auth Routes (Extended)                       │  │
│  │              /api/auth                                    │  │
│  │                                                            │  │
│  │  GET    /users               - Get users list             │  │
│  │  GET    /users?role=STUDENT  - Get students only          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Prisma ORM
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FeePayment Model                       │  │
│  │                                                            │  │
│  │  - id              : ObjectId (Primary Key)               │  │
│  │  - studentId       : ObjectId (Foreign Key → User)        │  │
│  │  - feeType         : Enum (FeeType)                       │  │
│  │  - amount          : Float                                │  │
│  │  - dueDate         : DateTime                             │  │
│  │  - paidDate        : DateTime (Optional)                  │  │
│  │  - status          : Enum (PaymentStatus)                 │  │
│  │  - transactionId   : String (Optional)                    │  │
│  │  - paymentMethod   : Enum (PaymentMethod, Optional)       │  │
│  │  - semester        : String                               │  │
│  │  - academicYear    : String                               │  │
│  │  - remarks         : String (Optional)                    │  │
│  │  - createdAt       : DateTime                             │  │
│  │  - updatedAt       : DateTime                             │  │
│  │                                                            │  │
│  │  Relationship:                                             │  │
│  │  - student → User (Many-to-One, Cascade Delete)           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. View Fee Payments (Student)
```
User (Student) → Frontend → GET /api/fee-payments?studentId=xxx
                          ↓
                    Backend filters by studentId
                          ↓
                    Database query with filters
                          ↓
                    Return student's payments only
                          ↓
                    Frontend displays in table
```

### 2. View All Payments (Admin/Warden)
```
User (Admin) → Frontend → GET /api/fee-payments
                        ↓
                  Backend fetches all payments
                        ↓
                  Database query with pagination
                        ↓
                  Return all payments with student info
                        ↓
                  Frontend displays in table
```

### 3. Create Fee Payment (Admin/Warden)
```
User (Admin) → Fill Form → POST /api/fee-payments
                         ↓
                   Validate input
                         ↓
                   Create in database
                         ↓
                   Return created payment
                         ↓
                   Redirect to list page
```

### 4. Mark Payment as Paid (Admin/Warden)
```
User (Admin) → View Details → Click "Process Payment"
                             ↓
                       Fill transaction details
                             ↓
                       PUT /api/fee-payments/:id/pay
                             ↓
                       Update status to PAID
                             ↓
                       Add transaction details
                             ↓
                       Return updated payment
                             ↓
                       Refresh details view
```

### 5. View Statistics
```
Frontend → GET /api/fee-payments/stats?studentId=xxx
         ↓
   Backend aggregates data
         ↓
   Calculate totals (paid, pending, overdue)
         ↓
   Return statistics object
         ↓
   Display in statistics cards
```

## Enums & Constants

### FeeType
```
HOSTEL_FEE
MESS_FEE
MAINTENANCE_FEE
SECURITY_DEPOSIT
CAUTION_DEPOSIT
OTHER
```

### PaymentStatus
```
PENDING (default)
PAID
OVERDUE
PARTIALLY_PAID
WAIVED
```

### PaymentMethod
```
CASH
CARD
UPI
NET_BANKING
CHEQUE
DEMAND_DRAFT
```

## Role-Based Access Control

```
┌──────────────┬─────────────┬──────────────┬──────────────┐
│   Feature    │   Student   │   Warden     │    Admin     │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ View Own     │     ✅      │      ✅      │      ✅      │
│ Payments     │             │              │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ View All     │     ❌      │      ✅      │      ✅      │
│ Payments     │             │              │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Create       │     ❌      │      ✅      │      ✅      │
│ Payment      │             │              │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Mark as      │     ❌      │      ✅      │      ✅      │
│ Paid         │             │              │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Update       │     ❌      │      ✅      │      ✅      │
│ Status       │             │              │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Delete       │     ❌      │      ✅      │      ✅      │
│ Payment      │             │              │              │
└──────────────┴─────────────┴──────────────┴──────────────┘
```

## Component Hierarchy

```
App
└── DashboardLayout
    ├── Navbar
    ├── Sidebar
    │   └── Fee Payments Link
    └── Main Content
        ├── StudentDashboard
        │   ├── Pending Fees Card
        │   └── Quick Action Button
        │
        └── Fee Payments Pages
            ├── FeePaymentsPage
            │   ├── Statistics Cards
            │   ├── Filter Controls
            │   └── Payments Table
            │
            ├── NewFeePaymentPage
            │   └── Payment Form
            │
            └── FeePaymentDetailsPage
                ├── Payment Info
                └── Mark as Paid Form
```

## API Response Formats

### List Payments Response
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "studentId": "...",
      "studentName": "John Doe",
      "studentEmail": "john@example.com",
      "roomNumber": "101",
      "feeType": "HOSTEL_FEE",
      "amount": 5000,
      "dueDate": "2024-12-31T00:00:00.000Z",
      "paidDate": null,
      "status": "PENDING",
      "transactionId": null,
      "paymentMethod": null,
      "semester": "Spring",
      "academicYear": "2024",
      "remarks": null,
      "createdAt": "2024-12-04T00:00:00.000Z",
      "updatedAt": "2024-12-04T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Statistics Response
```json
{
  "success": true,
  "data": {
    "totalPaid": 25,
    "totalPending": 15,
    "totalOverdue": 5,
    "totalAmount": 150000,
    "paidAmount": 100000,
    "pendingAmount": 50000
  }
}
```

## File Structure

```
HostelEase/
├── backend/
│   ├── routes/
│   │   ├── feePayments.js          ← New
│   │   └── auth.js                 ← Modified
│   ├── prisma/
│   │   └── schema.prisma           ← Modified
│   ├── seed-fee-payments.js        ← New
│   └── server.js                   ← Modified
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── fee-payments/       ← New
│   │   │       ├── page.js
│   │   │       ├── new/
│   │   │       │   └── page.js
│   │   │       └── [id]/
│   │   │           └── page.js
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   └── StudentDashboard.jsx  ← Modified
│   │   │   └── layout/
│   │   │       └── Sidebar.jsx           ← Modified
│   │   ├── constants/
│   │   │   ├── routes.js           ← Modified
│   │   │   └── apiEndpoints.js     ← Modified
│   │   └── lib/
│   │       └── validators.js       ← Modified
│
└── Documentation/
    ├── FEE_PAYMENTS_IMPLEMENTATION.md    ← New
    ├── FEE_PAYMENTS_QUICK_START.md       ← New
    ├── FEE_PAYMENTS_SUMMARY.md           ← New
    ├── FEE_PAYMENTS_CHECKLIST.md         ← New
    └── FEE_PAYMENTS_ARCHITECTURE.md      ← New (This file)
```

## Technology Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **ORM**: Prisma
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React
- **Authentication**: JWT
- **API**: RESTful

## Security Considerations

1. **Authentication**: JWT tokens required for all endpoints
2. **Authorization**: Role-based access control
3. **Data Isolation**: Students can only access their own data
4. **Input Validation**: Both frontend and backend validation
5. **Cascade Delete**: Maintains data integrity
6. **Transaction IDs**: Required for payment confirmation

---

**Architecture Version**: 1.0
**Last Updated**: December 4, 2024
