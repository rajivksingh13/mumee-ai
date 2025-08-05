# Live Session Implementation Guide

## Overview

The live session system allows workshops to be scheduled as live sessions with specific dates, times, and meeting links. When a workshop is configured as a live session, enrolled users will see a "Join Live Session" button instead of "Continue Learning".

## How It Works

### 1. Workshop Interface Updates

The `Workshop` interface in `databaseService.ts` has been extended with live session properties:

```typescript
export interface Workshop {
  // ... existing properties ...
  
  // Live session properties
  isLiveSession?: boolean;
  scheduledDate?: string; // ISO date string
  scheduledTime?: string; // HH:MM format
  timezone?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  sessionDuration?: number; // in minutes
  maxParticipants?: number;
}
```

### 2. Component Updates

All three workshop components (`BeginnerWorkshop.tsx`, `FoundationWorkshop.tsx`, `AdvanceWorkshop.tsx`) now include conditional logic:

```typescript
{workshop?.isLiveSession && workshop?.scheduledDate ? (
  <button 
    onClick={() => {
      if (workshop?.meetingLink) {
        window.open(workshop.meetingLink, '_blank');
      } else {
        // Fallback: show meeting details
        alert(`Live Session Details:\nDate: ${workshop.scheduledDate}\nTime: ${workshop.scheduledTime}\nTimezone: ${workshop.timezone || 'IST'}`);
      }
    }}
    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center"
  >
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    Join Live Session
  </button>
) : (
  <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
    Continue Learning
  </button>
)}
```

### 3. Button Behavior

- **If workshop is live session AND has scheduled date**: Shows "Join Live Session" button
- **If not live session**: Shows "Continue Learning" button

### 4. Click Actions

When users click "Join Live Session":
- **If meetingLink exists**: Opens the meeting link in a new tab
- **If no meetingLink**: Shows an alert with session details (date, time, timezone)

## Current Workshop Configuration

All three workshops have been updated with live session data:

### Beginner Workshop
- **Date**: January 20, 2024
- **Time**: 14:00 IST
- **Duration**: 120 minutes
- **Max Participants**: 50
- **Meeting Link**: https://zoom.us/j/123456789

### Foundation Workshop
- **Date**: January 25, 2024
- **Time**: 15:00 IST
- **Duration**: 180 minutes
- **Max Participants**: 30
- **Meeting Link**: https://zoom.us/j/987654321

### Advanced Workshop
- **Date**: January 30, 2024
- **Time**: 16:00 IST
- **Duration**: 240 minutes
- **Max Participants**: 20
- **Meeting Link**: https://zoom.us/j/555666777

## Testing the Implementation

1. **Enroll in any workshop** (Beginner, Foundation, or Advanced)
2. **Navigate to the workshop page** after enrollment
3. **Look for the "Join Live Session" button** in the "Already Enrolled" card
4. **Click the button** to either:
   - Open the meeting link directly (if configured)
   - See session details in an alert (if no meeting link)

## Updating Workshop Live Session Data

To update workshop live session properties, use the script:

```bash
node scripts/update-workshops-live-session.js
```

Or manually update in Firestore:

```javascript
// Example: Update a workshop to be a live session
await updateDoc(doc(db, 'workshops', 'workshop-id'), {
  isLiveSession: true,
  scheduledDate: '2024-02-15',
  scheduledTime: '14:00',
  timezone: 'Asia/Kolkata',
  meetingLink: 'https://zoom.us/j/your-meeting-id',
  meetingId: 'your-meeting-id',
  meetingPassword: 'your-password',
  sessionDuration: 120,
  maxParticipants: 50
});
```

## Future Enhancements

1. **Real-time session status**: Show if session is live, starting soon, or ended
2. **Attendance tracking**: Track who joined the live session
3. **Session reminders**: Send email reminders before live sessions
4. **Session recording**: Store and provide access to session recordings
5. **Interactive features**: Chat, polls, and Q&A during live sessions

## Troubleshooting

### Issue: Still seeing "Continue Learning" button
**Solution**: Check if the workshop has `isLiveSession: true` and `scheduledDate` set in Firestore.

### Issue: Meeting link not opening
**Solution**: Verify the `meetingLink` property is correctly set in the workshop data.

### Issue: No session details shown
**Solution**: Ensure `scheduledDate`, `scheduledTime`, and `timezone` are properly configured. 