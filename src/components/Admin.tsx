import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { ref, get, set } from 'firebase/database';

interface Course {
  id?: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: number;
  category: string;
  thumbnail: string;
  curriculum: string[];
  prerequisites: string[];
  whatYouWillLearn: string[];
}

export default function Admin() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({
    title: 'Introduction to Machine Learning',
    description: 'Master the fundamentals of machine learning and build your first AI models. This comprehensive course covers everything from basic concepts to practical implementation.',
    duration: '8 weeks',
    level: 'Beginner',
    price: 2999,
    category: 'AI & Machine Learning',
    thumbnail: '🤖',
    curriculum: [
      'Introduction to Machine Learning',
      'Python for Data Science',
      'Data Preprocessing and Feature Engineering',
      'Supervised Learning Algorithms',
      'Unsupervised Learning',
      'Model Evaluation and Validation',
      'Deep Learning Basics',
      'Final Project: Building a ML Model'
    ],
    prerequisites: [
      'Basic programming knowledge',
      'High school level mathematics',
      'No prior ML experience required'
    ],
    whatYouWillLearn: [
      'Fundamentals of machine learning',
      'Python programming for data science',
      'Data preprocessing techniques',
      'Building and training ML models',
      'Model evaluation and optimization',
      'Real-world ML applications',
      'Best practices in ML development'
    ]
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.accountType !== 'admin') {
            navigate('/dashboard');
            return;
          }
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking admin access:', err);
        navigate('/dashboard');
      }
    };

    checkAdminAccess();
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const coursesRef = ref(database, 'courses');
      const snapshot = await get(coursesRef);
      
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        const coursesList = Object.entries(coursesData).map(([id, course]: [string, any]) => ({
          id,
          ...course
        }));
        setCourses(coursesList);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewCourse(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
                                field: 'curriculum' | 'prerequisites' | 'whatYouWillLearn', 
                                index: number) => {
    const newArray = [...newCourse[field]];
    newArray[index] = e.target.value;
    setNewCourse(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: 'curriculum' | 'prerequisites' | 'whatYouWillLearn') => {
    setNewCourse(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'curriculum' | 'prerequisites' | 'whatYouWillLearn', index: number) => {
    const newArray = newCourse[field].filter((_, i) => i !== index);
    setNewCourse(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current number of courses to generate the next ID
      const coursesRef = ref(database, 'courses');
      const snapshot = await get(coursesRef);
      const courseCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      const courseId = (courseCount + 1).toString();
      
      // Create the course object with the generated ID
      const courseData = {
        ...newCourse,
        id: courseId
      };

      // Save to Firebase
      const courseRef = ref(database, `courses/${courseId}`);
      await set(courseRef, courseData);

      // Update local state
      setCourses(prev => [...prev, courseData]);
      
      // Reset form
      setNewCourse({
        title: '',
        description: '',
        duration: '',
        level: '',
        price: 0,
        category: '',
        thumbnail: '',
        curriculum: [''],
        prerequisites: [''],
        whatYouWillLearn: ['']
      });

      setSuccess('Course added successfully!');
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Failed to add course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Create Course'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        {showCreateForm && (
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                  className="w-full bg-gray-800 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <input
                  type="text"
                  value={newCourse.category}
                  onChange={(e) => handleInputChange(e, 'category')}
                  className="w-full bg-gray-800 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Duration</label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => handleInputChange(e, 'duration')}
                  className="w-full bg-gray-800 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Level</label>
                <input
                  type="text"
                  value={newCourse.level}
                  onChange={(e) => handleInputChange(e, 'level')}
                  className="w-full bg-gray-800 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) => handleInputChange(e, 'price')}
                  className="w-full bg-gray-800 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Thumbnail (Emoji)</label>
                <input
                  type="text"
                  value={newCourse.thumbnail}
                  onChange={(e) => handleInputChange(e, 'thumbnail')}
                  className="w-full bg-gray-800 rounded p-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <textarea
                value={newCourse.description}
                onChange={(e) => handleInputChange(e, 'description')}
                className="w-full bg-gray-800 rounded p-2 h-32"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Curriculum</label>
              {newCourse.curriculum.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, 'curriculum', index)}
                    className="flex-1 bg-gray-800 rounded p-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('curriculum', index)}
                    className="bg-red-900/50 px-3 rounded hover:bg-red-900"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('curriculum')}
                className="mt-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Curriculum Item
              </button>
            </div>

            <div>
              <label className="block mb-2">Prerequisites</label>
              {newCourse.prerequisites.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, 'prerequisites', index)}
                    className="flex-1 bg-gray-800 rounded p-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('prerequisites', index)}
                    className="bg-red-900/50 px-3 rounded hover:bg-red-900"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('prerequisites')}
                className="mt-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Prerequisite
              </button>
            </div>

            <div>
              <label className="block mb-2">What You'll Learn</label>
              {newCourse.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(e, 'whatYouWillLearn', index)}
                    className="flex-1 bg-gray-800 rounded p-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('whatYouWillLearn', index)}
                    className="bg-red-900/50 px-3 rounded hover:bg-red-900"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="mt-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Learning Outcome
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Add Course
            </button>
          </form>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Existing Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800 rounded-lg p-6">
                <div className="text-4xl mb-4">{course.thumbnail}</div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-400 mb-4">{course.description}</p>
                <div className="flex justify-between text-gray-300">
                  <span>{course.level}</span>
                  <span>₹{course.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 