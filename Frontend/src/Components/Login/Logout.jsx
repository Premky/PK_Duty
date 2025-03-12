import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

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
        localStorage.removeItem('main_office_id');
        localStorage.removeItem('office_id');
        localStorage.removeItem('office_np');

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
    <Button
      variant="text"
      sx={{
        color: "white",
        "&:hover": {
          color: "red", // Change color to red on hover
        },
      }}
      onClick={handleLogout}
    >
      <PowerSettingsNewIcon />
    </Button>


  );
};

export default Logout;