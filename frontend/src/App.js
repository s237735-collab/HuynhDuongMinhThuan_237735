import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ employeeId: '', fullName: '', email: '', department: '', position: '' });
  const [editingId, setEditingId] = useState(null);

  const loadEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees?search=${search}`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadEmployees(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/employees/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/employees`, form);
      }
      setForm({ employeeId: '', fullName: '', email: '', department: '', position: '' });
      loadEmployees();
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa nhân viên này?')) {
      await axios.delete(`${API_URL}/employees/${id}`);
      loadEmployees();
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>QUẢN LÝ NHÂN SỰ</h2>
      <input 
        placeholder="Tìm theo Mã NV hoặc Họ tên..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        style={{ padding: 8, width: 300, marginBottom: 20 }}
      />
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input placeholder="Mã NV" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} required style={{ marginRight: 10, padding: 5 }} />
        <input placeholder="Họ tên" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required style={{ marginRight: 10, padding: 5 }} />
        <input placeholder="Phòng ban" value={form.department} onChange={e => setForm({...form, department: e.target.value})} style={{ marginRight: 10, padding: 5 }} />
        <input placeholder="Chức vụ" value={form.position} onChange={e => setForm({...form, position: e.target.value})} style={{ marginRight: 10, padding: 5 }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ marginRight: 10, padding: 5 }} />
        <button type="submit" style={{ padding: '5px 15px' }}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
      </form>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>Mã NV</th><th>Họ tên</th><th>Phòng ban</th><th>Chức vụ</th><th>Email</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>{emp.email}</td>
              <td>
                <button onClick={() => { setEditingId(emp._id); setForm(emp); }} style={{ marginRight: 5 }}>Sửa</button>
                <button onClick={() => handleDelete(emp._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;