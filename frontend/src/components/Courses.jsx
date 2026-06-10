import { useState, useEffect } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../api';

function Courses({ onDataChange }) {
  const [courses, setCourses] = useState([]);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
      if (onDataChange) onDataChange(); // keep dashboard counts in sync
    } catch (err) {
      setError('Could not load courses. Is the backend running?');
    }
  };

  const resetForm = () => {
    setCode('');
    setTitle('');
    setInstructor('');
    setCapacity(30);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const course = { code, title, instructor, capacity: Number(capacity) };

    try {
      if (editingId) {
        await updateCourse(editingId, course);
      } else {
        await addCourse(course);
      }
      resetForm();
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setCode(course.code);
    setTitle(course.title);
    setInstructor(course.instructor);
    setCapacity(course.capacity);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? All its registrations will also be removed.')) {
      return;
    }
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete course');
    }
  };

  return (
    <div>
      <h2>Courses</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Code (e.g. CS101)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Instructor"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          min="1"
          required
        />
        <button type="submit">{editingId ? 'Update Course' : 'Add Course'}</button>
        {editingId && (
          <button type="button" className="secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Enrolled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.code}</td>
              <td>{course.title}</td>
              <td>{course.instructor}</td>
              <td>
                {course.enrolled} / {course.capacity}
                {course.enrolled >= course.capacity && <span className="badge">Full</span>}
              </td>
              <td>
                <div className="actions">
                  <button className="small" onClick={() => handleEdit(course)}>Edit</button>
                  <button className="small danger" onClick={() => handleDelete(course.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">No courses found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Courses;
