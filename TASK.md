# Property Listing Flow - Coding Challenge

## Welcome!

Thank you for taking the time to complete this coding challenge. This exercise is designed to assess your ability to:

- Navigate and understand an existing codebase
- Implement secure API routes with proper authentication
- Build React components following established patterns
- Manage state across a multi-step flow
- Write clean, maintainable code

**Time Estimate:** 2-3 hours

**Deadline:** Please submit before or on Friday

---

## Context

You're joining a team building a property listing platform. Users create property listings through a multi-step flow:

1. **Step 1: Select Property** (✅ Complete - reference implementation)
2. **Step 2: Confirm Details** (❌ Your task - implement this)
3. **Step 3: Submit** (not part of this challenge)

Your task is to implement Step 2, where users review and confirm their property details.

---

## Getting Started

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev

# Open browser
http://localhost:3032/listing-flow/step-1
```

### What's Already Built

**Complete Reference Implementation:**

- `src/sections/listing-flow/step-1-property-selection-view.jsx` - Study this thoroughly
- `src/app/api/listing/properties/route.js` - Complete API route with auth
- `src/app/api/progress/route.js` - GET endpoint is complete

**Components You Can Use:**

- `RHFTextField` - Form text input
- `RHFSelect` - Form dropdown
- `CustomBreadcrumbs` - Page breadcrumbs
- All Material-UI components

**Mock Data:**

- Supabase is mocked (no real database needed)
- Mock user is always authenticated
- Mock properties are available

---

## Your Task: Implement Step 2

### Part 1: Backend - Complete the PUT Endpoint (45 minutes)

**File:** `src/app/api/progress/route.js`

**Requirements:**

1. **Authentication** (CRITICAL)

   - Extract Bearer token from Authorization header
   - Verify token with `supabase.auth.getUser(token)`
   - Use verified `userId` (NEVER trust userId from request body)
   - Return 401 if unauthorized

2. **Request Validation**

   - Expect: `{ currentStep: string, progressData: object }`
   - Validate both fields are present
   - Return 400 if validation fails

3. **Database Update**

   - Update `listing_progress` table
   - Set `current_step` to the provided step
   - Merge new data into `progress_data` JSON column
   - Only update the authenticated user's record

4. **Response Format**

   ```json
   {
     "success": true,
     "progress": {
       "id": "progress-123",
       "user_id": "test-user-123",
       "current_step": "step-2",
       "progress_data": { ... },
       "updated_at": "2025-10-31T..."
     }
   }
   ```

5. **Error Handling**

   - Handle all errors gracefully
   - Return appropriate status codes (401, 400, 500)
   - Log errors for debugging

**Security Checklist:**

- [ ] Verify authentication token
- [ ] Use userId from token, NOT request body
- [ ] Validate request body structure
- [ ] Handle errors without exposing sensitive data

**Reference:** Study `src/app/api/listing/properties/route.js` for the auth pattern.

---

### Part 2: Frontend - Build Step 2 Component (60-90 minutes)

**File:** `src/sections/listing-flow/step-2-confirmation-view.jsx`

**Requirements:**

1. **Fetch Progress Data**

   - On component mount, fetch from `GET /api/progress`
   - Extract Step 1 data: `progress.progress_data.step1`
   - Handle loading and error states

2. **Display Property Details**

   - Show property address (read-only)
   - Show bedrooms (read-only)
   - Show bathrooms (read-only)
   - Show estimated value (read-only, formatted as currency)

3. **Editable Square Footage**

   - Use `RHFTextField` for sqft input
   - Pre-fill with value from Step 1
   - Validate: must be a positive number
   - Validate: reasonable range (500 - 10,000)

4. **Form Handling**

   - Use React Hook Form with Zod validation
   - Validate on submit
   - Show validation errors

5. **Save Progress**

   - On submit, call `PUT /api/progress` with:

     ```javascript
     {
       currentStep: 'step-2',
       progressData: {
         ...existingProgressData,
         completedSteps: ['step-1', 'step-2'],
         step2: {
           confirmedSqft: [user input],
           confirmedBedrooms: [from step1],
           confirmedBathrooms: [from step1],
         }
       }
     }
     ```

   - Handle success and error responses

6. **Navigation**

   - "Back" button → `/listing-flow/step-1`
   - "Continue" button → Submit form, then navigate to success page or `/listing-flow/step-3`
   - Disable buttons while submitting

7. **UI/UX Requirements**

   - Match the style of Step 1
   - Use `CustomBreadcrumbs` component
   - Show loading spinner while fetching
   - Show error alerts clearly
   - Disable form during submission
   - Clear button labels

**Reference:** Study `step-1-property-selection-view.jsx` for patterns.

**Validation Schema Example:**

```javascript
const Step2Schema = z.object({
  sqft: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(500, 'Must be at least 500 sqft')
    .max(10000, 'Must be less than 10,000 sqft'),
});
```

---

### Part 3: Documentation (15 minutes)

**File:** `SOLUTION.md`

Please provide brief answers to:

1. **Your Approach**
   - How did you implement the solution?
   - What key decisions did you make?

2. **Testing Strategy**
   - How would you test this feature?
   - What edge cases did you consider?

3. **Production Considerations**
   - What would you do differently for production?
   - Any security concerns to address?

---

## Deliverables

Submit before or on Friday:

### Required

1. **Modified Files:**

   - `src/app/api/progress/route.js` (PUT endpoint implemented)
   - `src/sections/listing-flow/step-2-confirmation-view.jsx` (complete component)
   - `SOLUTION.md` (answers to questions)

2. **How to Submit:**

   - Zip the project folder (remove `node_modules` and `.next` folders first to reduce size)
   - Email the zip file to: michaelgolshani@gmail.com

### Optional (Bonus Points)

3. **Loom Video** (5-10 minutes)

   - Walk through your code
   - Explain key decisions
   - Show it running (if you got it working)
   - Demo the full flow: Step 1 → Step 2 → Save

---

## Evaluation Criteria

We will assess:

### Code Quality (30%)

- Clean, readable code
- Follows existing patterns
- Good variable/function naming
- Appropriate comments
- Consistent formatting

### Security (25%)

- Proper authentication in API route
- Uses userId from token, not request
- Input validation
- Error handling
- No vulnerabilities

### Functionality (20%)

- API endpoint works correctly
- Component fetches and displays data
- Form validation works
- Progress is saved correctly
- Navigation flows properly

### Architecture (15%)

- Good state management
- Appropriate use of hooks
- Proper error handling
- Scalable approach

### Communication (10%)

- Clear documentation in SOLUTION.md
- Code comments where helpful
- Explains decisions and trade-offs

**Passing Score: 65/100**

---

## Important Notes

### AI Tools Policy

- **AI tools are allowed and encouraged!** We embrace modern development practices.
- Feel free to use ChatGPT, GitHub Copilot, or any AI assistant.
- However, we will analyze your code for proper implementation and understanding.
- Be prepared to explain your code and decisions in a follow-up discussion.
- The key is demonstrating good judgment in how you use these tools.

### Mock Mode

- This challenge uses a **mock Supabase client**
- No real database setup needed
- All data is simulated
- Focus on code patterns, not database configuration

### Authentication

- The mock always returns an authenticated user
- But you still need to implement the auth pattern correctly
- Treat it as if it were production code

### Getting Stuck?

- Study the Step 1 reference implementation
- Check console logs (the mock client logs all "queries")
- Read the comments in the code
- Make assumptions and document them in SOLUTION.md
- Focus on code quality over perfection

### Don't Worry About

- ❌ Styling perfection (basic MUI components are fine)
- ❌ Mobile responsiveness (desktop is fine)
- ❌ Step 3 implementation (out of scope)
- ❌ Advanced features (keep it simple)
- ❌ Real database setup (it's mocked)

### Do Focus On

- ✅ Security patterns (auth verification)
- ✅ Code quality and readability
- ✅ Following existing patterns
- ✅ Error handling
- ✅ Clear communication

---

## Questions?

**Need help?** Just like in a real work environment, feel free to reach out!

- Email me at: michaelgolshani@gmail.com
- I'm happy to clarify requirements or help if you get stuck
- Document any assumptions you make in SOLUTION.md

---

## Tips for Success

1. **Read Step 1 Carefully** - It's your blueprint
2. **Test as You Go** - Use console.logs liberally
3. **Start with the API** - Get the backend working first
4. **Then Build the UI** - Frontend can't work without the API
5. **Handle Errors** - Show us you think about edge cases
6. **Document Decisions** - Explain your thinking in SOLUTION.md
7. **Keep It Simple** - Working > fancy

---

Good luck! We're excited to see your work. 🚀

**Reminder:** This is a learning assessment, not a test of perfection. We want to see how you think, problem-solve, and communicate.
