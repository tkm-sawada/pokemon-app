import { memo } from 'react';

const Card = memo((props: any) => {
  const { pokemon } = props;

  return (
    <div className="mx-5 shadow-2xl rounded-xl bg-white">
      <p className='text-left w-4/5 mt-3 mx-auto'>No.{pokemon.id}</p>
      <div className="flex justify-center">
        <img src={pokemon.sprites.front_default} alt={pokemon.species.genera[0].genus}/>
        <img src={pokemon.sprites.front_shiny} alt={pokemon.species.genera[0].genus}/>
      </div>
      <div className="p-0 mt-0 mb-5 text-2xl">
        {pokemon.species.names[0].name}
      </div>
      <div className="mb-2.5 text-sm">
        {pokemon.species.genera[0].genus}
      </div>
      <table className="w-4/5 mx-auto border-separate border-spacing-y-3 ">
        <tbody>
          {pokemon.types.map((type: any, i: number) => {
            return <tr key={i}>
                      <th className="border-b border-slate-600">タイプ{i + 1}</th>
                      <td className="border-b border-slate-600">{type.names[0].name}</td>
                    </tr>;
          })}
          <tr>
            <th className="border-b border-slate-600">重さ</th>
            <td className="border-b border-slate-600">{pokemon.weight / 10}kg</td>
          </tr>
          <tr>
            <th className="border-b border-slate-600">高さ</th>
            <td className="border-b border-slate-600">{pokemon.height / 10}m</td>
          </tr>
          <tr>
            <th>特性</th>
            <td>
              {pokemon.abilities.map((abilities: any, i: number) => {
                return <p key={i}>
                  {abilities.names[0].name}
                </p>;
              })}
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
})

export default Card