import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import {
  faCircleLeft,
  faCircleRight,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import StatusTable from './StatusTable'
import { useFetchPokemonDetail } from '../hooks/useFetchPokemonDetail'

type Props = {
  pokemonCard: PokemonCard
  setShowModal: any
}

const PokemonDetail = (props: Props) => {
  const { isLoading, variety, pokemonDetails, varietyChange, closeModal } =
    useFetchPokemonDetail(props)

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
      <div
        onClick={closeModal}
        className='fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-40'
      ></div>
      <div className='p-4 rounded-xl bg-white z-40 lg:w-1/2 md:w-3/4 w-full h-5/6 overflow-y-scroll'>
        {isLoading ? (
          <div className='h-5/6'>
            <FontAwesomeIcon
              icon={faSpinner}
              className='mt-12 text-5xl animate-spin'
            />
          </div>
        ) : (
          <div className='relative md:w-5/6 w-full mx-auto'>
            <div className='absolute flex justify-between w-full'>
              <p className='text-left'> No.{pokemonDetails[variety].id}</p>
              <div className='flex'>
                {pokemonDetails.map(
                  (pokemonDetail: PokemonDetail, i: number) => {
                    return (
                      <button
                        onClick={() => varietyChange(i)}
                        key={i + 1}
                        className='rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium bg-gray-600 border-gray-600'
                      >
                        <span className='absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'></span>
                        <span className='relative text-white transition duration-300 group-hover:text-gray-600 ease'>
                          {i + 1}
                        </span>
                      </button>
                    )
                  }
                )}
              </div>
            </div>

            <div className='grid items-center'>
              <div className='flex justify-center mt-10'>
                {pokemonDetails[variety].frontDefault && (
                  <img
                    src={pokemonDetails[variety].frontDefault}
                    alt={pokemonDetails[variety].name}
                    className='max-h-40'
                  />
                )}
                {pokemonDetails[variety].frontShiny && (
                  <img
                    src={pokemonDetails[variety].frontShiny}
                    alt={pokemonDetails[variety].name}
                    className='max-h-40'
                  />
                )}
              </div>
            </div>
            <div className='shadow my-4'>
              <div className='py-3 text-3xl rounded-t text-white bg-gray-800'>
                {pokemonDetails[variety].name}
              </div>
              <div className='py-2 px-4 rounded-b '>
                {pokemonDetails[variety].genus}
              </div>
            </div>

            <table className='w-full my-6 shadow overflow-hidden rounded border-gray-200'>
              <tbody>
                <tr>
                  <th className='md:w-1/3 w-1/4 text-center py-2 bg-gray-200'>
                    タイプ
                  </th>
                  <td className='flex text-left py-2 pl-8'>
                    {pokemonDetails[variety].types.map(
                      (type: Type, i: number) => {
                        return (
                          <div
                            className='flex items-center mr-2 text-white'
                            key={i}
                          >
                            <div
                              className={
                                'md:px-3 px-1 py-1 rounded-l ' + type.color
                              }
                            >
                              <FontAwesomeIcon icon={type.icon} />
                            </div>
                            <div className='md:px-3 px-1 py-1 rounded-r bg-gray-600'>
                              {type.typeName}
                            </div>
                          </div>
                        )
                      }
                    )}
                  </td>
                </tr>
                <tr>
                  <th className='md:w-1/3 w-1/4 text-center py-2 bg-gray-200'>
                    高さ
                  </th>
                  <td className='md:w-2/3 w-3/4 text-left py-2 pl-8'>
                    {pokemonDetails[variety].height}m
                  </td>
                </tr>
                <tr>
                  <th className='md:w-1/3 w-1/4 text-center py-2 bg-gray-200'>
                    重さ
                  </th>
                  <td className='md:w-2/3 w-3/4 text-left py-2 pl-8'>
                    {pokemonDetails[variety].weight}kg
                  </td>
                </tr>
                <tr>
                  <th className='md:w-1/3 w-1/4 text-center py-2 bg-gray-200'>
                    特性
                  </th>
                  <td className='md:w-2/3 w-3/4 text-left py-2 pl-8'>
                    {pokemonDetails[variety].abilities.map(
                      (abilities: string, i: number) => {
                        return <p key={i}>{abilities}</p>
                      }
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className='my-6'>
              <StatusTable status={pokemonDetails[variety].status} />
            </div>

            <div className='relative'>
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation={{
                  // パラメータを設定
                  prevEl: '#prev',
                  nextEl: '#next',
                }}
                pagination={{
                  el: '#pagination',
                  clickable: true,
                }}
                loop={true}
                className='w-10/12 shadow'
              >
                {pokemonDetails[variety].flavor_texts.map(
                  (flavorText: FlavorText, i: number) => {
                    return (
                      <SwiperSlide key={i}>
                        <div className='items-center'>
                          <div className='border rounded-l h-full'>
                            {flavorText.version}
                          </div>
                          <div className='w-full flex justify-center'>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: flavorText.flavor_text.replace(
                                  /\n/g,
                                  '<br />'
                                ),
                              }}
                              className='h-full text-left text-sm p-3'
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                  }
                )}
              </Swiper>
              <div id='prev' className='swiper-button-prev -left-1'>
                <FontAwesomeIcon
                  icon={faCircleLeft}
                  className='text-2xl text-gray-600'
                />
              </div>
              <div id='next' className='swiper-button-next -right-1'>
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className='text-2xl text-gray-600'
                />
              </div>
              <div
                id='pagination'
                className='swiper-pagination relative mt-2'
              ></div>
            </div>
          </div>
        )}

        <div className='mt-6 w-full'>
          <button
            onClick={closeModal}
            className='relative inline-flex items-center px-10 py-3 overflow-hidden text-lg font-medium text-gray-600 border-2 border-gray-600 rounded-xl hover:text-white group hover:bg-gray-50'
          >
            <span className='absolute left-0 block w-full h-0 transition-all bg-gray-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease'></span>
            <span className='absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease'></span>
            <span className='relative'>Close</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail
