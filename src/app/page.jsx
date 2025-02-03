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
  
  const [frameCarData, setFrameCarData] = useState([]);
  const [frameHumanData, setFrameHumanData] = useState([]);
  const [frameData, setFrameData] = useState([]);
  const [selectedFrameData, setSelectedFrameData] = useState(null);
  const [selectedHumanId, setSelectedHumanId] = useState(-1);
  const [selectedCarId, setSelectedCarId] = useState(-1);
  const [intervalId, setIntervalId] = useState(null); 
  const [modalOpen, setModalOpen] = useState(false);
  const timerRef = useRef(null); // 타이머를 저장할 ref
  const isPressedRef = useRef(false);

  const scrollFaceListRef = useRef(null);
  const scrollHumanListRef = useRef(null);
  const scrollCarListRef = useRef(null);


  const fetchData = async () => {
    const result = await axios.get("https://studio.univs.ai/api-core/bestframe/frames", {
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

    const frame = result.data?.rows[result.data?.rows.length-1];
    setSelectedFrameData(frame);
    
    setTimeout(()=> {
      scrollFaceListRef.current.scrollLeft = scrollFaceListRef.current.scrollWidth;
      scrollHumanListRef.current.scrollLeft = scrollHumanListRef.current.scrollWidth;
      scrollCarListRef.current.scrollLeft = scrollCarListRef.current.scrollWidth;
    },500);
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
    clearInterval(intervalId);
    setIntervalId(null);
    let frame = frameData.find((f)=> {
      return f.id == frameId;
    })
    if (targetObject) {
      frame.targetObject = targetObject;
    }
    setSelectedFrameData(frame);
  }

 

  const fetchInterval = () => {
    if (!intervalId) {
      const id = setInterval(()=> {
        fetchData();
      }, 3000);

      setIntervalId(id); // intervalId 상태에 저장

    }     
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

  useEffect(()=> {
    fetchData();
    if (typeof window !== 'undefined') {
      fetchInterval();
    }
    const scrollContainer1 = scrollFaceListRef.current;
    const scrollContainer2 = scrollHumanListRef.current;
    const scrollContainer3 = scrollCarListRef.current;

    const handleWheelForContainer1 = (event) => handleWheel(event, scrollContainer1);
    const handleWheelForContainer2 = (event) => handleWheel(event, scrollContainer2);
    const handleWheelForContainer3 = (event) => handleWheel(event, scrollContainer3);

    if (scrollContainer1) {
      scrollContainer1.addEventListener('wheel', handleWheelForContainer1);
    }
    if (scrollContainer2) {
      scrollContainer2.addEventListener('wheel', handleWheelForContainer2);
    }
    if (scrollContainer3) {
      scrollContainer3.addEventListener('wheel', handleWheelForContainer3);
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      if (scrollContainer1) {
        scrollContainer1.removeEventListener('wheel', handleWheelForContainer1);
      }
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
        <S.FrameViewer>
          <FrameCanvas 
            props={{
              frameData:selectedFrameData,
              targetObject: selectedFrameData && selectedFrameData.targetObject ,
          relatedObjectIds: selectedFrameData && selectedFrameData.targetObject && selectedFrameData.targetObject.relative
            }}
          />               
        </S.FrameViewer>
      </S.FrameWrapper>
      <O.Objects>
       
        <O.ObjectFace  className="object-wrap">
          <div className="label">
            <FaceIcon />
            <span>FACE</span>
          </div>
          <div 
            className="scroll-wrap"
            ref={scrollFaceListRef}
          >
            <div className="image-wrap">
            {frameHumanData.map((human) => (
              human.face_image_path && (
                <span
                  className={human.id == selectedHumanId ? "image-box active" : "image-box"}
                  onMouseDown={()=>{
                    setSelectedHumanId(human.id);
                    setSelectedCarId(-1);        
                    selectFrame(human.frame_id, {
                      id: human.id,
                      type: 'human',
                      relative: {
                        human: [human.id]
                      }
                     });
                     isPressedRef.current = false; 
                     timerRef.current = setTimeout(() => {
                       isPressedRef.current = true; 
                       setModalOpen(true);
                       
                    }, 500); // 1초 후에 이벤트 발생
                  }}
                  onMouseUp={()=>{
                    clearTimeout(timerRef.current); // 타이머 취소                    
                  }}
                  onMouseLeave={() => {
                    clearTimeout(timerRef.current);
                  }}
                  style={displayImage("https://studio.univs.ai/image-store" + human.face_image_path)}
                ></span>
              )
            ))}
            </div>
          </div>
        </O.ObjectFace>
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
                <span
                  className={human.id == selectedHumanId ? "image-box active" : "image-box"}

                  onMouseDown={()=>{
                    setSelectedHumanId(human.id);
                    setSelectedCarId(-1);        
                    selectFrame(human.frame_id, {
                      id: human.id,
                      type: 'human',
                      relative: {
                        human: [human.id]
                      }
                     });
                     isPressedRef.current = false; 
                     timerRef.current = setTimeout(() => {
                       isPressedRef.current = true; 
                       setModalOpen(true);
                       
                    }, 500); // 1초 후에 이벤트 발생
                  }}
                  onMouseUp={()=>{
                    clearTimeout(timerRef.current); // 타이머 취소                    
                  }}
                  onMouseLeave={() => {
                    clearTimeout(timerRef.current);
                  }}
                  style={displayImage("https://studio.univs.ai/image-store" + human.body_image_path)}
                ></span>
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
                <span 
                className={car.id == selectedCarId ? "image-box active" : "image-box"}

                  onMouseDown={()=>{
                    setSelectedHumanId(-1)
                    setSelectedCarId(car.id)
                    selectFrame(car.frame_id, {
                      id: car.id,
                      type: 'car',
                      relative: {
                       car: [car.id]
                       }
                     });                    
                     isPressedRef.current = false; 
                    timerRef.current = setTimeout(() => {
                      isPressedRef.current = true; 
                      setModalOpen(true);
                      
                   }, 500); // 1초 후에 이벤트 발생
                 }}
                 onMouseUp={()=>{
                   clearTimeout(timerRef.current); // 타이머 취소                    
                 }}
                 onMouseLeave={() => {
                   clearTimeout(timerRef.current);
                 }}
                  style={displayImage("https://studio.univs.ai/image-store" + car.image_path)}
                >
                </span>    
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
    flex: 1;
    text-align: center; 
    background-color: ${Color.Black};
    img {      
      height: 100%;
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

        span.image-box {
          width: 80px;
          height: 100%;
          margin-right: 2px;  
          cursor: pointer;
          box-sizing: border-box;
          &.active {           
            border: 2px solid ${Color.Primary2};
          } 
          &:hover {
            border: 2px solid ${Color.Primary};
          }     
        }
      }      
    }    
  `,
  ObjectFace: styled.div `
    flex:0.3
  `,
  ObjectHuman: styled.div `
    flex:0.4
  `,
  ObjectCar: styled.div `
    flex:0.3
  `,  
}