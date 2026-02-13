import { useEffect, useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Workouts API response:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Parsed workouts data:', workoutsData);
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching workouts:', error);
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
            <p className="mt-3">Loading workouts...</p>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="page-content">
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Workouts</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );

  const getDifficultyBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
      case 'beginner':
        return 'bg-success';
      case 'medium':
      case 'intermediate':
        return 'bg-warning';
      case 'hard':
      case 'advanced':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="page-content">
      <div className="container py-4">
        <div className="page-header mb-4">
          <h2 className="display-5">💪 Workouts</h2>
          <p className="lead">Personalized workout suggestions and routines</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Available Workouts</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Duration (min)</th>
                    <th>Est. Calories</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>
                        <strong>{workout.name}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {workout.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getDifficultyBadge(workout.difficulty)}`}
                        >
                          {workout.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {workout.duration} min
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {workout.calories_estimate} cal
                        </span>
                      </td>
                      <td>{workout.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            Total Workouts:{' '}
            <span className="badge bg-primary">{workouts.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
