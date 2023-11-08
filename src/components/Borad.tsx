import styled from "styled-components";
import { TbReload } from "react-icons/tb";

interface IBorad {
    dogImg: {
        src: string;
        type: string;
    };
    puzzleAreas:{
        id: number;
        matched: boolean;
    }[];
    isClear: boolean;
    onReset: () => void;
}

function Board({dogImg,puzzleAreas,isClear, onReset}:IBorad) {

    return (
        <>
            {isClear&& <ClearBox>CLEAR!</ClearBox>}
            <Refresh onClick={onReset}><TbReload color="orange" size={20}/></Refresh>
            <PuzzleList  
                className={isClear?'puzzle-panel fadeout':'puzzle-panel'}
                bg={dogImg.src} type={dogImg.type}> 
                {puzzleAreas.map( v => 
                <li key={v.id} data-number={v.id} className="drop-area" />)}
            </PuzzleList>
        </>
       
    )
}

export default Board;


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
const Refresh = styled.button`
  width: 30px; 
  height: 30px;
  cursor: pointer;
  background: none; 
  border: 0; 
  margin-bottom: 5px; 
`

const PuzzleList = styled.ul<{bg: string, type:string}>`
  width: 273px; 
  height: 273px;
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
    .moving{
      position: absolute;
    }
  }
`