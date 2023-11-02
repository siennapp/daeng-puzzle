import { useEffect,  useState } from 'react';
import styled from 'styled-components';
import { TbReload } from "react-icons/tb";
import Loading from './components/Loading';
import { fetchImg, getImgType } from './utils';


const PuzzleArr:number[] = Array(9).fill(0).map((v,i)=> i );
const RandomArr =  [...PuzzleArr].sort(()=> Math.random() - 0.5 );

function App() {
  const [dogImg, setDogImg] = useState<{src:string, type:string}>({src:'',type:''})
  const [cardArr, setCardArr] = useState<number[]>(RandomArr)
  const [isTouch,setIsTouch] = useState<Boolean | null>(null);
  const [isClear, setClear] = useState<Boolean>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true)
  useEffect(()=>{
    navigator.maxTouchPoints === 0? setIsTouch(false): setIsTouch(true);
    reloadImage();
  },[])
  useEffect(()=>{
    cardArr?.length === 0 ? setClear(true): setClear(false);
  },[cardArr])
  const dropAreas = document.querySelectorAll<HTMLElement>('.drop-area') ;
  const startEventTrigger = isTouch ? 'touchstart' : 'mousedown';
  const moveEventTrigger = isTouch ? 'touchmove' : 'mousemove';
  const endEventTrigger = isTouch ? 'touchend' : 'mouseup';
  
  
  const onDrag = (startEvent: MouseEvent | TouchEvent) => {
     
    let matchPuzzle: HTMLElement;
    
    const pickedItem = startEvent.target as HTMLElement;
    const pickedNum = pickedItem.dataset.number;
 
    const movingItem = pickedItem.cloneNode(true) as HTMLElement;
  
    const itemRect = pickedItem.getBoundingClientRect();
    movingItem.classList.add('moving');
    movingItem.style.top = `${itemRect.top}px`;
    movingItem.style.left = `${itemRect.left}px`;
    
    document.body.appendChild(movingItem );

    pickedItem.classList.add('invisible')
    let puzzleNum :string;
    const onDragMove = (moveEvent: MouseEvent | TouchEvent) => {
      const { x, y } = getPosition(startEvent,moveEvent) 

      movingItem.style.top = `${itemRect.top + y}px`;
      movingItem.style.left = `${itemRect.left + x}px`;


   
      const dropPositionX = itemRect.left + x +itemRect.width/2;
      const dropPositionY = itemRect.top + y +itemRect.height/2;
      const dropItems = document.elementsFromPoint(dropPositionX, dropPositionY)
      
      dropAreas.forEach(area => {
        area.classList.remove('hover')
        let matchArea = dropItems.includes(area);
        if(matchArea){
          area.classList.add('hover')
          puzzleNum = area.dataset.number as string
          matchPuzzle = area; 
        }
      })
      
    }
    const onDragEnd = () => {
      if(pickedNum === puzzleNum){
        movingItem.classList.remove("moving","drag-item");
        movingItem.removeAttribute('style');
        //console.log(movingItem)
         matchPuzzle.appendChild(movingItem);
         
         const fileteredArr = cardArr?.filter(v => v !== Number(pickedNum) )
         setCardArr(fileteredArr)
        //pickedItem.remove();
      } else{
        movingItem.style.top = `${itemRect.top}px`;
        movingItem.style.left = `${itemRect.left}px`;
        pickedItem.classList.remove('invisible')
        setTimeout(()=>{
          movingItem.remove();
        },100)
      }
      dropAreas.forEach(area => {
        area.classList.remove('hover')})
      document.removeEventListener(moveEventTrigger, onDragMove)
    }

    document.addEventListener(moveEventTrigger, onDragMove)
    document.addEventListener(endEventTrigger, onDragEnd, { once: true })
   
   }
   const getPosition = (sEvent: MouseEvent | TouchEvent, mEvent: MouseEvent | TouchEvent):{x:number,y:number} => {
    if (isTouch) {
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
   
   
  useEffect(()=>{
    const dragItems: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.drag-item');
    dragItems.forEach(item => item.addEventListener(startEventTrigger, onDrag))
    return () =>  dragItems.forEach(item => item.removeEventListener(startEventTrigger, onDrag))
  })

function reloadImage(){
    onRefresh() 
    setImgLoading(true)
   
    fetchImg()
    .then( url => {
      getImgType(url)
      .then(result => setDogImg({ src: url, type: result }))
      .then(()=>{
        setImgLoading(false)
      })
    
    }).catch(err => console.log(err))
   
    
  }

  function onRefresh(){
    setCardArr(RandomArr);
    dropAreas.forEach(area => {
      area.innerHTML = ''
    })
  }
  return (
    <Container>
      <Wrap>
        <h1>댕댕이 퍼즐 🐾</h1>
      
        <PuzzleWrap>
          <Refresh onClick={onRefresh}><TbReload color="orange" size={20}/></Refresh>
          {isClear&& <ClearBox>CLEAR!</ClearBox>}
          <PuzzleList 
            className={isClear?'fadeout':''}
            bg={dogImg.src} type={dogImg.type}> 
            {PuzzleArr.map( v => 
              <li key={v} data-number={v} className="drop-area" />)}
          </PuzzleList>
        </PuzzleWrap>
        <WorkSpace>
          <h2>퍼즐 조각</h2>
          <span>조각을 꾹 눌러서 위 퍼즐판에 넣고 뺄 수 있어요!</span>
          <CardWrap>
            <CardList>
              {imgLoading&&<Loading />}
              {cardArr&& cardArr.map( v => (
                <CardItem
                  bg={dogImg.src} type={dogImg.type} 
                  className={`drag-item img-${v}`}
                  key={v} 
                  data-number={v} 
                />
              ))}
            </CardList>
          </CardWrap>
          <ButtonWrap>
            <Button onClick={reloadImage}>이 사진 그만 볼래요</Button>
            <Button onClick={reloadImage}>넘기기</Button>
          </ButtonWrap>
        </WorkSpace>
      </Wrap>
      
    </Container>
  );
}

export default App;


const Container = styled.div`
  width:100%;
  min-height: 100vh; 
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333; 

`


const Wrap = styled.div`
  width: 500px;
  max-width: 100%; 
  /* padding: 0 15px;  */
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`
const Refresh = styled.button`
  width: 30px; 
  height: 30px;
  cursor: pointer;
  background: none; 
  border: 0; 
  margin-bottom: 5px; 
`
const PuzzleWrap = styled.div`
  width: 270px; 
  background: #fff; 
  background-size: 100%;
  overflow: hidden;
  margin-bottom: 4vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
`
const ClearBox = styled.div`
    width: 180px;
    height: 70px;
    color: orange;
    background: rgba(0,0,0,0.7);
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: 20px;
    transform: translate(-50%,-50%);
    font-size: 2.75rem;
    font-weight: bold;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
`
const PuzzleList = styled.ul<{bg: string, type:string}>`
  width: 270px; 
  height: 270px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  background-image: url(${props=> props.bg});
  background-size: ${props => props.type === 'vertical' ? '270px auto': 'auto 270px'};
  background-repeat: no-repeat;
  border-radius: 16px;
  overflow: hidden;
  
  &.fadeout{
    li{
      opacity: 0;
    } 
  }
  li{
    background: #f1f0f1;
    border: solid 1px #ffffff;
    position: relative;
    overflow: hidden;
    transition: all .2s;
    &.hover{
      background: #d2d1d1;
    }
    > div{
      transform: scale(1) !important;
      cursor: pointer;
    }
  }
`
const WorkSpace = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 15px;
`
const CardWrap = styled.div`
  width: 100%;
  height: 200px;
  background: #f1f0f1;
  margin-top: 20px; 
  margin-bottom: 20px;
  @media (max-width: 500px) {
    width: 100vw;
    /* padding: 0 15px; */
    height: 120px;
    margin: 20px -15px;
    overflow-x: auto;
    overflow-y: hidden;
   
  }
`
const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  height: 100%;
  position: relative;
  > div{
    margin: 0px;
  }
  @media (max-width: 500px) {
    /* margin-left: -15px; 
    margin-right: -15px; */
    flex-wrap: nowrap;

    /* width: 830px; */
    height: 100%;
    >div{
      /* width: 90px !important;  */
      flex-shrink: 0;
    
    }
  }
`
const CardItem = styled.div<{bg: string, type:string}>`
  width: 90px;
  height: 90px;
  position: relative;

  background-image: url(${props=> props.bg}); ;
  background-repeat: no-repeat;
  // background-size: auto 270px;
  background-size: ${props => props.type === 'vertical' ? '270px auto': 'auto 270px'};
  transition: transform .2s; 
  transform: scale(0.8);
  cursor: pointer;
  &.moving{
    position: fixed; 
    z-index: 55;
    opacity: .9;
  }
  &.invisible{
    opacity: 0;
  }
  &:hover{
    transform: scale(1);
    box-shadow: 0px 0px 12px 2px rgba(0,0,0,0.3);
  }
  &.moving{
    position: fixed; 
    z-index: 55;
    opacity: .9;
  }
  &.invisible{
    opacity: 0;
  }
  &.img-1{
    background-position: -91px 0;
  }
  &.img-2{
    background-position: -182px 0;
  }
  &.img-3{
    background-position:  0 -91px;
  }
  &.img-4{
    background-position: -91px -91px;
  }
  &.img-5{
    background-position: -182px -91px;
  }
  &.img-6{
    background-position:  0 -182px;
  }
  &.img-7{
    background-position: -91px -182px;
  }
  &.img-8{
    background-position: -182px -182px;
  }
`
const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const Button = styled.button`
  border-radius: 8px;
  border: 0;
  padding: 7px 12px;
  color:#ffffff; 
  background: orange;
  cursor: pointer; 
  opacity: 0.85;
  transition: .2s;
  &:hover{
    opacity: 1;
  }
`