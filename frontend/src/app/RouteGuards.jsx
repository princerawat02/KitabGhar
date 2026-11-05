function SimplePage({ title, children }) {
  return (
    <main className="simple-page">
      <p className="eyebrow">KITABGHAR</p>
      <h1>{title}</h1>
      {children}
    </main>
  );
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ user, children }) {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export { SimplePage, ProtectedRoute, PublicOnlyRoute };

import { Navigate } from "react-router-dom";
