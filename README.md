# DownDating - Dating Service Platform

A modern dating service platform built with Next.js 14, featuring cart functionality, Razorpay payment integration, Google Forms delivery, and automated invoicing system.

## Features

- 🛒 **Shopping Cart**: Add/remove dating plans with quantity management
- 💳 **Payment Processing**: Secure payments via Razorpay integration
- 📧 **Automated Invoicing**: SendGrid-powered invoice generation and email delivery
- 📋 **Google Forms Integration**: Automatic delivery of user profile forms after payment
- 🎨 **Modern UI**: Dark/light theme support with Tailwind CSS
- 📱 **Responsive Design**: Mobile-first approach with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay
- **Email**: SendGrid
- **Forms**: Google Forms
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Razorpay account
- SendGrid account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd downdating-web
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Set up the database:
```bash
# Run the database setup scripts in order
# 1. Create database tables
# 2. Run migrations for invoices table
```

6. Run the development server:
```bash
pnpm dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=your_supabase_database_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SendGrid Email Service (for invoices)
SENDGRID_API_KEY=your_sendgrid_api_key

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Setup

Run the following SQL scripts in your Supabase dashboard:

1. `scripts/create-database.sql` - Creates basic tables
2. `scripts/create-payments-table.sql` - Creates payments table
3. `scripts/update-database.sql` - Updates existing tables
4. `scripts/update-plan-applications-table.sql` - Updates plan applications table
5. `scripts/migration_create_invoices_table.sql` - Creates invoices table

## Invoicing System

The platform includes a comprehensive invoicing system that automatically:

### Features
- **Automatic Invoice Generation**: Creates invoices immediately after successful payment
- **Unique Invoice Numbers**: Format: `INV-YYYYMM-XXXX` (e.g., `INV-202501-0001`)
- **Email Delivery**: Sends professional HTML invoices via SendGrid
- **Invoice Management**: Users can view, download, and re-request invoices
- **Database Storage**: All invoice data stored securely in Supabase

### Invoice Flow
1. User completes payment via Razorpay
2. Payment verification triggers invoice creation
3. Invoice number is generated and stored
4. Professional HTML invoice is sent via SendGrid
5. User can access invoices via "My Invoices" page

### API Endpoints

#### Send Invoice
```
POST /api/send-invoice
```
Sends an invoice email via SendGrid.

**Request Body:**
```json
{
  "invoiceNumber": "INV-202501-0001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+91-9876543210",
  "planName": "Premium Dating Plan",
  "planPrice": 999,
  "quantity": 1,
  "totalAmount": 999,
  "paymentId": "pay_ABC123",
  "orderId": "order_DEF456",
  "purchaseDate": "2025-01-22T10:30:00Z"
}
```

#### Get Invoices
```
POST /api/get-invoices
```
Retrieves all invoices for a customer email.

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

#### Download Invoice
```
GET /api/download-invoice/[invoiceNumber]
```
Downloads an invoice as HTML file.

### Invoice Template

Invoices include:
- Company branding and logo
- Customer billing information
- Detailed item breakdown
- Payment information
- Professional styling
- Mobile-responsive design

## Payment Flow

1. User adds plans to cart
2. User enters billing information
3. Razorpay processes payment
4. Invoice is automatically generated and emailed
5. User receives Google Forms for profile completion
6. Success page displays order confirmation

## Google Forms Integration

After successful payment:
1. System fetches appropriate Google Form URLs based on purchased plans
2. Forms are delivered via email and displayed on success page
3. Users can access forms directly or through email links

## Refund Policy

Refunds are only provided if customers haven't received their Google Forms. The policy is clearly stated on the `/refund-policy` page.

## Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Environment Setup for Production

Ensure all environment variables are set in your deployment platform (Vercel, Netlify, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to DownDating.

## Support

For support, contact the development team or create an issue in the repository.