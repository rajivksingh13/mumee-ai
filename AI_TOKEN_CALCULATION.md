# AI Token Calculation System

## Overview

The AI Token system in titliAI is a dynamic reward mechanism that calculates tokens based on user activity and learning progress. Tokens are calculated in real-time from user enrollment data stored in Firestore, rather than being stored as a static value.

## 🔍 How AI Tokens are Calculated

### Calculation Formula

```typescript
AI Tokens = Base Tokens + Enrollment Bonus + Completion Bonus
```

### Token Breakdown

| Activity | Tokens Awarded | Description |
|----------|----------------|-------------|
| **Base Tokens** | 10 | Every user starts with 10 tokens |
| **Enrollment Bonus** | 5 per enrollment | Awarded for each workshop enrollment |
| **Completion Bonus** | 10 per completion | Awarded for each completed workshop |

### Implementation Code

```typescript
private calculateAITokens(enrollments: any[]): number {
  // Mock calculation based on enrollments and activity
  const baseTokens = 10;  // Every user starts with 10 tokens
  const enrollmentBonus = enrollments.length * 5;  // 5 tokens per enrollment
  const completedBonus = enrollments.filter(e => e.status === 'completed').length * 10;  // 10 tokens per completed workshop
  
  return baseTokens + enrollmentBonus + completedBonus;
}
```

## 📊 Examples

### Example 1: New User (TestRajiv)
**Scenario**: User just signed up, no enrollments yet

```
Base Tokens: 10
Enrollment Bonus: 0 (no enrollments)
Completion Bonus: 0 (no completions)
Total AI Tokens: 10
```

### Example 2: Active Learner
**Scenario**: User has enrolled in 3 workshops, completed 1

```
Base Tokens: 10
Enrollment Bonus: 3 × 5 = 15
Completion Bonus: 1 × 10 = 10
Total AI Tokens: 35
```

### Example 3: Advanced User
**Scenario**: User has enrolled in 5 workshops, completed 3

```
Base Tokens: 10
Enrollment Bonus: 5 × 5 = 25
Completion Bonus: 3 × 10 = 30
Total AI Tokens: 65
```

### Example 4: TestRajiv's Case (25 Tokens)
Based on the dashboard showing 25 AI Tokens, possible scenarios:

**Scenario A**: 2 enrollments, 1 completion
```
Base Tokens: 10
Enrollment Bonus: 2 × 5 = 10
Completion Bonus: 1 × 10 = 10
Total AI Tokens: 30
```

**Scenario B**: 3 enrollments, 0 completions
```
Base Tokens: 10
Enrollment Bonus: 3 × 5 = 15
Completion Bonus: 0 × 10 = 0
Total AI Tokens: 25 ✅
```

## 🗄️ Firestore Data Structure

### Collections Used

#### 1. `users` Collection
```typescript
interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  // ... other user fields
  stats?: {
    totalEnrollments: number;
    completedWorkshops: number;
    certificatesEarned: number;
    totalSpent: number;
    preferredCurrency: string;
  };
}
```

#### 2. `enrollments` Collection
```typescript
interface Enrollment {
  id: string;
  userId: string;
  workshopId: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  enrolledAt: Timestamp;
  completedAt?: Timestamp;
  progress: {
    currentModule: number;
    completedModules: number[];
    totalModules: number;
    percentageComplete: number;
    lastAccessed: Timestamp;
  };
  certificate?: {
    issued: boolean;
    certificateId?: string;
    issuedAt?: Timestamp;
  };
}
```

## 🔄 Data Flow

### 1. User Visits Account Page
```typescript
// AccountPage.tsx
const loadAccountData = async () => {
  const data = await accountService.getAccountData(user.uid);
  setAccountData(data);
};
```

### 2. Account Service Fetches Data
```typescript
// accountService.ts
async getAccountData(userId: string): Promise<AccountData> {
  const db = await getDatabaseService();
  const user = await db.getUser(userId);
  const enrollments = await db.getUserEnrollments(userId);
  const payments = await this.getUserPayments(userId);
  
  const stats = this.calculateStats(enrollments, payments, user);
  // ...
}
```

### 3. Calculate Statistics
```typescript
private calculateStats(enrollments: any[], payments: Payment[], user: any): AccountStats {
  const totalEnrollments = enrollments.length;
  const completedWorkshops = enrollments.filter(e => e.status === 'completed').length;
  const certificatesEarned = enrollments.filter(e => e.certificate?.issued).length;
  const aiTokens = this.calculateAITokens(enrollments);
  
  return {
    totalEnrollments,
    completedWorkshops,
    certificatesEarned,
    totalSpent,
    aiTokens,
    preferredCurrency
  };
}
```

### 4. Display in UI
```typescript
// AccountPage.tsx
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">AI Tokens</p>
      <p className="text-2xl font-bold text-gray-900">{accountData.stats.aiTokens}</p>
    </div>
    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
      </svg>
    </div>
  </div>
</div>
```

## ⚡ Benefits of Dynamic Calculation

### 1. Real-time Accuracy
- Tokens always reflect current user activity
- No stale data or synchronization issues
- Immediate updates when enrollments change

### 2. No Data Redundancy
- No need to store token count separately
- Single source of truth (enrollment data)
- Reduced storage costs and complexity

### 3. Flexible Rules
- Easy to modify token calculation rules
- Can add new bonus types (e.g., streak bonuses)
- Can implement time-based rewards

### 4. Consistent Data
- Tokens always match actual user activity
- No discrepancies between stored and calculated values
- Audit trail through enrollment history

## 🔧 Implementation Details

### Files Involved

1. **`src/services/accountService.ts`**
   - Main calculation logic
   - Data fetching from Firestore
   - Statistics computation

2. **`src/components/AccountPage.tsx`**
   - UI display of AI Tokens
   - Dashboard integration

3. **`src/services/databaseService.ts`**
   - Firestore data structure
   - User and enrollment interfaces

### Error Handling

```typescript
// Fallback for database errors
private getDefaultStats(): AccountStats {
  return {
    totalEnrollments: 0,
    completedWorkshops: 0,
    certificatesEarned: 0,
    totalSpent: 0,
    aiTokens: 0,  // Default to 0 tokens
    preferredCurrency: 'INR'
  };
}
```

## 🚀 Future Enhancements

### Potential Improvements

1. **Time-based Bonuses**
   ```typescript
   // Weekly login bonus
   const weeklyLoginBonus = hasLoggedInThisWeek ? 5 : 0;
   ```

2. **Streak Rewards**
   ```typescript
   // Consecutive days bonus
   const streakBonus = consecutiveDays * 2;
   ```

3. **Workshop-specific Bonuses**
   ```typescript
   // Advanced workshop completion bonus
   const advancedBonus = completedAdvancedWorkshops * 15;
   ```

4. **Referral Rewards**
   ```typescript
   // Referral bonus
   const referralBonus = referredUsers * 20;
   ```

### Token Usage Ideas

1. **Workshop Discounts**: Use tokens for workshop discounts
2. **Premium Features**: Unlock advanced features with tokens
3. **Certificate Upgrades**: Upgrade to premium certificates
4. **Priority Support**: Get priority customer support

## 📈 Monitoring and Analytics

### Key Metrics to Track

1. **Token Distribution**
   - Average tokens per user
   - Token earning rates
   - Completion vs enrollment ratios

2. **User Engagement**
   - Correlation between tokens and engagement
   - Token earning patterns
   - User retention with token system

3. **System Performance**
   - Calculation time for large user bases
   - Database query optimization
   - Cache strategies for frequent calculations

## 🔒 Security Considerations

### Data Integrity

1. **Enrollment Validation**: Ensure enrollment status is accurate
2. **Completion Verification**: Verify workshop completion criteria
3. **Audit Logging**: Log token calculations for transparency

### Anti-Gaming Measures

1. **Rate Limiting**: Prevent rapid enrollment/completion cycles
2. **Validation Rules**: Ensure legitimate workshop progress
3. **Fraud Detection**: Monitor unusual token earning patterns

## 📝 Summary

The AI Token system in titliAI is a sophisticated reward mechanism that:

- ✅ **Calculates tokens dynamically** from user activity
- ✅ **Uses Firestore enrollment data** as the source of truth
- ✅ **Provides real-time accuracy** without data redundancy
- ✅ **Offers flexible calculation rules** for future enhancements
- ✅ **Maintains data consistency** across the platform

The system successfully balances simplicity with flexibility, providing users with immediate feedback on their learning progress while maintaining a scalable and maintainable codebase. 