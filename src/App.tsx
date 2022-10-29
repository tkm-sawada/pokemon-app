import Navbar from './components/Navbar';
import PokemonCard from './components/PokemonCard';
import PageButton from './components/PageButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useListUpPokemonCards } from './hooks/useListUpPokemonCards';


function App() {
  const {isLoading, pokemonCards, pages, handleMovePage} = useListUpPokemonCards();

  return (
    <div className="text-center w-full h-full font-semibold tracking-widest text-neutral-600">
      <Navbar />
      <div className="fixed w-full h-screen -z-10 bg-white"></div>
      {/* <button type="button" onClick={() => bottomScroll()} className="fixed right-1 bottom-1 flex-1 mx-4 py-3 px-4 text-black bg-white border-0 hover:bg-red-200 bg-opacity-50 rounded-xl text-xl shadow-2xl z-40">↓</button> */}
      <div className="pt-16 z-10">
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} className="mt-12 text-5xl animate-spin"/>
        ) : (
          <div>
            <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-5 mt-5 pb-32">
              {pokemonCards.map((pokemonCard: any, i: number) => {
                return <PokemonCard key={i} pokemonCard={pokemonCard} />;
              })}
            </div>
            <PageButton pages={pages} 
                        handleMovePage={handleMovePage}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
