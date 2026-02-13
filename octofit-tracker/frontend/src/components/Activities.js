import { useEffect, useState } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Fetching activities from:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activities API response:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Parsed activities data:', activitiesData);
        setActivities(activitiesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="page-content">
        <div className="container mt-5">
          <div className="text-center loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading activities...</p>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="page-content">
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Activities</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="page-content">
      <div className="container py-4">
        <div className="page-header mb-4">
          <h2 className="display-5">🏃 Activities</h2>
          <p className="lead">Track all fitness activities and progress</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Activity Log</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>User ID</th>
                    <th>Activity Type</th>
                    <th>Duration (min)</th>
                    <th>Calories</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <strong>{activity.user_id}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {activity.activity_type}
                        </span>
                      </td>
                      <td>{activity.duration}</td>
                      <td>
                        <span className="badge bg-success">
                          {activity.calories_burned}
                        </span>
                      </td>
                      <td>{formatDate(activity.date)}</td>
                      <td>{activity.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            Total Activities:{' '}
            <span className="badge bg-primary">{activities.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activities;
