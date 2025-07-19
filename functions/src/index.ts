import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

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