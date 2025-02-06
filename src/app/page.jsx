'use client';

import { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Color } from '@/styles/color';
import axios from 'axios';
import { FrameModal } from '@/app/FrameModal';
import { FrameCanvas } from '@/app/FrameCanvas';

import FaceIcon from '@mui/icons-material/Face';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function MainPage() {
  // const [screenMode, setscreenMode] = useState(1);
  const [frameCarData, setFrameCarData] = useState([]);
  const [frameHumanData, setFrameHumanData] = useState([]);
  const [frameData, setFrameData] = useState([]);
  const [selectedFrameData, setSelectedFrameData] = useState(null);
  const [selectedHumanId, setSelectedHumanId] = useState(-1);
  const [selectedCarId, setSelectedCarId] = useState(-1);
  const [intervalId, setIntervalId] = useState(null); 
  const [modalOpen, setModalOpen] = useState(false);
  const [carPlateNumber, setCarPlateNumber] = useState("");

  const timerRef = useRef(null); 
  const isPressedRef = useRef(false);
  const screenMode = useRef(1);

  const scrollHumanListRef = useRef(null);
  const scrollCarListRef = useRef(null);


  const fetchData = async () => {

    const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bestframe/frames`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiIyNSIsIm9yZ19ncm91cF9pZCI6ImRlNTNhNzIyLTkzNDMtNDllMC1hMmVlLTQ0ZWFjNjlhZmU1NiIsIm5hbWUiOiJ1bml2cyIsImVtYWlsIjoia3R5QHVuaXZzLmFpIiwiaWF0IjoxNzM2Mzk1NDc5LCJleHAiOjM0NzI3OTA5NTh9.XzxfCy3V0wc8MpYO6m6LvT98UESKOrMXayITTJdncpA`, // Bearer 토큰 추가
        'Content-Type': 'application/json' // JSON 형식 지정 (필요 시)
      }
    })

    let human = [];
    let car = [];

    result.data?.rows.slice().reverse().forEach((item)=> {
      item.metadata.human.forEach(h=> {
        h.frame_id = item.id;
        human.push(h)
      });
      item.metadata.car.forEach(c=> {
        c.frame_id = item.id;
        car.push(c)
      });
    });
    setFrameCarData(car);
    setFrameHumanData(human);
    setFrameData(result.data?.rows);

    if (screenMode.current == 1) {
      const frame = result.data?.rows[0];
      setSelectedFrameData(frame);
          
      setTimeout(()=> {
        scrollHumanListRef.current.scrollLeft = scrollHumanListRef.current.scrollWidth;
        scrollCarListRef.current.scrollLeft = scrollCarListRef.current.scrollWidth;      
      },500);
    }
  }

  const displayImage = (image) => {
    const style = {
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      width: '80px',
    };

    return style;
  }

  const selectFrame = (frameId, targetObject = null) => {
    let frame = frameData.find((f)=> {
      return f.id == frameId;
    })
    if (targetObject) {
      frame.targetObject = targetObject;
    }
    setSelectedFrameData(frame);
  }

 

  const fetchInterval = () => {    
    screenMode.current = 1;        
    clearInterval(intervalId);    
    const id = setInterval(()=> {
      fetchData();
    }, 500);

    setIntervalId(id); // intervalId 상태에 저장  
    
  }
  const resetInterval = () => {    
    clearInterval(intervalId);
    setIntervalId(intervalId);
  }

  const handleWheel = (event, scrollContainerRef) => {
    if (scrollContainerRef) {          
      // 휠 이벤트가 수직 스크롤인지 확인
      if (event.deltaY !== 0) {
        // 수평 스크롤 이동
        scrollContainerRef.scrollLeft += event.deltaY;
        event.preventDefault(); // 기본 수직 스크롤 방지
      }
    }
  };

  const humanClass = (human) => {
    let className = '';

    if (human.overlap && human.overlap.length > 0) {
      className += ' overlap'; 
    }

    if (human.id == selectedHumanId ) {
      className += ' active';  
    }

    return className;
  }

  const searchCarPlate = async (carplateNumber) => {
    screenMode.current = 3;
    setCarPlateNumber(carplateNumber)
    clearInterval(intervalId)
    setModalOpen(false)
    const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bestframe/frame/carplate/${carplateNumber}`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiIyNSIsIm9yZ19ncm91cF9pZCI6ImRlNTNhNzIyLTkzNDMtNDllMC1hMmVlLTQ0ZWFjNjlhZmU1NiIsIm5hbWUiOiJ1bml2cyIsImVtYWlsIjoia3R5QHVuaXZzLmFpIiwiaWF0IjoxNzM2Mzk1NDc5LCJleHAiOjM0NzI3OTA5NTh9.XzxfCy3V0wc8MpYO6m6LvT98UESKOrMXayITTJdncpA`, // Bearer 토큰 추가
        'Content-Type': 'application/json' // JSON 형식 지정 (필요 시)
      }
    })

    let human = [];
    let car = [];


    result.data?.data.slice().reverse().forEach((item)=> {
      item.metadata.human.forEach(h=> {
        h.frame_id = item.id;
        human.push(h)
      });
      item.metadata.car.forEach(c=> {
        c.frame_id = item.id;
        car.push(c)
      });
    });
    setFrameCarData(car);
    setFrameHumanData(human);
    setFrameData(result.data?.data);

    // if (screenMode.current == 1) {
      const frame = result.data?.data[0];
      setSelectedFrameData(frame);    
      
      setTimeout(()=> {
        scrollHumanListRef.current.scrollLeft = scrollHumanListRef.current.scrollWidth;
        scrollCarListRef.current.scrollLeft = scrollCarListRef.current.scrollWidth;      
      },500);
    // }

  }

  const selectHumanEvent = (event, human, isModal=false)=> {
    event.preventDefault(); 
    resetInterval();
    screenMode.current = 2;
    setSelectedHumanId(human.id);
    setSelectedCarId(-1);        
    selectFrame(human.frame_id, {
      id: human.id,
      type: 'human',
      relative: {
        human: [human.id]
      }
    });
    if (isModal) {
      setModalOpen(true);
    }    
  }

  const selectCarEvent = (event, car, isModal=false)=> {
    event.preventDefault(); 
    resetInterval();
    screenMode.current = 2;
    setSelectedHumanId(-1)
    setSelectedCarId(car.id)
    selectFrame(car.frame_id, {
      id: car.id,
      type: 'car',
      relative: {
      car: [car.id]
      }
    });                                        
    if (isModal) {
      setModalOpen(true);
    }    
  }

  useEffect(()=> {
    fetchData();
    if (typeof window !== 'undefined') {
      fetchInterval();
    }
    const scrollContainer2 = scrollHumanListRef.current;
    const scrollContainer3 = scrollCarListRef.current;

    const handleWheelForContainer2 = (event) => handleWheel(event, scrollContainer2);
    const handleWheelForContainer3 = (event) => handleWheel(event, scrollContainer3);

    if (scrollContainer2) {
      scrollContainer2.addEventListener('wheel', handleWheelForContainer2);
    }
    if (scrollContainer3) {
      scrollContainer3.addEventListener('wheel', handleWheelForContainer3);
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {

      if (scrollContainer2) {
        scrollContainer2.removeEventListener('wheel', handleWheelForContainer2);
      }
      if (scrollContainer3) {
        scrollContainer3.removeEventListener('wheel', handleWheelForContainer3);
      }
    };

  }, [])


  return (
    <S.Wrapper>
      <S.FrameWrapper>
        <S.FrameViewer onClick={()=> {
          // setscreenMode(1);                    
          fetchInterval();          
        }}>
          <FrameCanvas 
            props={{
              frameData:selectedFrameData,
              targetObject: selectedFrameData && selectedFrameData.targetObject ,
              relatedObjectIds: selectedFrameData && selectedFrameData.targetObject && selectedFrameData.targetObject.relative
            }}            
            carEvent={selectCarEvent}            
            humanEvent={selectHumanEvent}
            

          />
          <div className="controlled">
            {screenMode.current == 1 &&
              <div className="off">
                Live Play
              </div>
            }
            {screenMode.current == 2 &&
              <div className="on">
                Manipulating the screen
              </div>  
            }
            {screenMode.current == 3 &&
              <div className="on-search">
                Search
                <h3 style={{marginTop:'10px'}}>
                {carPlateNumber}
                </h3>
              </div>  
            }
          </div>               
        </S.FrameViewer>
      </S.FrameWrapper>
      <O.Objects>
        <O.ObjectHuman  className="object-wrap">
          <div className="label">
            <DirectionsWalkIcon />
            <span>HUMAN</span>
          </div>
          <div 
            className="scroll-wrap"
            ref={scrollHumanListRef}
          >
            <div className="image-wrap">
            {frameHumanData.map((human) => (
              human.body_image_path && (
                <div
                  key={human.id}
                  className={(humanClass(human))}
                  onContextMenu={(event)=> {
                    selectHumanEvent(event, human, true);
                  }} 
                  onClick={(event)=>{
                    selectHumanEvent(event, human);
                  }}                  
                >
                  {human.face_image_path &&                    
                    <span
                      className="image-box face"
                      style={displayImage(`${process.env.NEXT_PUBLIC_IMAGESTORE_URL}/image-store${human.face_image_path}`)}
                    >
                    </span>
                  }
                  {!human.face_image_path &&                    
                    <span
                      className="image-box face"
                    >                      
                      <FaceIcon />
                    </span>
                  }
                  <span
                    className="image-box body"                    
                    style={displayImage(`${process.env.NEXT_PUBLIC_IMAGESTORE_URL}/image-store${human.body_image_path}`)}
                  ></span>
                  <span className="object-label human">
                    <span>
                      {human.id}
                    </span>                    
                    <div>                      
                    </div>                    
                  </span>
                </div>
              )
            ))}
            </div>
          </div>
        </O.ObjectHuman> 
        <O.ObjectCar className="object-wrap">
          <div className="label">
            <DirectionsCarIcon />
            <span>CAR</span>
          </div>
          <div 
            className="scroll-wrap"
            ref={scrollCarListRef}  
          >
            <div className="image-wrap">
              {frameCarData.map((car)=> (
                <div 
                  key={car.id}
                  onContextMenu={(event)=> {
                    selectCarEvent(event, car, true);
                  }}
                  onClick={(event)=>{
                    selectCarEvent(event, car);
                  }}
                >
                  <span 
                    className={car.id == selectedCarId ? "image-box car active" : "image-box car"}
                    
                    style={displayImage(`${process.env.NEXT_PUBLIC_IMAGESTORE_URL}/image-store${car.image_path}`)}
                  >
                  </span>    
                  <span className="object-label car">
                    <span>
                      {car.id}
                    </span>                    
                    <div></div>                    
                  </span>
                </div>
              ))}
            </div>
          </div>
        </O.ObjectCar> 
       
      </O.Objects>
      <FrameModal
        modalProps={{
          state:modalOpen,
          setState:setModalOpen,
          frameData:selectedFrameData,
          targetObject: selectedFrameData && selectedFrameData.targetObject
        }}       
        searchCarPlate={searchCarPlate} 
      >
        </FrameModal>
    </S.Wrapper>
  );
}

const S = {
  Wrapper: styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: ${Color.Bg100};
    display: flex;
    flex-direction: column;
  `,
  FrameWrapper: styled.div `
    width: 100vw;
    height: 60vh;
    display: flex;
    border-bottom: 1px solid ${Color.Gray100};
  `,
  FrameViewer: styled.div `
    position:relative;
    flex: 1;
    text-align: center; 
    background-color: ${Color.Black};
    img {      
      height: 100%;
    }
    div.controlled {
      position:absolute;
      right: 20px;
      top:20px;
      width:240px;    
      color: ${Color.White};
      font-size: 16px;
      font-weight: bold;
      div.on {
        padding: 15px 0;      
        background-color: ${Color.Red100};
        border-radius: 30px;
      }
      div.off {
        padding: 15px 0;      
        background-color: ${Color.Green100};
        border-radius: 30px;
      }
      div.on-search {
        padding: 15px 0;      
        background-color: ${Color.Primary};
        border-radius: 30px;
      }
    }
  `,

}


const O = {
  Objects: styled.div `
    height:40vh;
    display: flex;
    flex-direction: column;
    div.object-wrap {     
      position:relative;
      display:flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid ${Color.Gray100};
      div.label {
        position: absolute;
        top: 0;
        left: 0;
        width: 60px;
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 60px;    
        background-color: ${Color.Primary};

        svg {
          display:inline-block;
          color: ${Color.White};
          font-size: 32px;
        }
        span{
          padding-top:5px;
          color: ${Color.White};
          font-size: 0.7em;
          text-align: center;
        }      
      }
      div.scroll-wrap {
        position: absolute;
        left: 60px;
        top: 0;  
        right: 0;
        bottom: 0;
        overflow-x: auto;
        overflow-y: hidden;
      }
      div.image-wrap {
        position: absolute;        
        left: 0;
        top: 0;
        display: flex;
        height: 100%;
        white-space: nowrap;
        div {
          position: relative;
          display:flex;
          flex-direction: column;
          box-sizing: border-box;
          border: 2px solid ${Color.White};  
          margin-right: 2px;
          span.image-box {
            width: 80px;
            cursor: pointer;           
            display:flex;
            justify-content:center;
            align-items:center;
          
            &.face {
              height: 80px;
              color: ${Color.Gray200}
            }
            &.body {
              flex: 1;
            }
            &.car {
              height: 100%;
            }
          }
          &.active {           
            border: 2px solid ${Color.Primary2};
          } 
          &.overlap {           
            border: 2px solid ${Color.Red100};
          } 
          &:hover {
            border: 2px solid ${Color.Primary};
          }
        }
        span.object-label {
          > div  {
            position: absolute;
            margin: 0 !important;
            border: none !important;
            top:0;left:0;right:0;bottom:0;            
            opacity: 0.5;
            background-color: ${Color.Black};
            z-index:11;
          }
          > span {
            position:absolute;
            z-index: 20;
            width:100%;            
            margin-top:6px;
            margin-left:2px;
            font-size:12px;
          }
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          z-index: 10;
          color: #fff;
        }
      }      
    }    
  `,

  ObjectHuman: styled.div `
    flex:0.7
  `,
  ObjectCar: styled.div `
    flex:0.3;
    position:relative;
  `,  
}