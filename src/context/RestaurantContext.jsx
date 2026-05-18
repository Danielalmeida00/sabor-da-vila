import { createContext, useContext, useState, useEffect } from 'react';
import { getRestaurantInfo } from '../services/restaurantService';

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant deve ser usado dentro de um RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantInfo();
        setRestaurant(data);
      } catch (err) {
        console.error('Erro ao buscar informações do restaurante:', err);
        setError(err.message);
        // Usar dados padrão em caso de erro
        setRestaurant({
          name: 'Sabor da Vila',
          tagline: 'Comida artesanal feita com amor desde 1998',
          address: 'Rua da Vila, 123 - Vila Maria - São Paulo, SP',
          phone: '+55 (11) 99999-9999',
          whatsapp: '5511999999999',
          instagram: 'sabordalavila',
          hours: {
            seg: '11:00-23:00',
            ter: '11:00-23:00',
            qua: '11:00-23:00',
            qui: '11:00-23:00',
            sex: '11:00-23:00',
            sab: '12:00-00:00',
            dom: '12:00-00:00',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, []);

  const value = {
    restaurant,
    loading,
    error,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
