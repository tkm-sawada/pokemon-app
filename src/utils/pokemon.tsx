import axios from 'axios'

// ポケモンの基本情報を取得
export const getPokemon = (url: string) => {
  return axios.get(url).then((response) => response.data)
  // return new Promise((resolve, reject) => {
  //   //以下が完了するまで待つことを約束する
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => resolve(data));
  // });
}

// 画像データを取得
export const getImage = (url: string) => {
  // 画像URLが存在しない場合は空文字を返す
  if (url === null) {
    return ''
  }
  return axios.get(url, { responseType: 'blob' }).then((res) => {
    return URL.createObjectURL(res.data)
  })
}
