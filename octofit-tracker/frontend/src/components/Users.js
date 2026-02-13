import { useEffect, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team_id: '',
  });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const fetchUsers = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Fetching users from:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Users API response:', data);
        const usersData = data.results || data;
        console.log('Parsed users data:', usersData);
        setUsers(usersData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchTeams = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const teamsData = data.results || data;
        setTeams(teamsData);
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team_id: user.team_id || '',
    });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleClose = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', team_id: '' });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${editingUser.id}/`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          team_id: formData.team_id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);

      setSaveSuccess(true);
      fetchUsers();

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving user:', error);
      setSaveError(error.message);
    }
  };

  if (loading)
    return (
      <div className="page-content">
        <div className="container mt-5">
          <div className="text-center loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading users...</p>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="page-content">
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Users</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="page-content">
      <div className="container py-4">
        <div className="page-header mb-4">
          <h2 className="display-5">👤 Users</h2>
          <p className="lead">Manage and view all registered users</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">User Directory</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Team ID</th>
                    <th>Created Date</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.team_id ? (
                          <span className="badge bg-info">{user.team_id}</span>
                        ) : (
                          <span className="badge bg-secondary">No Team</span>
                        )}
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-sm btn-primary"
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            Total Users:{' '}
            <span className="badge bg-primary">{users.length}</span>
          </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <>
            <div className="modal-backdrop show" onClick={handleClose}></div>
            <div
              className="modal show"
              style={{ display: 'block' }}
              tabIndex="-1"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={handleClose}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {saveSuccess && (
                      <div className="alert alert-success" role="alert">
                        ✅ User updated successfully!
                      </div>
                    )}
                    {saveError && (
                      <div className="alert alert-danger" role="alert">
                        ❌ Error: {saveError}
                      </div>
                    )}
                    <form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="team_id" className="form-label">
                          Team
                        </label>
                        <select
                          className="form-select"
                          id="team_id"
                          name="team_id"
                          value={formData.team_id}
                          onChange={handleInputChange}
                        >
                          <option value="">No Team</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saveSuccess}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
