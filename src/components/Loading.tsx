import {AiOutlineLoading3Quarters} from "react-icons/ai"
import styled, { keyframes } from "styled-components";

function Loading(){
    return (
        <LoadingBox>
            <Spinner color="gray" size={30}/>
        </LoadingBox>
    )
}

export default Loading;

const LoadingBox = styled.div`
    position: absolute; 
    width:100%; 
    height: 100%; 
    left: 0;top:0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f1f0f1;
    z-index: 10;
`
const rotate = keyframes`
    0%{
        transform: rotate(0);
    }

    100%{
        transform: rotate(360deg);
    }
`
const Spinner = styled(AiOutlineLoading3Quarters)`
    animation: ${rotate} 1s infinite;
`
