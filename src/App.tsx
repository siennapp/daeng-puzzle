import { useEffect,  useState } from 'react';
import styled from 'styled-components';
import { getImgType, getPosition, getTargetPosition } from './utils';
import Board from './components/Borad';
import CardList from './components/CardList';
import { fetchImg } from './api';
import useResizeDetector from './hook/useResizeDetector';

const arr:number[] = Array(9).fill(0).map((v,i)=> i );
const RandomArr =  [...arr].sort(()=> Math.random() - 0.5 );

function App() {
 
  const [dogImg, setDogImg] = useState<{src:string, type:string}>({src:'',type:''})
  const [cardArr, setCardArr] = useState<number[]>(RandomArr);
  const [isClear, setClear] = useState<boolean>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [matchArr,setMatchArr] = useState<{id: number,matched: boolean}[]>([])
  const isTouch = useResizeDetector();

  useEffect(()=>{
    NewGameSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{

    const startEventTrigger = isTouch ? 'touchstart' : 'mousedown';
    document.addEventListener(startEventTrigger, onDrag);
    return () => document.removeEventListener(startEventTrigger, onDrag);

     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isTouch])
 
  useEffect(()=>{
    //모든 퍼즐 조각이 알맞은 자리일때 게임 clear
    matchArr.every(puzzle => puzzle.matched) ? setClear(true) : setClear(false)
  },[matchArr])
 
  const onDrag = (startEvent: MouseEvent | TouchEvent) => {
    

    const moveEventTrigger = isTouch ? 'touchmove' : 'mousemove';
    const endEventTrigger = isTouch ? 'touchend' : 'mouseup';
    const puzzleArea = document.querySelector<HTMLElement>('.puzzle-panel');
    const dropAreas = document.querySelectorAll<HTMLElement>('.drop-area');
    let isMove = false; 
    
    const removeHover = () => {
      dropAreas.forEach(dropArea => dropArea.classList.remove('hover'))
    } 

    if (startEvent.cancelable) startEvent.preventDefault();
  
    const pickedItem = startEvent.target as HTMLElement;
    const pickedNum = pickedItem.dataset.number;
    if ( !pickedItem.classList.contains('drag-item')) return
    
    // drag and drop 아이템 만들기
    const movingItem = pickedItem.cloneNode(true) as HTMLElement;
    const {targetX, targetY } = getTargetPosition(pickedItem);
    
    movingItem.classList.add('moving');
    movingItem.style.top = `${targetY}px`;
    movingItem.style.left = `${targetX}px`;
    
    document.body.appendChild(movingItem );
    
    pickedItem.classList.add('invisible')
    let puzzleNum :string | null = null;
    let matchPuzzleArea: HTMLElement;
     
    const onDragMove = (moveEvent: MouseEvent | TouchEvent) => {
      
      if(moveEvent.cancelable ) moveEvent.preventDefault();
      
      isMove = true; 

      const { x, y } = getPosition(startEvent,moveEvent);
      const dropPositionX = targetX + x + movingItem.offsetWidth/2;
      const dropPositionY = targetY + y + movingItem.offsetHeight/2;
      const dropItems = document.elementsFromPoint(dropPositionX, dropPositionY);

      movingItem.style.top = `${targetY + y}px`;
      movingItem.style.left = `${targetX + x}px`;
      
      
      if( !dropItems.includes(puzzleArea!)){
        // drag 퍼즐판 영역 밖일 때 
        removeHover();
        puzzleNum = null;
    
      } else {
        // drag 퍼즐판 영역 안일 때 
        dropAreas && dropAreas.forEach(area => {
          if(dropItems.includes(area)){
            removeHover();
            area.classList.add('hover');
            puzzleNum = area.dataset.number as string
            matchPuzzleArea = area;
          } 
        })
      }
    }
  
    const onDragEnd = () => {
      
      if(pickedItem.parentElement?.classList.contains('drop-area')){
        if(!isMove){
          puzzleNum = pickedNum!
          matchPuzzleArea = pickedItem.parentElement;
        }
        pickedItem.remove();
      }
      
      if(puzzleNum && matchPuzzleArea.childNodes.length === 0){
          
        movingItem.removeAttribute('style');
        matchPuzzleArea.appendChild(movingItem);
        movingItem.classList.remove('moving');
        
        if(pickedItem)  pickedItem.classList.replace('invisible','hide'); 

        if( pickedNum === puzzleNum ) {
          
          let coppiedPuzzle = [...matchArr];
          coppiedPuzzle[Number(puzzleNum)].matched = true;
      
          setMatchArr(coppiedPuzzle);
        } 
          
      } else{
      
        // 다시 카드리스트 자리로 복귀 
        const puzzlelist = document.querySelector('.card-panel') as HTMLElement;
        const puzzleItem = puzzlelist.querySelector(`.img-${pickedNum}`) as HTMLElement;
        
        puzzleItem.classList.replace('hide','invisible');
        
        const {targetX, targetY} = getTargetPosition(puzzleItem);

        movingItem.style.transition = 'all 200ms ease';
        movingItem.style.top = `${targetY}px`;
        movingItem.style.left = `${targetX}px`;
      
        setTimeout(()=>{
          movingItem.remove();
          puzzleItem.classList.remove('invisible');
        },200)

        
        let coppiedPuzzle = [...matchArr];
        coppiedPuzzle[Number(pickedNum)].matched = false;
        setMatchArr(coppiedPuzzle);
        
      }

      removeHover();
      
      document.removeEventListener(moveEventTrigger, onDragMove);
    }
    document.addEventListener(moveEventTrigger, onDragMove, {passive: false})
    document.addEventListener(endEventTrigger, onDragEnd, { once: true })
  }
   
  const NewGameSetting = async () => {
    
    onReset();
    generatePuzzleArr();
    setImgLoading(true);

    const ImgUrl = await fetchImg()

    //이미지 가로형, 세로형 type 지정해서 퍼즐 이미지 css 맞추기
    getImgType(ImgUrl)
      .then(result => {
        setDogImg({ src: ImgUrl, type: result });
        setImgLoading(false);
      })
      
  }
  const onReset = () => {

    setCardArr(RandomArr);
    setClear(false);
    generatePuzzleArr ()

    const cards = document.querySelectorAll('.drag-item');
    cards.forEach( card => card.classList.remove('hide'))
   
  }
  const generatePuzzleArr = () => {
    const dropAreas = document.querySelectorAll<HTMLElement>('.drop-area');
    dropAreas.forEach( dropArea => dropArea.innerHTML = '')
    setMatchArr([...arr].map( v =>({
      id:v,
      matched: false 
    })))
  }
 
  return (
    <Container>
      <Wrap>
        <h1>댕댕이 퍼즐 🐾</h1>
        <BoardWrap>
          <Board dogImg={dogImg} puzzleAreas={matchArr} isClear={isClear} onReset={onReset}/>
        </BoardWrap>
        <WorkSpace>
          <h2>퍼즐 조각</h2>
          <span>조각을 꾹 눌러서 위 퍼즐판에 넣고 뺄 수 있어요!</span>
          <CardWrap>
            <CardList imgLoading={imgLoading} dogImg={dogImg} cardArr={cardArr}/>
          </CardWrap>
          <ButtonWrap>
            <Button onClick={NewGameSetting}>이 사진 그만 볼래요</Button>
            <Button onClick={NewGameSetting}>넘기기</Button>
          </ButtonWrap>
        </WorkSpace>
      </Wrap>
      
    </Container>
  );
}

export default App;


const Container = styled.div`
  width:100%;
  height: 100%;
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
  padding-top: 3vh;
`

const BoardWrap = styled.div`
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
    height: 110px;
    margin: 20px -15px;
    overflow-x: auto;
    overflow-y: hidden;
   
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