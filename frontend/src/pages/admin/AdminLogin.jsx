export default function AdminLogin() {
    return (
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="gradient-text text-center">Admin Login</h2>
  
        <input className="form-control mt-3" placeholder="Admin Email" />
        <input
          className="form-control mt-3"
          placeholder="Password"
          type="password"
        />
  
        <button className="pg-btn w-100 mt-3">Login</button>
      </div>
    );
  }
  