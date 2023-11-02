export async function getImgType(source: string) {
    const img = new Image();

    img.src = source;
    await img.decode();
    
    return img.width > img.height ? 'horizontal': 'vertical'
  }
export async function fetchImg(){
const response = await fetch('https://dog.ceo/api/breeds/image/random');
const {message:src} = await response.json();

return src;
}

export const getPosition = (touched: boolean , sEvent: MouseEvent | TouchEvent, mEvent: MouseEvent | TouchEvent):{x:number,y:number} => {
  if (touched) {
    const se = sEvent as TouchEvent;
    const me = mEvent as TouchEvent;
    return {
      x: me.touches[0].pageX - se.touches[0].pageX,
      y: me.touches[0].pageY - se.touches[0].pageY,
    };
  }
  const se = sEvent as MouseEvent;
  const me = mEvent as MouseEvent;
  return {
    x: me.pageX - se.pageX,
    y: me.pageY - se.pageY,
  };
};