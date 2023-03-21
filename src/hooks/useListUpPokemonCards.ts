import { useEffect, useState } from 'react'
import { getImage, getPokemon } from '../utils/pokemon'
import { useDispatch, useSelector } from 'react-redux'
import { setnowPageCount } from '../features/nowPage/nowPageSlice'
import { RootState } from '../redux/store'

export const useListUpPokemonCards = () => {
  const initURL: string = 'https://pokeapi.co/api/v2/pokemon'
  const [isLoading, setIsloading] = useState(true)
  const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([])
  const [pages, setPages] = useState([0])
  const [allPokemonCount, setAllPokemonCount] = useState(0)

  const nowPage = useSelector((state: RootState) => state.nowPage.value)
  const dispatch = useDispatch()

  /***********************/
  // 初期処理(１回だけ)
  /***********************/
  useEffect(() => {
    const fetchPokemonData = async () => {
      //すべてのポケモンデータを取得
      let res: any = await getPokemon(initURL + '?limit=100000&offset=0')
      let resResultsReserve: any = res.results.reverse()
      //ID10000以上は別の姿の情報なのでポケモンの総数に含めない
      let resResultsReserveAnotherVariety: any = resResultsReserve.filter(
        (resResultReserve: any) => {
          let pokemonId: string = resResultReserve.url.replace(initURL, '')
          pokemonId = pokemonId.replaceAll('/', '')
          return Number(pokemonId) >= 10000
        }
      )
      //ポケモンの総数をセット
      setAllPokemonCount(res.count - resResultsReserveAnotherVariety.length)

      //初期ページ分のポケモンデータを取得
      res = await getPokemon(initURL)
      //各ポケモンの詳細情報を取得
      await loadPokemonList(res.results)

      //setNowPage(1) //ページング処理のトリガー
      dispatch(setnowPageCount(1))
    }
    fetchPokemonData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /***********************/
  // ページ番号ボタン押下時
  /***********************/
  const handleMovePage = async (props: handleMovePageProps) => {
    const { pageNum } = props
    // ページを読込中にする
    setIsloading(true)
    // 押下したページ番号をセット
    dispatch(setnowPageCount(pageNum))
  }

  /**********************************************/
  // ページング処理(現在ページが変更されたとき)
  /**********************************************/
  useEffect(() => {
    // 指定されたページのポケモン情報を取得
    const limit: number = 20
    const offset: number = (nowPage - 1) * limit
    const pokemonReload = async () => {
      let page: string = '?offset=' + String(offset) + '&limit=' + String(limit)
      let res: any = await getPokemon(initURL + page)
      await loadPokemonList(res.results)
    }

    // 指定されたページに表示するページリストを決定
    const maxPage: number = 9
    const pageListup = () => {
      // 表示するページの開始ページを決定
      let startPage: number = nowPage - 4 //4ページ前まで戻れるようにしておく
      if (startPage < 1) {
        startPage = 1
      }
      // 表示するページの最終ページを決定
      let endPageCount: number = startPage + maxPage
      if (allPokemonCount > limit) {
        if (endPageCount > Math.ceil(allPokemonCount / limit) + 1) {
          // 一番最後のページ番号を超えている場合は最終ページに揃える
          endPageCount = Math.ceil(allPokemonCount / limit) + 1
          startPage = endPageCount - maxPage
        }
      }
      // 表示するページ番号のリストアップ
      let pageNum: number[] = []
      for (let i: number = startPage; i < endPageCount; i += 1) {
        pageNum = [...pageNum, i]
      }
      // // 表示するページの開始ページを決定
      // let startPage: number = 1;
      // // 表示するページの最終ページを決定
      // let endPageCount: number = Math.ceil(allPokemonCount / limit) + 1;
      // // 表示するページ番号のリストアップ
      // let pageNum: number[] = [];

      // for (let i: number = startPage; i < endPageCount; i += 1) {
      //   pageNum = [...pageNum, i]
      // }
      setPages(pageNum)
    }

    //NowPageContextによりnowPageが更新されることで、fetchPokemonDataより先に動作しないよう制御
    if (nowPage > 0) {
      pokemonReload()
      pageListup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPage])

  /***********************/
  // １匹ごとのポケモンデータ取得
  /***********************/
  const loadPokemonList = async (data: any) => {
    // ポケモン１匹分の情報を取得
    let pokemonInfo: any = await Promise.all(
      data.map((pokemon: any) => {
        let onePokemonRecord: any = getPokemon(pokemon.url)
        return onePokemonRecord
      })
    )
    // 違う姿などの情報(id:10000以降)は別途表示させない
    pokemonInfo = pokemonInfo.filter((pokemon: any) => {
      return pokemon.id < 10000
    })
    // ポケモン１匹分に紐づく種族情報を取得
    let pokemonSpecies: any = await Promise.all(
      pokemonInfo.map((pokemon: any) => {
        let onePokemonSpecies = getPokemon(pokemon.species.url)
        return onePokemonSpecies
      })
    )
    // ポケモンの日本語名を抽出
    let pokemonSpeciesNamesJa: any = pokemonSpecies.map((species: any) => {
      return species.names.filter((name: any) => {
        return name.language.name === 'ja'
      })
    })

    // データ結合
    const pokemonCards: PokemonCard[] = []
    for (let i in pokemonInfo) {
      // 通常色の画像がない場合はオフィシャル画像を参照
      let frontDefault: string = pokemonInfo[i].sprites.front_default
      // if(frontDefault === null){
      //   frontDefault = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo[i].id}.png`;
      // }
      const pokemonCard: PokemonCard = {
        id: pokemonInfo[i].id,
        name: pokemonSpeciesNamesJa[i][0].name,
        front_default: await getImage(frontDefault),
        url: initURL + '/' + pokemonInfo[i].id,
        speciesUrl: pokemonInfo[i].species.url,
        typesUrl: pokemonInfo[i].types.map((type: any, i: number) => {
          return type.type.url
        }),
        abilitiesUrl: pokemonInfo[i].abilities.map(
          (ability: any, i: number) => {
            return ability.ability.url
          }
        ),
      }
      pokemonCards.push(pokemonCard)
    }
    setPokemonCards(pokemonCards)
    setIsloading(false)
  }

  // /***********************/
  // // 一番下へボタン押下時
  // /***********************/
  // const bottomScroll = () => {
  //   let elm = document.documentElement;

  //   //scrollHeight ページの高さ clientHeight ブラウザの高さ
  //   let bottom = elm.scrollHeight - elm.clientHeight;

  //   //垂直方向へ移動
  //   window.scroll({
  //       top: bottom,
  //       behavior: "smooth"
  //   });
  // };

  return {
    isLoading,
    pokemonCards,
    pages,
    handleMovePage,
  }
}
