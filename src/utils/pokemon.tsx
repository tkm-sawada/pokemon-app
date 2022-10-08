import axios from 'axios';

export const getPokemon = (url: string) => {
  return (
    axios
    .get(url)
    .then((response) => response.data)
  );
  // return new Promise((resolve, reject) => {
  //   //以下が完了するまで待つことを約束する
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => resolve(data));
  // });
};

export const getImage = (url: string) => {
  // 画像URLが存在しない場合は空文字を返す
  if(url === null){return "/noImage.png";}
  return (
    axios.get(
      url, {responseType: 'blob',}
      )
      .then(res => {
        return URL.createObjectURL(res.data)
      })
  );
  // return new Promise((resolve, reject) => {
  //   //以下が完了するまで待つことを約束する
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => resolve(data));
  // });
};
