type handleMovePageProps = {
  pageNum: number;
}


interface PokemonCard {
  id: number;
  name: string;
  front_default: string;
  url: string;
  speciesUrl: string;
  typesUrl: string[];
  abilitiesUrl: string[];
}

interface PokemonDetail {
  id: number;
  name: string;
  frontDefault: string;
  frontShiny: string;
  genus: string;
  types: Type[];
  weight: number;
  height: number;
  abilities: string[];
  flavor_texts: FlavorText[];
  status: Status;
}
interface Type {
  typeName: string;
  color: string;
  icon: IconDefinition;
}
interface FlavorText {
  version: string;
  flavor_text: string;
}
interface Status {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}


