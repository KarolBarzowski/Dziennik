import React from 'react';

function Dashboard({ data }) {
  return <div>Witaj, {data && data.user.name}</div>;
}

export default Dashboard;
