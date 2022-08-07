export const getPokemon = (url: string) => {
  return new Promise((resolve, reject) => {
    //以下が完了するまで待つことを約束する
    fetch(url)
      .then((res) => res.json())
      .then((data) => resolve(data));
  });
};