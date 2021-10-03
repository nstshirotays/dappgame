import Name from './name.json'

export default function getUserProp(account) {
  if ( !account) {
    return {
      name: "",
      bcolor: "lightgray",
      fcolor: "black"
    }
  } else {
  
  const R = parseInt(account.substr( 2, 2 ), 16)
  const G = parseInt(account.substr( 4, 2 ), 16)
  const B = parseInt(account.substr( 6, 2 ), 16)

  function chooseTextColor( red,green,blue) {
    const toRgbItem = item => {
      const i = item / 255
      return i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4)
    }
    const R = toRgbItem(red)
    const G = toRgbItem(green)
    const B = toRgbItem(blue)
    const Lbg = 0.2126 * R + 0.7152 * G + 0.0722 * B
   
    // 白と黒の相対輝度。定義からそれぞれ 1 と 0 になる。
    const Lw = 1
    const Lb = 0
   
    // 白と背景色のコントラスト比、黒と背景色のコントラスト比を
    // それぞれ求める。
    const Cw = (Lw + 0.05) / (Lbg + 0.05)
    const Cb = (Lbg + 0.05) / (Lb + 0.05)
   
    // コントラスト比が大きい方を文字色として返す。
    return Cw < Cb ? 'black' : 'white'
  } 
  
  return { 
    name: Name.name[parseInt(account.substr( 2, 2 ), 16)],
    bcolor: "rgb("+R+","+G+","+B+")",
    fcolor: chooseTextColor( R,G,B)
  }
  }  
} 

