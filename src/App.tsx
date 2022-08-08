import { useEffect, useState, useContext, useCallback } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';
import PageButton from './components/pageButton';
import { getPokemon } from './utils/pokemon';
import { NowPageContext } from './components/providers/NowPageProvider';

function App() {
  const initURL: string = "https://pokeapi.co/api/v2/pokemon";
  const [isLoading, setIsloading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [pages, setPages] = useState([0]);
  const maxPage = 10;
  
  const { nowPage, setNowPage } = useContext(NowPageContext);

  /***********************/
  // 初期処理(１回だけ)
  /***********************/
  useEffect(() => {
    const fetchPokemonData = async () => {
      //すべてのポケモンデータを取得
      let res: any = await getPokemon(initURL);
      //各ポケモンの詳細情報を取得
      loadPokemon(res.results);
      setNowPage(1);
      setIsloading(false);
    }
    fetchPokemonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**********************************************/
  // ページ番号リストアップ(現在ページが変更されたとき)
  /**********************************************/
  useEffect(() => {
    const pageListup = () => {
      let startPage = nowPage - 3;
      if(startPage < 1){
        startPage = 1;
      }
      let pageNum: number[] = [];
      for (let i: number = startPage; i < startPage + maxPage; i += 1) {
        pageNum = [...pageNum, i]
      }
      setPages(pageNum);
    }
    const pokemonReload = async() => {
      setIsloading(true);
      let page = '?offset=' + String((nowPage - 1) * 20) + '&limit=20';
      let res: any = await getPokemon(initURL + page);
      loadPokemon(res.results);
      setIsloading(false);
    }
    pageListup();
    pokemonReload();
  }, [nowPage]);

  /***********************/
  // １匹ごとのポケモンデータ取得
  /***********************/
  const loadPokemon = useCallback(async(data: any) => {
    // ポケモン１匹分の情報を取得
    let _pokemonData: any = await Promise.all(
      data.map((pokemon: any) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    // ポケモン１匹分に紐づく種族情報を取得
    let _pokemonSpecies: any = await Promise.all(
      _pokemonData.map((pokemon: any) => {
        let pokemonSpecies = getPokemon(pokemon.species.url);
        return pokemonSpecies;
      })
    );
    // ポケモン１匹分に紐づくタイプ情報を取得
    let _pokemonTypes: any = await Promise.all(
      _pokemonData.map((pokemon: any) => {
        let _types = Promise.all(pokemon.types.map((type: any) => {
          let _type = getPokemon(type.type.url);
          return _type;
        }))
        return _types;
      })
    );
    // ポケモン１匹分に紐づく特性情報を取得
    let _pokemonAbilities: any = await Promise.all(
      _pokemonData.map((pokemon: any) => {
        let _abilities = Promise.all(pokemon.abilities.map((ability: any) => {
          let _ability = getPokemon(ability.ability.url);
          return _ability;
        }))
        return _abilities;
      })
    );
    
    // データ結合
    _pokemonData = _pokemonData.map((pokemon: any, i: number) => {
      // 種族情報結合
      pokemon.species = _pokemonSpecies[i];
      // タイプ情報結合
      pokemon.types = _pokemonTypes[i];
      // 特性情報結合
      pokemon.abilities = _pokemonAbilities[i];
      return pokemon;
    })
    
    setPokemonData(_pokemonData);
  }, []);

  /***********************/
  // ページ番号ボタン押下時
  /***********************/
  const handleMovePage = async(props: handleMovePageProps) => {
    const { pageNum } = props;
    // ポケモンデータをクリア（残ってるとレンダリング時に前のページのポケモン情報が見えてしまう）
    setPokemonData([]);
    // 押下したページ番号をセット
    setNowPage(pageNum);
  };

  /***********************/
  // ページ番号ボタン押下時
  /***********************/
  const bottomScroll = () => {
    let elm = document.documentElement;

    //scrollHeight ページの高さ clientHeight ブラウザの高さ
    let bottom = elm.scrollHeight - elm.clientHeight;

    //垂直方向へ移動
    window.scroll({
        top: bottom,
        behavior: "smooth"
    });
  };
  

  return (
    <div className="text-center w-full bg-red-200">
      <Navbar />
      <button type="button" onClick={() => bottomScroll()} className="fixed right-1 bottom-1 flex-1 mx-4 py-3 px-4 text-white bg-red-800 border-0 hover:bg-red-500 bg-opacity-50 rounded-xl text-xl shadow-2xl">↓</button>
      <div>
        {isLoading ? (
          "読み込み中です。"
        ) : (
          <>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <PageButton pages={pages} 
                        handleMovePage={handleMovePage}/>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
