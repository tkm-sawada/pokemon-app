import {
  faBolt,
  faBug,
  faCircle,
  faDragon,
  faDroplet,
  faFaceAngry,
  faFaceSmile,
  faFeather,
  faFire,
  faGhost,
  faHandFist,
  faLeaf,
  faMountain,
  faMountainSun,
  faSkullCrossbones,
  faSnowflake,
  faSpoon,
  faWrench,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from 'react'
import { getImage, getPokemon } from '../utils/pokemon'

type Props = {
  pokemonCard: PokemonCard
  setShowModal: any
}

export const useFetchPokemonDetail = (props: Props) => {
  const { pokemonCard, setShowModal } = props
  const [isLoading, setIsloading] = useState(true)
  const [variety, setVariety] = useState(0)
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[]>([
    {
      id: 0,
      name: '',
      frontDefault: '',
      frontShiny: '',
      genus: '',
      types: [],
      weight: 0,
      height: 0,
      abilities: [''],
      flavor_texts: [],
      status: {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      },
    },
  ])

  useEffect(() => {
    loadPokemonList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const loadPokemonList = async () => {
    // ポケモン１匹分の情報を取得
    const pokemonRecord = await getPokemon(pokemonCard.url)
    /////////////////////////////////////////////

    // **************************************
    // ポケモン１匹分に紐づく種族情報を取得
    // **************************************
    const pokemonSpecies = await getPokemon(pokemonCard.speciesUrl)
    // 種族の日本語名を抽出
    const pokemonSpeciesGeneraGenusJa = pokemonSpecies.genera.filter(
      (genera: any) => {
        return genera.language.name === 'ja'
      }
    )
    /////////////////////////////////////////////

    // **************************************
    // ポケモンの別の姿の情報を取得(形態変化、メガシンカ、キョダイマックスなど)
    // **************************************
    const pokemonRecords: any[] = await Promise.all(
      pokemonSpecies.varieties.map((variety: any) => {
        if (variety.is_default === true) {
          // 1つ目の姿は最初に取得した情報(通常の姿)を参照する
          return pokemonRecord
        }
        return getPokemon(variety.pokemon.url)
      })
    )
    /////////////////////////////////////////////

    // **************************************
    // 特性情報の取得
    // **************************************
    const abilities: string[][] = []
    // そのポケモンの姿の種類分ループ
    for (let i in pokemonRecords) {
      // 1つの姿に紐づく特性情報を取得
      const pokemonAbilities: any = await Promise.all(
        pokemonRecords[i].abilities.map((ability: any) => {
          return getPokemon(ability.ability.url)
        })
      )
      // 特性名のみ取り出す
      abilities[i] = pokemonAbilities.map((abilities: any) => {
        return abilities.names[0].name
      })
    }
    /////////////////////////////////////////////

    // **************************************
    // タイプ情報の取得
    // **************************************
    const types: Type[][] = []
    // そのポケモンの姿の種類分ループ
    for (let i in pokemonRecords) {
      // 1つの姿に紐づくタイプ情報を取得
      const pokemontypes: any = await Promise.all(
        pokemonRecords[i].types.map((type: any) => {
          return getPokemon(type.type.url)
        })
      )
      // タイプの日本語名を抽出
      const pokemontypesNameJa: any = pokemontypes.map((types: any) => {
        return types.names.filter((name: any) => {
          return name.language.name === 'ja'
        })
      })

      // タイプ情報をリストアップ
      // (タイプ名、タイプ色、タイプアイコン)
      let color: string
      let icon: IconDefinition
      let type: Type[] = []
      for (let j in pokemontypes) {
        switch (pokemontypesNameJa[j][0].name) {
          case 'ノーマル':
            color = 'bg-gray-300'
            icon = faCircle
            break
          case 'ほのお':
            color = 'bg-red-600'
            icon = faFire
            break
          case 'みず':
            color = 'bg-blue-500'
            icon = faDroplet
            break
          case 'でんき':
            color = 'bg-yellow-400'
            icon = faBolt
            break
          case 'くさ':
            color = 'bg-green-500'
            icon = faLeaf
            break
          case 'こおり':
            color = 'bg-indigo-300'
            icon = faSnowflake
            break
          case 'かくとう':
            color = 'bg-orange-600'
            icon = faHandFist
            break
          case 'どく':
            color = 'bg-purple-500'
            icon = faSkullCrossbones
            break
          case 'じめん':
            color = 'bg-orange-800'
            icon = faMountainSun
            break
          case 'ひこう':
            color = 'bg-blue-300'
            icon = faFeather
            break
          case 'エスパー':
            color = 'bg-pink-600'
            icon = faSpoon
            break
          case 'むし':
            color = ' bg-lime-400'
            icon = faBug
            break
          case 'いわ':
            color = ' bg-stone-500'
            icon = faMountain
            break
          case 'ゴースト':
            color = 'bg-neutral-500'
            icon = faGhost
            break
          case 'ドラゴン':
            color = 'bg-indigo-400'
            icon = faDragon
            break
          case 'あく':
            color = 'bg-black'
            icon = faFaceAngry
            break
          case 'はがね':
            color = 'bg-stone-500'
            icon = faWrench
            break
          case 'フェアリー':
            color = 'bg-pink-400'
            icon = faFaceSmile
            break
          default:
            color = 'bg-gray-300'
            icon = faCircle
        }
        // タイプ情報をセット
        type.push({
          typeName: pokemontypesNameJa[j][0].name,
          color: color,
          icon: icon,
        })
      }
      types[i] = type
    }
    /////////////////////////////////////////////

    // *************************************
    // 日本語のフレーバーテキストをリストアップ
    // *************************************
    // 日本語のフレーバーテキストを取り出し
    const flavor_text_entries_ja: any =
      pokemonSpecies.flavor_text_entries.filter(
        (flavorTextEntries: any, i: number) => {
          return flavorTextEntries.language.name === 'ja'
        }
      )
    // ゲームのバージョン情報を取得
    const versionLanguages: any = await Promise.all(
      flavor_text_entries_ja.map((flavorTextEntriesJa: any, i: number) => {
        return getPokemon(flavorTextEntriesJa.version.url)
      })
    )
    // バージョン・フレーバーテキストのセットを作成
    const flavorTexts: FlavorText[] = flavor_text_entries_ja.map(
      (flavorTextEntriesJa: any, i: number) => {
        // 日本語のバージョン情報を取り出し
        const versionLanguage: any = versionLanguages[i].names.filter(
          (name: any, i: number) => {
            return name.language.name === 'ja-Hrkt'
          }
        )
        // バージョン情報、フレーバーテキストをセット
        const flavor_text: FlavorText = {
          version: versionLanguage[0].name,
          flavor_text: flavorTextEntriesJa.flavor_text,
        }
        return flavor_text
      }
    )
    /////////////////////////////////////////////

    // **************************************
    // ステータス情報の取得
    // **************************************
    const statuses: Status[] = []
    // そのポケモンの姿の種類分ループ
    for (let i in pokemonRecords) {
      // 1つの姿に紐づく特性情報を取得
      let status: Status = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      }
      for (let j in pokemonRecords[i].stats) {
        switch (pokemonRecords[i].stats[j].stat.name) {
          case 'hp':
            status.hp = pokemonRecords[i].stats[j].base_stat
            break
          case 'attack':
            status.attack = pokemonRecords[i].stats[j].base_stat
            break
          case 'defense':
            status.defense = pokemonRecords[i].stats[j].base_stat
            break
          case 'special-attack':
            status.specialAttack = pokemonRecords[i].stats[j].base_stat
            break
          case 'special-defense':
            status.specialDefense = pokemonRecords[i].stats[j].base_stat
            break
          case 'speed':
            status.speed = pokemonRecords[i].stats[j].base_stat
            break
          default:
        }
      }
      statuses[i] = status
    }
    /////////////////////////////////////////////

    // 詳細情報に必要な情報を格納
    const pokemonDetails: PokemonDetail[] = []
    for (let i in pokemonRecords) {
      // ポケモン名の日本語の接頭辞を決定
      let prefix: string = ''
      prefix = pokemonRecords[i].name.indexOf('-mega') > -1 ? 'メガ' : prefix
      prefix =
        pokemonRecords[i].name.indexOf('-gmax') > -1 ? 'キョダイ' : prefix
      // ポケモン名の日本語の接尾辞を決定
      let suffix: string = ''
      suffix = pokemonRecords[i].name.indexOf('-x') > -1 ? 'X' : suffix
      suffix = pokemonRecords[i].name.indexOf('-y') > -1 ? 'Y' : suffix
      suffix =
        pokemonRecords[i].name.indexOf('-galar') > -1 ? '（ガラル）' : suffix
      suffix =
        pokemonRecords[i].name.indexOf('-alola') > -1 ? '（アローラ）' : suffix
      suffix =
        pokemonRecords[i].name.indexOf('-hisui') > -1 ? '（ヒスイ）' : suffix
      suffix =
        pokemonRecords[i].name.indexOf('-paldea') > -1 ? '（パルデア）' : suffix
      // 通常色の画像がない場合はオフィシャル画像を参照
      let frontDefault: string = pokemonRecords[i].sprites.front_default
      // if(frontDefault === null){
      //   frontDefault = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonRecords[i].id}.png`;
      // }
      pokemonDetails[i] = {
        id: pokemonCard.id,
        name: prefix + pokemonCard.name + suffix,
        frontDefault: await getImage(frontDefault),
        frontShiny: await getImage(pokemonRecords[i].sprites.front_shiny),
        genus:
          pokemonSpeciesGeneraGenusJa.length > 0 &&
          pokemonSpeciesGeneraGenusJa[0].genus,
        types: types[i],
        weight: pokemonRecords[i].weight / 10,
        height: pokemonRecords[i].height / 10,
        abilities: abilities[i],
        flavor_texts: flavorTexts,
        status: statuses[i],
      }
    }

    // setPokemonDetail(pokemonDetail);
    setPokemonDetails(pokemonDetails)
    setIsloading(false)
  }

  // 姿を切り替え
  const varietyChange = (varietyNumber: number) => {
    setVariety(varietyNumber)
  }

  // モーダルを閉じる
  const closeModal = () => {
    setShowModal(false)
  }

  return {
    isLoading,
    variety,
    pokemonDetails,
    varietyChange,
    closeModal,
  }
}
