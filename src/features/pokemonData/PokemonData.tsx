import type { RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setPokemonData } from './pokemonDataSlice'

export function PokemonData() {
  const pokemonData = useSelector((state: RootState) => state.nowPage.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label='Increment value'
          onClick={() => dispatch(setPokemonData(10))}
        >
          Increment
        </button>
        <span>{pokemonData}</span>
      </div>
    </div>
  )
}
