import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (response.data.logoutStatus) {
        // Clear localStorage or any state you use
        localStorage.removeItem('token');
        localStorage.removeItem('valid');
        localStorage.removeItem('type');
        localStorage.removeItem('branch');

        // Redirect to login page after logout
        navigate('/login');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="logout-button" onClick={handleLogout}>
      Logout
    </div>
  );
};

export default Logout;