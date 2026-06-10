import { useState, useEffect } from 'react';
import { getRegistrations, addRegistration, dropRegistration, getStudents, getCourses } from '../api';

function Registrations({ onDataChange }) {
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [registrationsRes, studentsRes, coursesRes] = await Promise.all([
        getRegistrations(),
        getStudents(),
        getCourses(),
      ]);
      setRegistrations(registrationsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      if (onDataChange) onDataChange(); // keep dashboard counts in sync
    } catch (err) {
      setError('Could not load data. Is the backend running?');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await addRegistration({
        student_id: Number(studentId),
        course_id: Number(courseId),
      });
      setStudentId('');
      setCourseId('');
      loadAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleDrop = async (id) => {
    if (!window.confirm('Drop this registration?')) {
      return;
    }
    try {
      await dropRegistration(id);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not drop registration');
    }
  };

  return (
    <div>
      <h2>Registrations</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title} ({course.enrolled}/{course.capacity})
            </option>
          ))}
        </select>

        <button type="submit">Register</button>
      </form>

      <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>Registered At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg.id}>
              <td>{reg.id}</td>
              <td>{reg.student_name}</td>
              <td>{reg.course_code} - {reg.course_title}</td>
              <td>{new Date(reg.registered_at).toLocaleString()}</td>
              <td>
                <div className="actions">
                  <button className="small danger" onClick={() => handleDrop(reg.id)}>Drop</button>
                </div>
              </td>
            </tr>
          ))}
          {registrations.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">No registrations found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Registrations;
