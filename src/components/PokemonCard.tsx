import { useState, memo } from 'react';
import PokemonDetail from './PokemonDetail';

type Props = {
  pokemonCard: PokemonCard;
}

const PokemonCard = memo((props: Props) => {
  const { pokemonCard } = props;

  const [isShowModal, setShowModal] = useState(false);
  const showModal = () => {
    setShowModal(!isShowModal);
  };

  return (
    <>
      {isShowModal && (
        <PokemonDetail pokemonCard={pokemonCard} setShowModal={setShowModal} />
      )}
      <div onClick={showModal} className={"md:mx-5 mx-2 rounded-xl bg-slate-100" + (isShowModal ? " pointer-events-none" : " cursor-pointer hover:scale-110 duration-200")}>
        <p className='text-left w-4/5 mt-3 mx-auto'>No.{pokemonCard.id}</p>
        <div className="flex justify-center h-24">
          <img src={pokemonCard.front_default} alt={pokemonCard.name}/>
        </div>
        <div className="p-0 mt-0 mb-5 text-2xl">
          {pokemonCard.name}
        </div>
      </div>
    </>
  )
})

export default PokemonCard