# Quick Start Guide - Projects Module (Comprehensive Form)

## Overview
The Projects module has been completely redesigned with a comprehensive two-section form for managing client information and project details.

---

## How to Use

### 1. Opening the Form

**Navigate to**: Projects page → Click "Create Project" button

**Result**: A drawer opens from the right side with two accordion sections

---

## 2. Form Sections

### Section 1: CLIENT INFORMATION
**Status**: Expandable accordion (default: OPEN)

**Fields to Fill**:
1. **Client Name** ⭐ (Required)
   - Type: Text
   - Example: "John Doe"

2. **Client Mobile Number** ⭐ (Required)
   - Type: Phone (Indian format)
   - Format: 10-digit, starts with 6-9
   - Example: "9876543210"
   - ❌ Invalid: "1234567890", "98765432"

3. **Client Email** (Optional)
   - Type: Email
   - Example: "john@example.com"

4. **Inquiry Date** (Auto-filled)
   - Type: Date
   - Default: Today's date
   - Editable: Yes

5. **Company Name** ⭐ (Required)
   - Type: Text
   - Example: "Tech Solutions Ltd"

6. **Company Location** (Optional)
   - Type: Text
   - Example: "Mumbai, India"

7. **Business Type** ⭐ (Required)
   - Type: Dropdown
   - Options:
     - Startup
     - Large Corporate
     - MSME
     - Retail / E-commerce
     - Manufacturing / Production

8. **Your Services** (Optional)
   - Type: Textarea
   - Example: "Web development, mobile apps, consulting"

9. **How old are you in business?** (Optional)
   - Type: Number (Years)
   - Example: "5"

10. **Sales or Marketing Team?** (Optional)
    - Type: Yes/No buttons
    - Click to toggle

11. **Social Media Profiles?** (Optional)
    - Type: Yes/No buttons
    - If YES → Shows 4 URL fields:
      - Instagram URL
      - Facebook URL
      - LinkedIn URL
      - Other URL
    - If NO → Hides URL fields

12. **Annual Turnover** (Optional)
    - Type: Dropdown
    - Options:
      - <50K
      - 50K–10 Lakh
      - 10–50 Lakh
      - 50 Lakh+

13. **Current Google Ranking** (Optional)
    - Type: Dropdown
    - Options:
      - Not Listed
      - Page 2+
      - Page 1

14. **Checkboxes** (Optional)
    - Google Business Profile
    - Client Domain
    - Client Logo
    - Client Content Available

15. **Features** (Optional)
    - Type: Multi-select dropdown
    - Options:
      - Whatsapp Integration
      - Payment Integration
      - Custom
    - If "Custom" selected → Shows text input for custom features

---

### Section 2: PROJECT DETAILS
**Status**: Expandable accordion (default: CLOSED)

**Fields to Fill**:

1. **Branch** (Optional)
   - Type: Dropdown
   - Options:
     - Kutch Infoline
     - Lakshmi Healthcare Services
     - OptiMatrix
     - OptiMatrix Cash
     - OptiMatrix Domestic
     - OptiMatrix Export

2. **Project ID** (Auto-generated)
   - Type: Read-only text
   - Format: PF-YYYY-XXXX
   - Example: "PF-2026-1001"
   - ℹ️ Auto-generated on creation

3. **Project Name** ⭐ (Required)
   - Type: Text
   - Example: "E-commerce Website Redesign"

4. **Project Category** ⭐ (Required)
   - Type: Dynamic dropdown
   - Source: Fetched from Scope API
   - Examples:
     - Website Development
     - Mobile App Development
     - Software Development
     - Core PHP/Laravel
     - SEO
     - Digital Marketing

5. **Scope of Work** ⭐ (Required)
   - Type: Multi-select dropdown
   - Behavior: Populates based on selected category
   - Examples (for Website Development):
     - Frontend Architecture
     - Backend APIs
     - State & Database
     - Admin Dashboard
     - Theme Setup
     - E-commerce Setup
     - Content Management
     - Plugin Integration

6. **Project Cost** (Auto-calculated)
   - Type: Read-only
   - Display: INR formatted (₹1,00,000)
   - Formula: Sum of selected scope item prices
   - Updates: Real-time as scope items selected

7. **Timeline** (Required)
   - Type: Number + Unit dropdown
   - Units: Days, Weeks, Months
   - Example: "3" + "Months"
   - ℹ️ Used to calculate end date

8. **Project End Date** (Auto-calculated)
   - Type: Read-only date
   - Formula: Current Date + Timeline
   - Example: If today is May 21 and timeline is 3 Months → Aug 21
   - Updates: Real-time as timeline changes

9. **Number of Pages** (Optional)
   - Type: Number
   - Example: "25"

10. **Project Details** (Optional)
    - Type: Textarea
    - Example: "Redesign existing e-commerce platform with new UI/UX"

11. **Technologies** (Optional)
    - Type: Multi-select dropdowns (by category)
    - Categories:
      - Frontend Technologies
      - Backend Technologies
      - Database Technologies
      - Tools / Other
    - Behavior: Populates based on selected project category
    - Examples (for Website Development):
      - Frontend: React JS, Next JS, Vue JS, Angular, Svelte
      - Backend: Node JS, Laravel, Express, Django, FastAPI
      - Database: MongoDB, MySQL, PostgreSQL, Firebase
      - Other: Webpack, Vite, Docker, AWS

12. **Status** (Optional)
    - Type: Dropdown
    - Options:
      - Active
      - Completed
      - On Hold
      - Cancelled

---

## 3. Form Validation

### Required Fields (Must Fill):
- ⭐ Client Name
- ⭐ Client Mobile Number (Indian format)
- ⭐ Company Name
- ⭐ Project Name
- ⭐ Project Category
- ⭐ Scope of Work (at least 1 item)
- ⭐ Timeline

### Validation Rules:
- **Mobile Number**: Must be 10 digits, starts with 6-9
- **Email**: Must be valid email format
- **URLs**: Must be valid URLs (for social media)
- **Numbers**: Cannot be negative
- **Scope Items**: Must select at least 1 item

### Error Display:
- Red border around invalid field
- Error message below field
- Toast notification on submit with first error

---

## 4. Auto-Calculated Fields

### Project Cost
- **Updates**: Real-time as you select/deselect scope items
- **Display**: ₹1,00,000 (INR formatted)
- **Example**:
  - Select "Frontend Architecture" (₹15,000)
  - Select "Backend APIs" (₹18,000)
  - Total: ₹33,000

### Project End Date
- **Updates**: Real-time as you change timeline
- **Calculation**:
  - Days: Direct addition
  - Weeks: value × 7 days
  - Months: value × 30 days
- **Example**:
  - Today: May 21, 2026
  - Timeline: 3 Months
  - End Date: Aug 20, 2026

---

## 5. Dynamic Dropdowns

### Category → Scope Items
1. Select "Website Development" in Project Category
2. Scope of Work dropdown automatically populates with:
   - Frontend Architecture
   - Backend APIs
   - State & Database
   - Admin Dashboard
   - Theme Setup
   - E-commerce Setup
   - Content Management
   - Plugin Integration

### Category → Technologies
1. Select "Website Development" in Project Category
2. Technology dropdowns automatically populate with:
   - Frontend: React JS, Next JS, Vue JS, Angular, Svelte
   - Backend: Node JS, Laravel, Express, Django, FastAPI
   - Database: MongoDB, MySQL, PostgreSQL, Firebase
   - Other: Webpack, Vite, Docker, AWS

---

## 6. Conditional Fields

### Social Media Profiles
- **Trigger**: Click "Yes" in "Social Media Profiles?" section
- **Shows**: 4 URL input fields
- **Hide**: Click "No" to hide fields

### Custom Features
- **Trigger**: Select "Custom" in Features multi-select
- **Shows**: Text input for entering custom features
- **Hide**: Deselect "Custom" to hide input

---

## 7. Form Submission

### Steps:
1. Fill all required fields (marked with ⭐)
2. Verify validation errors are resolved
3. Click "Create" button (or "Update" if editing)
4. Wait for loading spinner to complete
5. See success toast notification

### On Success:
- Form closes
- Project added to table
- Page refreshes with new project

### On Error:
- Error toast notification shows
- Form remains open
- Fix errors and resubmit

---

## 8. Editing Existing Project

### Steps:
1. Go to Projects page
2. Click edit icon on project row
3. Form opens with existing data pre-filled
4. Modify fields as needed
5. Click "Update" button
6. See success notification

### Note:
- Project ID cannot be changed (read-only)
- All other fields can be modified

---

## 9. Tips & Tricks

### ✅ Best Practices:
1. Fill Client Information first (Section 1)
2. Then fill Project Details (Section 2)
3. Select category before selecting scope items
4. Watch cost update as you select scope items
5. Verify end date calculation is correct

### ⚠️ Common Issues:
- **Mobile validation fails**: Ensure 10 digits, starts with 6-9
- **Scope items not showing**: Select category first
- **Technologies not showing**: Select project category first
- **Cost not updating**: Ensure scope items are selected
- **End date not calculating**: Ensure timeline value is entered

### 💡 Shortcuts:
- Press Tab to move between fields
- Click accordion header to expand/collapse sections
- Click X on tag to remove from multi-select
- Click "Cancel" to discard changes

---

## 10. Field Reference

| Field | Type | Required | Auto-Fill | Validation |
|-------|------|----------|-----------|-----------|
| Client Name | Text | ✅ | ❌ | Required |
| Mobile Number | Phone | ✅ | ❌ | Indian format |
| Email | Email | ❌ | ❌ | Email format |
| Inquiry Date | Date | ❌ | ✅ | Date format |
| Company Name | Text | ✅ | ❌ | Required |
| Business Type | Dropdown | ✅ | ❌ | Required |
| Project Name | Text | ✅ | ❌ | Required |
| Category | Dropdown | ✅ | ❌ | Required |
| Scope Items | Multi-select | ✅ | ❌ | Min 1 item |
| Project Cost | Read-only | ❌ | ✅ | Auto-calc |
| Timeline | Number | ✅ | ❌ | Required |
| End Date | Read-only | ❌ | ✅ | Auto-calc |
| Status | Dropdown | ❌ | ❌ | Optional |

---

## 11. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Enter | Submit form (if focused on submit button) |
| Escape | Close form (if not in input) |

---

## 12. Responsive Design

### Mobile (< 600px):
- Single column layout
- Full-width inputs
- Stacked buttons
- Scrollable form

### Tablet (600px - 1024px):
- 2-column grid
- Optimized spacing
- Touch-friendly buttons

### Desktop (> 1024px):
- Full layout
- 2-3 column grids
- Optimal spacing

---

## 13. Dark Mode

The form automatically adapts to dark mode:
- Dark background
- Light text
- Adjusted colors for readability
- Smooth transitions

---

## 14. Troubleshooting

### Form won't submit:
1. Check all required fields (⭐) are filled
2. Look for red error messages
3. Verify mobile number format
4. Ensure at least 1 scope item selected

### Dropdown not showing options:
1. Refresh the page
2. Check internet connection
3. Verify API is running
4. Check browser console for errors

### Cost not calculating:
1. Ensure scope items are selected
2. Check if prices are set in scope items
3. Refresh page if issue persists

### End date not calculating:
1. Ensure timeline value is entered
2. Select timeline unit (Days/Weeks/Months)
3. Check if date is valid

---

## 15. Support

For issues or questions:
1. Check this guide first
2. Review validation error messages
3. Check browser console for errors
4. Contact development team

---

**Last Updated**: May 21, 2026
**Version**: 1.0
**Status**: ✅ Ready for Use
