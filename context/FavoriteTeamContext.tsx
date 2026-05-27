import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'favorite_team';

type FavoriteTeamContextType = {
  favoriteTeam: string | null;
  setFavoriteTeam: (team: string | null) => void;
};

const FavoriteTeamContext = createContext<FavoriteTeamContextType>({
  favoriteTeam: null,
  setFavoriteTeam: () => {},
});

export function FavoriteTeamProvider({ children }: { children: React.ReactNode }) {
  const [favoriteTeam, setFavoriteTeamState] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setFavoriteTeamState(val);
    });
  }, []);

  const setFavoriteTeam = (team: string | null) => {
    setFavoriteTeamState(team);
    if (team) {
      AsyncStorage.setItem(STORAGE_KEY, team);
    } else {
      AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <FavoriteTeamContext.Provider value={{ favoriteTeam, setFavoriteTeam }}>
      {children}
    </FavoriteTeamContext.Provider>
  );
}

export const useFavoriteTeam = () => useContext(FavoriteTeamContext);
