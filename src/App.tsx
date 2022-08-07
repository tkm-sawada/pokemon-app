import { useEffect, useState, useContext } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';
import PageButton from './components/pageButton';
import { getPokemon } from './utils/pokemon';
import { NowPageContext } from './components/providers/NowPageProvider';

function App() {
  const initURL: string = "https://pokeapi.co/api/v2/pokemon";
  const [isLoading, setIsloading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonSpecies, setPokemonSpecies] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
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
    pageListup();
  }, [nowPage]);

  /***********************/
  // １匹ごとのポケモンデータ取得
  /***********************/
  const loadPokemon = async (data: any) => {
    let _pokemonData: any = await Promise.all(
      data.map((pokemon: any) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    let _pokemonSpecies: any = await Promise.all(
      _pokemonData.map((pokemon: any) => {
        let pokemonSpecies = getPokemon(pokemon.species.url);
        return pokemonSpecies;
      })
    );
    let _pokemonTypes: any = await Promise.all(
      _pokemonData.map((pokemon: any, i: number) => {
        let _types = Promise.all(pokemon.types.map((type: any) => {
          let _type = getPokemon(type.type.url);
          return _type;
        }))
        return _types;
      })
    );
    let _pokemonAbilities: any = await Promise.all(
      _pokemonData.map((pokemon: any, i: number) => {
        let _abilities = Promise.all(pokemon.abilities.map((ability: any) => {
          let _ability = getPokemon(ability.ability.url);
          return _ability;
        }))
        return _abilities;
      })
    );
    
    setPokemonData(_pokemonData);
    setPokemonSpecies(_pokemonSpecies);
    setPokemonTypes(_pokemonTypes);
    setPokemonAbilities(_pokemonAbilities);
  };

  /***********************/
  // ページ番号ボタン押下時
  /***********************/
  const handleMovePage = async(props: handleMovePageProps) => {
    setIsloading(true);
    const { pageNum } = props;
    let page = '?offset=' + String(pageNum * 20) + '&limit=20';
    let res: any = await getPokemon(initURL + page);
    loadPokemon(res.results);
    setNowPage(pageNum);
    setIsloading(false);
  };
  

  return (
    <div className="text-center w-full bg-red-200">
      <Navbar />
      <div>
        {isLoading ? (
          "読み込み中です。"
        ) : (
          <>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} 
                            pokemon={pokemon} 
                            species={pokemonSpecies[i]} 
                            types={pokemonTypes[i]} 
                            abilities={pokemonAbilities[i]}/>;
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
