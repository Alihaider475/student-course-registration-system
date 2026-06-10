import { useState, useEffect } from 'react';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../api';

function Students({ onDataChange }) {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [editingId, setEditingId] = useState(null); // null means we are adding, a number means we are editing
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
      if (onDataChange) onDataChange(); // keep dashboard counts in sync
    } catch (err) {
      setError('Could not load students. Is the backend running?');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setDepartment('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateStudent(editingId, { name, email, department });
      } else {
        await addStudent({ name, email, department });
      }
      resetForm();
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setDepartment(student.department || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? Their registrations will also be removed.')) {
      return;
    }
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete student');
    }
  };

  return (
    <div>
      <h2>Students</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department (e.g. Computer Science)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Update Student' : 'Add Student'}</button>
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
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>
                  <div className="actions">
                    <button className="small" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="small danger" onClick={() => handleDelete(student.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;
