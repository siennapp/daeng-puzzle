import styled from "styled-components";
import Loading from "./Loading";

interface ICardList {
    imgLoading: boolean;
    dogImg:{
        src: string;
        type: string;
    };
    cardArr: number[]
}

function CardList({imgLoading, dogImg, cardArr }:ICardList){

    return (
        <List className='card-panel'>
            {imgLoading&&<Loading />}
            {cardArr&& cardArr.map( v => (
            <CardItem
                key={v} 
                data-number={v}
                bg={dogImg.src} type={dogImg.type} 
                className={`drag-item img-${v}`}
            />
            ))}
        </List>
    )
}

export default CardList;


const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  height: 100%;
  position: relative;
  > div{
    margin: 0px;
  }
  @media (max-width: 500px) {
    flex-wrap: nowrap;
    padding: 5px;
    height: 100%;
    >div{
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
  background-size: ${props => props.type === 'vertical' ? '273px auto': 'auto 273px'};
  transition: transform .2s; 
  transform: scale(0.8);
  cursor: pointer;
  &.moving{
    position: fixed; 
    z-index: 55;
    opacity: .9;
    transform: scale(1);
    //transition: all .2s;
  }
  &.invisible{
    opacity: 0;
  }
  &:hover{
    transform: scale(1);
    box-shadow: 0px 0px 12px 2px rgba(0,0,0,0.3);
  }
 
  &.hide{
    max-width: 0;
  }
  &.show{
    display: block;
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