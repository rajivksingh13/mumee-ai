import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Automatic cleanup when user is deleted from Firebase Auth
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  try {
    console.log(`🗑️ User deleted from Auth: ${user.uid}`);
    
    // Delete user profile
    await db.collection('users').doc(user.uid).delete();
    console.log(`✅ Deleted user profile: ${user.uid}`);
    
    // Delete user enrollments
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('userId', '==', user.uid)
      .get();
    
    const enrollmentDeletions = enrollmentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(enrollmentDeletions);
    console.log(`✅ Deleted ${enrollmentsSnapshot.size} enrollments`);
    
    // Delete user payments
    const paymentsSnapshot = await db.collection('payments')
      .where('userId', '==', user.uid)
      .get();
    
    const paymentDeletions = paymentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(paymentDeletions);
    console.log(`✅ Deleted ${paymentsSnapshot.size} payments`);
    
    console.log(`🎉 Complete cleanup finished for user: ${user.uid}`);
    
  } catch (error) {
    console.error(`❌ Error during automatic cleanup for user ${user.uid}:`, error);
    throw error;
  }
});

// Soft delete function (keeps data for audit)
export const onUserSoftDeleted = functions.auth.user().onDelete(async (user) => {
  try {
    console.log(`🔄 Soft deleting user: ${user.uid}`);
    
    // Mark user as deleted instead of deleting
    await db.collection('users').doc(user.uid).update({
      'profile.deletedAt': admin.firestore.FieldValue.serverTimestamp(),
      'profile.deleted': true
    });
    
    // Mark enrollments as cancelled
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('userId', '==', user.uid)
      .get();
    
    const enrollmentUpdates = enrollmentsSnapshot.docs.map(doc => 
      doc.ref.update({
        status: 'cancelled',
        cancelledAt: admin.firestore.FieldValue.serverTimestamp()
      })
    );
    await Promise.all(enrollmentUpdates);
    
    console.log(`✅ Soft delete completed for user: ${user.uid}`);
    
  } catch (error) {
    console.error(`❌ Error during soft delete for user ${user.uid}:`, error);
    throw error;
  }
});

export const sendEnrollmentNotification = functions.database
  .ref('/enrollments/{userId}/{courseId}')
  .onCreate(async (snapshot, context) => {
    try {
      const enrollment = snapshot.val();
      const { userId, courseId } = context.params;

      // Get user data
      const userSnapshot = await admin.database().ref(`/users/${userId}`).once('value');
      const userData = userSnapshot.val();

      if (!userData || !userData.phoneNumber) {
        console.error('User phone number not found');
        return null;
      }

      // Get course data
      const courseSnapshot = await admin.database().ref(`/courses/${courseId}`).once('value');
      const courseData = courseSnapshot.val();

      // Create notification message
      const message = {
        notification: {
          title: `Welcome to ${courseData.title}!`,
          body: `Your enrollment token is: ${enrollment.token}. Please keep this token safe for future reference.`
        },
        data: {
          courseId: courseId,
          token: enrollment.token,
          type: 'enrollment'
        },
        token: userData.fcmToken // This will be the FCM token for the user's device
      };

      // Send the message
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);

      return null;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }); 