export async function getImgType(source: string) {
    const img = new Image();

    img.src = source;
    await img.decode();
    
    return img.width > img.height ? 'horizontal': 'vertical'
  }
export async function fetchImg(){
const response = await fetch('https://dog.ceo/api/breeds/image/random');
const {message:src} = await response.json();

return src
}
