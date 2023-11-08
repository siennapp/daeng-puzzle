import { useEffect,  useState } from 'react';

function useResizeDetector ():boolean {

    const [isTouch,setIsTouch] = useState<boolean >(false);

    function handleResize(){
        navigator.maxTouchPoints === 0? setIsTouch(false): setIsTouch(true);
    }
    useEffect(()=>{
        handleResize()
    },[])
    useEffect(()=>{
        console.log('resize')
        window.addEventListener('resize',handleResize);
        return () => {
          window.removeEventListener('resize',handleResize)
        }
    })
   
    return isTouch;
}

export default useResizeDetector; 