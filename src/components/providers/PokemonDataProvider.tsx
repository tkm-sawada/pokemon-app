import { createContext, useState, ReactNode, FC, Dispatch, SetStateAction } from 'react';

export const PokemonDataContext = createContext(
	{} as {
		pokemonData: any;
		setPokemonData: Dispatch<SetStateAction<any>>;
	}
);

type Props = {
  children: ReactNode ;
}

export const PokemonDataProvider: FC<Props> = (props) => {
  const { children } = props;
  
  const [pokemonData, setPokemonData] = useState([]);

  return (
    <PokemonDataContext.Provider value={{pokemonData, setPokemonData}}>
      { children }
    </PokemonDataContext.Provider>
  );
};