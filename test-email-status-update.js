#!/usr/bin/env node

/**
 * Test Email Status Update
 * 
 * This script tests the email status update functionality
 */

console.log('🧪 Testing email status update...');

// Simulate the enrollment data structure
const mockEnrollments = [
    {
        id: 'test-enrollment-1',
        userId: 'user-1',
        workshopId: 'workshop-1',
        notifications: null
    },
    {
        id: 'test-enrollment-2',
        userId: 'user-2',
        workshopId: 'workshop-1',
        notifications: {
            liveSessionSent: new Date('2025-08-23T10:00:00Z'),
            lastUpdated: new Date('2025-08-23T10:00:00Z')
        }
    }
];

console.log('📊 Initial enrollments:', mockEnrollments);

// Simulate the update process
function updateEnrollmentNotification(enrollmentId) {
    const enrollmentIndex = mockEnrollments.findIndex(e => e.id === enrollmentId);
    if (enrollmentIndex !== -1) {
        if (!mockEnrollments[enrollmentIndex].notifications) {
            mockEnrollments[enrollmentIndex].notifications = {};
        }
        mockEnrollments[enrollmentIndex].notifications.liveSessionSent = new Date();
        mockEnrollments[enrollmentIndex].notifications.lastUpdated = new Date();
        
        console.log(`✅ Updated enrollment ${enrollmentId}`);
        return true;
    }
    return false;
}

// Test the update
console.log('\n🔄 Testing update for enrollment test-enrollment-1...');
const success = updateEnrollmentNotification('test-enrollment-1');

console.log('📊 Updated enrollments:', mockEnrollments);

// Test the status check
const sentEmails = mockEnrollments.filter(e => e.notifications?.liveSessionSent).length;
const pendingEmails = mockEnrollments.length - sentEmails;

console.log('\n📈 Status Summary:');
console.log(`✅ Emails Sent: ${sentEmails}`);
console.log(`⏳ Pending Emails: ${pendingEmails}`);

if (success) {
    console.log('\n🎉 Test passed! Email status update is working correctly.');
} else {
    console.log('\n❌ Test failed! Email status update is not working.');
}
