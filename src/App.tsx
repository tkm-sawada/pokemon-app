import Navbar from './components/Navbar'
import PokemonCard from './components/PokemonCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useListUpPokemonCards } from './hooks/useListUpPokemonCards'
import Pagination from '@mui/material/Pagination'
import { RootState } from './redux/store'
import { useSelector } from 'react-redux'

function App() {
  const { isLoading, pokemonCards, page, handleMovePage } =
    useListUpPokemonCards()
  const nowPage = useSelector((state: RootState) => state.nowPage.value)
  const handleChange = (event: React.ChangeEvent<unknown>, pageNum: number) => {
    handleMovePage({ pageNum })
  }

  return (
    <div className='text-center w-full h-full font-kiwi font-semibold tracking-widest text-neutral-600'>
      <Navbar />
      <div className='fixed w-full h-screen -z-10 bg-white' />
      {/* <button type="button" onClick={() => bottomScroll()} className="fixed right-1 bottom-1 flex-1 mx-4 py-3 px-4 text-black bg-white border-0 hover:bg-red-200 bg-opacity-50 rounded-xl text-xl shadow-2xl z-40">↓</button> */}
      <div className='pt-16 z-10'>
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            className='mt-12 text-5xl animate-spin'
          />
        ) : (
          <div>
            <div className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-5 mt-5'>
              {pokemonCards.map((pokemonCard: any, i: number) => {
                return <PokemonCard key={i} pokemonCard={pokemonCard} />
              })}
            </div>
            <Pagination
              className='flex justify-center my-12'
              count={page}
              page={nowPage}
              siblingCount={3}
              size='large'
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
