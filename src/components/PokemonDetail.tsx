import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { faBolt, faBug, faCircle, faDragon, faDroplet, faFaceAngry, faFaceSmile, faFeather, faFire, faGhost, faHandFist, faLeaf, faMountain, faMountainSun, faSkullCrossbones, faSnowflake, faSpinner, faSpoon, faWrench, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faCircleLeft, faCircleRight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEffect, useState } from 'react';
import { getImage, getPokemon } from '../utils/pokemon';
import StatusTable from './StatusTable';

type Props = {
  pokemonCard: PokemonCard;
  setShowModal: any;
}

const PokemonDetail = (props: Props) => {
  const { pokemonCard } = props;
  const [isLoading, setIsloading] = useState(true);
  const [variety, setVariety] = useState(0);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[]>(
    [
      {
        id: 0,
        name: "",
        frontDefault: "",
        frontShiny: "",
        genus: "",
        types: [],
        weight: 0,
        height: 0,
        abilities: [""],
        flavor_texts: [],
        status: {hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0}
      }
    ]
  );

  useEffect(() => {
    loadPokemonList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadPokemonList = async() => {
    // ポケモン１匹分の情報を取得
    const pokemonRecord: any = await getPokemon(pokemonCard.url);
    /////////////////////////////////////////////

    // **************************************
    // ポケモン１匹分に紐づく種族情報を取得
    // **************************************
    const pokemonSpecies: any = await getPokemon(pokemonCard.speciesUrl);
    // 種族の日本語名を抽出
    const pokemonSpeciesGeneraGenusJa: any = pokemonSpecies.genera.filter((genera: any) => {
      return genera.language.name === "ja";
    })
    /////////////////////////////////////////////

    // **************************************
    // ポケモンの別の姿の情報を取得(形態変化、メガシンカ、キョダイマックスなど)
    // **************************************
    const pokemonRecords: any[]  = await Promise.all(
      pokemonSpecies.varieties.map((variety: any) => {
        if(variety.is_default === true){
          // 1つ目の姿は最初に取得した情報を参照する
          return pokemonRecord;
        }
        return getPokemon(variety.pokemon.url);
      })
    )
    /////////////////////////////////////////////

    // **************************************
    // 特性情報の取得
    // **************************************
    const abilities: string[][] = [];
    // そのポケモンの姿の種類分ループ
    for(let i in pokemonRecords){
      // 1つの姿に紐づく特性情報を取得
      const pokemonAbilities: any = await Promise.all(
        pokemonRecords[i].abilities.map((ability: any) => {
          return getPokemon(ability.ability.url);
        })
      );
      // 特性名のみ取り出す
      abilities[i] = pokemonAbilities.map((abilities: any) => {
        return abilities.names[0].name;
      })
    }
    /////////////////////////////////////////////
    
    // **************************************
    // タイプ情報の取得
    // **************************************
    const types: Type[][] = [];
    // そのポケモンの姿の種類分ループ
    for(let i in pokemonRecords){
      // 1つの姿に紐づくタイプ情報を取得
      const pokemontypes: any = await Promise.all(
        pokemonRecords[i].types.map((type: any) => {
          return getPokemon(type.type.url);
        })
      );
      // タイプの日本語名を抽出
      const pokemontypesNameJa: any = pokemontypes.map((types: any) => {
        return types.names.filter((name: any) => {
          return name.language.name === "ja";
        })
      })
      
      // タイプ情報をリストアップ
      let color: string;
      let icon: IconDefinition;
      let type: Type[] = [];
      for(let j in pokemontypes){
        switch (pokemontypesNameJa[j][0].name){
          case "ノーマル":
            color = "bg-gray-300"
            icon = faCircle
            break;
          case "ほのお":
            color = "bg-red-600"
            icon = faFire
            break;
          case "みず":
            color = "bg-blue-500"
            icon = faDroplet
            break;
          case "でんき":
            color = "bg-yellow-400"
            icon = faBolt
            break;
          case "くさ":
            color = "bg-green-500"
            icon = faLeaf
            break;
          case "こおり":
            color = "bg-indigo-300"
            icon = faSnowflake
            break;
          case "かくとう":
            color = "bg-orange-600"
            icon = faHandFist
            break;
          case "どく":
            color = "bg-purple-500"
            icon = faSkullCrossbones
            break;
          case "じめん":
            color = "bg-orange-800"
            icon = faMountainSun
            break;
          case "ひこう":
            color = "bg-blue-300"
            icon = faFeather
            break;
          case "エスパー":
            color = "bg-pink-600"
            icon = faSpoon
            break;
          case "むし":
            color = " bg-lime-400"
            icon = faBug
            break;
          case "いわ":
            color = " bg-stone-500"
            icon = faMountain
            break;
          case "ゴースト":
            color = "bg-neutral-500"
            icon = faGhost
            break;
          case "ドラゴン":
            color = "bg-indigo-400"
            icon = faDragon
            break;
          case "あく":
            color = "bg-black"
            icon = faFaceAngry
            break;
          case "はがね":
            color = "bg-stone-500"
            icon = faWrench
            break;
          case "フェアリー":
            color = "bg-pink-400"
            icon = faFaceSmile
            break;
          default:
            color = "bg-gray-300"
            icon = faCircle
        }
        // タイプ情報をセット
        type.push({
          typeName: pokemontypesNameJa[j][0].name,
          color: color,
          icon: icon
        });
      }
      types[i] = type;
    }
    /////////////////////////////////////////////

    // *************************************
    // 日本語のフレーバーテキストをリストアップ
    // *************************************
    // 日本語のフレーバーテキストを取り出し
    const flavor_text_entries_ja: any = pokemonSpecies.flavor_text_entries.filter((flavorTextEntries: any, i: number) => {
      return flavorTextEntries.language.name === "ja";
    })
    // ゲームのバージョン情報を取得
    const versionLanguages: any = await Promise.all(
      flavor_text_entries_ja.map((flavorTextEntriesJa: any, i: number) => {
        return getPokemon(flavorTextEntriesJa.version.url);
    }))
    // バージョン・フレーバーテキストのセットを作成
    const flavorTexts: FlavorText[] = flavor_text_entries_ja.map((flavorTextEntriesJa: any, i: number) => {
      // 日本語のバージョン情報を取り出し
      const versionLanguage: any = versionLanguages[i].names.filter((name: any, i: number) => {
        return name.language.name === "ja-Hrkt";
      })
      // バージョン情報、フレーバーテキストをセット
      const flavor_text: FlavorText = {
        version: versionLanguage[0].name,
        flavor_text: flavorTextEntriesJa.flavor_text
      };
      return flavor_text;
    })
    /////////////////////////////////////////////

    // **************************************
    // ステータス情報の取得
    // **************************************
    const statuses: Status[] = [];
    // そのポケモンの姿の種類分ループ
    for(let i in pokemonRecords){
      // 1つの姿に紐づく特性情報を取得
      let status: Status = {hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0};
      for(let j in pokemonRecords[i].stats){
        switch(pokemonRecords[i].stats[j].stat.name){
          case "hp":
            status.hp = pokemonRecords[i].stats[j].base_stat;
            break;
          case "attack":
            status.attack = pokemonRecords[i].stats[j].base_stat;
            break;
          case "defense":
            status.defense = pokemonRecords[i].stats[j].base_stat;
            break;
          case "special-attack":
            status.specialAttack = pokemonRecords[i].stats[j].base_stat;
            break;
          case "special-defense":
            status.specialDefense = pokemonRecords[i].stats[j].base_stat;
            break;
          case "speed":
            status.speed = pokemonRecords[i].stats[j].base_stat;
            break;
          default:
        }
      }
      statuses[i] = status;
    }
    /////////////////////////////////////////////

    // 詳細情報に必要な情報を格納
    const pokemonDetails: PokemonDetail[] = [];
    for(let i in pokemonRecords){
      // ポケモン名の日本語の接頭辞を決定
      let prefix: string = "";
      prefix = pokemonRecords[i].name.indexOf("-mega") > -1 ? "メガ" : prefix;
      prefix = pokemonRecords[i].name.indexOf("-gmax") > -1 ? "キョダイ" : prefix;
      // ポケモン名の日本語の接尾辞を決定
      let suffix: string = "";
      suffix  = pokemonRecords[i].name.indexOf("-x") > -1 ? "X" : suffix;
      suffix  = pokemonRecords[i].name.indexOf("-y") > -1 ? "Y" : suffix;
      suffix  = pokemonRecords[i].name.indexOf("-galar") > -1 ? "（ガラル）" : suffix;
      suffix  = pokemonRecords[i].name.indexOf("-alola") > -1 ? "（アローラ）" : suffix;
      suffix  = pokemonRecords[i].name.indexOf("-hisui") > -1 ? "（ヒスイ）" : suffix;
      // 通常色の画像がない場合はオフィシャル画像を参照
      let frontDefault: string = pokemonRecords[i].sprites.front_default;
      if(frontDefault === null){
        frontDefault = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonRecords[i].id}.png`;
      }
      pokemonDetails[i] = {
        id: pokemonCard.id,
        name: prefix + pokemonCard.name + suffix,
        frontDefault: await getImage(frontDefault),
        frontShiny: await getImage(pokemonRecords[i].sprites.front_shiny),
        genus: pokemonSpeciesGeneraGenusJa[0].genus,
        types: types[i],
        weight: pokemonRecords[i].weight / 10,
        height: pokemonRecords[i].height / 10,
        abilities: abilities[i],
        flavor_texts: flavorTexts,
        status: statuses[i],
      };
    }
    

    // setPokemonDetail(pokemonDetail);
    setPokemonDetails(pokemonDetails);
    setIsloading(false);
  };

  // 姿を切り替え
  const varietyChange = (varietyNumber: number) => {
    setVariety(varietyNumber);
  };

  // モーダルを閉じる
  const closeModal = () => {
    props.setShowModal(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div onClick={closeModal} className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-40"></div>
      <div className="p-4 rounded-xl bg-white z-40 lg:w-1/2 md:w-3/4 w-5/6 h-5/6 overflow-y-scroll">
        {isLoading ? (
          <div className="h-5/6">
            <FontAwesomeIcon icon={faSpinner} className="mt-12 text-5xl animate-spin"/>
          </div>
        ) : (
          <div className="relative w-5/6 mx-auto">
            <div className="absolute flex justify-between w-full">
              <p className="text-left"> No.{pokemonDetails[variety].id}</p>
              <div className="flex">
                {pokemonDetails.map((pokemonDetail: PokemonDetail, i: number) => {
                  return <button onClick={() => varietyChange(i)} key={i + 1} className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium bg-gray-600 border-gray-600">
                          <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                          <span className="relative text-white transition duration-300 group-hover:text-gray-600 ease">{i + 1}</span>
                        </button>;
                })}
              </div>
            </div>
            
            <div className="grid items-center h-40">
              <div className="flex justify-center mt-10">
                <img src={pokemonDetails[variety].frontDefault} alt={pokemonDetails[variety].name} className="max-h-40"/>
                <img src={pokemonDetails[variety].frontShiny} alt={pokemonDetails[variety].name} className="max-h-40"/>
              </div>
            </div>
            <div className="shadow my-4">
              <div className="py-3 text-3xl rounded-t text-white bg-gray-800">{pokemonDetails[variety].name}</div>
              <div className="py-2 px-4 rounded-b ">{pokemonDetails[variety].genus}</div>
            </div>

            <table className="w-full my-6 shadow overflow-hidden rounded border-gray-200">
              <tbody>
                <tr>
                  <th className="w-1/3 text-center py-2 bg-gray-200">タイプ</th>
                  <td className="flex text-left py-2 pl-8">
                    {pokemonDetails[variety].types.map((type: Type, i: number) => {
                      return <div className="flex items-center mr-2 text-white" key={i}>
                                <div className={"px-3 py-1 rounded-l " +  type.color}><FontAwesomeIcon icon={type.icon} /></div>
                                <div className="px-3 py-1 rounded-r bg-gray-600">{type.typeName}</div>
                              </div>;
                    })}
                  </td>
                </tr>
                <tr>
                  <th className="w-1/3 text-center py-2 bg-gray-200">高さ</th>
                  <td className="w-2/3 text-left py-2 pl-8">{pokemonDetails[variety].height}m</td>
                </tr>
                <tr>
                  <th className="w-1/3 text-center py-2 bg-gray-200">重さ</th>
                  <td className="w-2/3 text-left py-2 pl-8">{pokemonDetails[variety].weight}kg</td>
                </tr>
                <tr>
                  <th className="w-1/3 text-center py-2 bg-gray-200">特性</th>
                  <td className="w-2/3 text-left py-2 pl-8">
                    {pokemonDetails[variety].abilities.map((abilities: string, i: number) => {
                      return <p key={i}>
                        {abilities}
                      </p>;
                    })}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="my-6">
              <StatusTable status={pokemonDetails[variety].status}/>
            </div>
            
            <div className="relative">
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation={{
                    // パラメータを設定
                    prevEl: "#prev",
                    nextEl: "#next"
                }}
                pagination={{ 
                  el: "#pagination",
                  clickable: true 
                }}
                loop={true}
                className="w-10/12 shadow"
              >
                {pokemonDetails[variety].flavor_texts.map((flavorText: FlavorText, i: number) => {
                  return <SwiperSlide key={i}>
                    <div className="items-center">
                      <div className="border rounded-l h-full">{flavorText.version}</div>
                      <div className="w-full flex justify-center">
                        <div dangerouslySetInnerHTML={{ __html: flavorText.flavor_text.replace(/\n/g, '<br />') }} 
                            className="h-full text-left text-sm p-3"/>
                      </div>
                    </div>
                  </SwiperSlide>
                })}
                
              </Swiper>
              <div id="prev" className="swiper-button-prev -left-1"><FontAwesomeIcon icon={faCircleLeft} className="text-2xl text-gray-600"/></div>
              <div id="next" className="swiper-button-next -right-1"><FontAwesomeIcon icon={faCircleRight} className="text-2xl text-gray-600"/></div>
              <div id="pagination" className="swiper-pagination relative mt-2"></div>
            </div>
          </div>
        )}

        <div className="mt-6 w-full">
          <button onClick={closeModal} className="relative inline-flex items-center px-10 py-3 overflow-hidden text-lg font-medium text-gray-600 border-2 border-gray-600 rounded-xl hover:text-white group hover:bg-gray-50">
            <span className="absolute left-0 block w-full h-0 transition-all bg-gray-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease"></span>
            <span className="relative">Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default PokemonDetail;