import React, { useEffect, useState } from 'react';
import '../style/UdhariList.css'; // Importing CSS

function UdhariList() {
  const [udharies, setUdharies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');

  const fetchUdhari = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/user/getUdhari`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Udhari data');
      }
      const data = await response.json();
      setUdharies(data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchUdhari();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const udhariData = { customer, amount, description, dueDate, status };

    try {
      let response;
      if (isEditMode) {
        response = await fetch(`${import.meta.env.VITE_APP_URL}/user/udhari/${editId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
          },
          body: JSON.stringify(udhariData)
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_APP_URL}/user/addudhari`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
          },
          body: JSON.stringify(udhariData)
        });
      }

      if (!response.ok) {
        throw new Error(isEditMode ? 'Failed to update Udhari' : 'Failed to add Udhari');
      }

      setShowModal(false);
      fetchUdhari();
      resetForm();
      alert(isEditMode ? 'Udhari updated successfully!' : 'Udhari added successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (udhari) => {
    setCustomer(udhari.customer);
    setAmount(udhari.amount);
    setDescription(udhari.description);
    setDueDate(udhari.dueDate);
    setStatus(udhari.status);
    setEditId(udhari._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Udhari?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_URL}/user/udhari/${id}`, {
          method: 'DELETE',
          headers: {
            'token': localStorage.getItem('token')
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete Udhari');
        }
        fetchUdhari();
        alert('Udhari deleted successfully!');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const resetForm = () => {
    setCustomer('');
    setAmount('');
    setDescription('');
    setDueDate('');
    setStatus('pending');
    setEditId(null);
    setIsEditMode(false);
  };

  return (
    <div >
      <h2>Udhari List</h2>
      <button className="open-modal-btn" onClick={() => { setShowModal(true); resetForm(); }}>
        Add New Udhari
      </button>

      {udharies.length > 0 ? (
        <table >
          <thead>
            <tr>
              {/* <th>S/N</th> */}
              <th>Customer</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Due Date</th>
              {/* <th>Status</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {udharies.map((udhari, index) => (
              <tr key={udhari._id}>
                {/* <td>{index}</td> */}
                <td>{udhari.customer}</td>
                <td>₹{udhari.amount}</td>
                <td>{udhari.description}</td>
                <td>{udhari.dueDate.substring(0, 10)}</td>
                {/* <td className={`status ${udhari.status.toLowerCase()}`}>
                  {udhari.status}
                </td> */}
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(udhari)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(udhari._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Udhari records found.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditMode ? 'Edit Udhari' : 'Add New Udhari'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Customer:</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
              />
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <label>Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
              <label>Status:</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <br />
              <button type="submit" className="submit-btn">{isEditMode ? 'Update' : 'Add'}</button>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UdhariList;
