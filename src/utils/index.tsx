export async function getImgType(source: string) : Promise <string> {
    const img = new Image();
    img.src = source;
    await img.decode();
    
    return img.width > img.height ? 'horizontal': 'vertical'
  }


export const getPosition = ( sEvent: MouseEvent | TouchEvent, mEvent: MouseEvent | TouchEvent):{x:number,y:number} => {
  const isTouch = sEvent.type === 'touchstart';
  
  if (isTouch ) {
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

export const getTargetPosition = ( target : HTMLElement ):{targetX:number,targetY:number} => {
  return {
    targetX: target?.getBoundingClientRect().x,
    targetY: target?.getBoundingClientRect().y
  } 
};