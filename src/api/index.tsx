export async function fetchImg(){
    return await fetch('https://dog.ceo/api/breeds/image/random')
                    .then( (res) => res.json())
                    .then(({message}) => message);
}