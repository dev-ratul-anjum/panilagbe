import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getUser = async () => {
  try {
    const token = localStorage.getItem('panilagbe-token');
    if (!token) return null;

    const response = await axios.get(`${BACKEND_URL}/api/users/me`, {
      headers: {
        Authorization: `${token}`
      }
    });

    return response;
  } catch (err) {
    return { data: null, error: true };
  }
};

 export const checkCheckoutAuthorized = async (page, tranId) => {
    try {
      const token = localStorage.getItem('panilagbe-token');
      
      if (tranId && token) {
        const response = await axios.get(
          `${BACKEND_URL}/api/orders/payment/${page}/${tranId}`,
          {
            headers: {
              Authorization: token
            }
          }
        );

        return response;
      }
    } catch (err) {
      return err;
    }
  };
