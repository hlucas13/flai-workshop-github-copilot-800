import { useEffect, useState } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching leaderboard from:', apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard API response:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Parsed leaderboard data:', leaderboardData);
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
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
            <p className="mt-3">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="page-content">
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Leaderboard</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="page-content">
      <div className="container py-4">
        <div className="page-header mb-4">
          <h2 className="display-5">🏆 Leaderboard</h2>
          <p className="lead">Top performers and rankings</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Current Rankings</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '80px' }}>Rank</th>
                    <th>User</th>
                    <th>Team</th>
                    <th>Total Calories</th>
                    <th>Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>
                        {index === 0 && (
                          <span className="badge badge-gold">
                            🥇 {entry.rank || index + 1}
                          </span>
                        )}
                        {index === 1 && (
                          <span className="badge badge-silver">
                            🥈 {entry.rank || index + 1}
                          </span>
                        )}
                        {index === 2 && (
                          <span className="badge badge-bronze">
                            🥉 {entry.rank || index + 1}
                          </span>
                        )}
                        {index > 2 && (
                          <span className="badge bg-info">
                            {entry.rank || index + 1}
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>{entry.user_name || entry.user_id}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {entry.team_name || entry.team_id || 'No Team'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {entry.total_calories || 0} cal
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {entry.total_activities || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            Total Participants:{' '}
            <span className="badge bg-primary">{leaderboard.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
