// All API calls to the backend live in this file
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Students
export const getStudents = () => api.get('/students');
export const addStudent = (student) => api.post('/students', student);
export const updateStudent = (id, student) => api.put(`/students/${id}`, student);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Courses
export const getCourses = () => api.get('/courses');
export const addCourse = (course) => api.post('/courses', course);
export const updateCourse = (id, course) => api.put(`/courses/${id}`, course);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Registrations
export const getRegistrations = () => api.get('/registrations');
export const addRegistration = (registration) => api.post('/registrations', registration);
export const dropRegistration = (id) => api.delete(`/registrations/${id}`);

// Health check
export const checkHealth = () => api.get('/health');
