import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { ModalLayout } from '@/components/ModalLayout';
import { Color } from '@/styles/color';
import { FrameCanvas } from '@/app/FrameCanvas';
import { Button } from '@mui/material';

export const FrameModal = ({modalProps, searchCarPlate}) => {

  const { state, setState, frameData,  targetObject} = modalProps;
  const [targetData, setTargetData] = useState(null);
  const [humanData, setHumanData] = useState([]);
  const [carData, setCarData] = useState([]);
  // const [relatedObjectIds, setrelatedObjectIds] = useState(null);
  const fetchData = async () => {
    let relatedObjectIds = {
      car: [],
      human: []
    };
    const result = await axios.get(`https://studio.univs.ai/api-core/bestframe/frame/${frameData.id}`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiIyNSIsIm9yZ19ncm91cF9pZCI6ImRlNTNhNzIyLTkzNDMtNDllMC1hMmVlLTQ0ZWFjNjlhZmU1NiIsIm5hbWUiOiJ1bml2cyIsImVtYWlsIjoia3R5QHVuaXZzLmFpIiwiaWF0IjoxNzM2Mzk1NDc5LCJleHAiOjM0NzI3OTA5NTh9.XzxfCy3V0wc8MpYO6m6LvT98UESKOrMXayITTJdncpA`, // Bearer 토큰 추가
        'Content-Type': 'application/json' // JSON 형식 지정 (필요 시)
      }
    });

    let newHumanData = [];
   
    if (targetObject.type == 'car') {
      for (const hd of result.data.humans) {
        for (const fmh of frameData.metadata.human) {        
          if (hd.id == fmh.id) {
            if (fmh.overlap && targetObject.type == 'car') {
              const idx = fmh.overlap.findIndex((f)=> {
                return targetObject.id == f;
              })            
              if (idx == -1) {
                continue;
              }
            }
            
            const nhd1 = {
              body_image_path: fmh.body_image_path,
              overlap: fmh.overlap,
              ...hd
            }
            newHumanData.push(nhd1);
            relatedObjectIds.human.push(nhd1.id);
          }
        }
      }
      setHumanData(newHumanData);  
    }
    else if (targetObject.type == 'human') {
     
      for (const hd of result.data.humans) {
        for (const fmh of frameData.metadata.human) {        
          if (hd.id == fmh.id && hd.id == targetObject.id) {          
            const nhd1 = {
              body_image_path: fmh.body_image_path,
              overlap: fmh.overlap,
              ...hd
            }
            newHumanData.push(nhd1);
            relatedObjectIds.human.push(nhd1.id);
          }
        }
      }

      setHumanData(newHumanData);  
    }
    
    if (targetObject && targetObject.type == 'car') {
      const data = frameData.metadata.car.find((c) => {        
        return c.id == targetObject.id;
      })  
      const data2 = result.data.cars.find((c)=> {
        return c.id == targetObject.id;
      })
      
      relatedObjectIds.car.push(data.id);

      setTargetData({
        ...data,
        carplate_number: data2.carplate_number,
        attributes: data2.attributes
      });      
    }
    else if (targetObject && targetObject.type == 'human') {
      const data = newHumanData.find((c) => {
        return c.id == targetObject.id;
      })
 
      if (data.overlap) {
        let carData = []
        for (const fc of result.data.cars) {
          for (const fmc of frameData.metadata.car) {
            const idx = data.overlap.findIndex((o)=> {
              return o == fmc.id;
            });          
            if (idx > -1 && fmc.id == fc.id) {
              carData.push({
                ...fmc,
                carplate_number: fc.carplate_number,
                attributes: fc.attributes
              })
            } 
          }        
        }
        carData.forEach((cd)=> {
          relatedObjectIds.car.push(cd.id);
        });
        setCarData(carData);
      }
         
      setTargetData(data);
    }  
    frameData.relatedObjectIds = relatedObjectIds;
    // setrelatedObjectIds(relatedObjectIds);
    // setFrameImage("https://studio.univs.ai/image-store" + frameData.frame_image);
  };

  const handleClose = () => {
    setState(false);
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


  useEffect(() => {
    setHumanData([]);
    setCarData([]);
    fetchData();
  }, [state]);

  return(
    <ModalLayout state={state} setState={setState} width={1440}>
      <S.Wrapper>
        <S.Objects>
          <S.Target>
           
            {targetObject && targetObject.type == "human" &&
             <>
              <div>
                {targetData && targetData.face_image_path &&
                  <div className="image-box"
                    style={displayImage("https://studio.univs.ai/image-store" + targetData.face_image_path)}>

                  </div>
                }
                {targetData && targetData.body_image_path &&
                  <div className="image-box body" 
                    style={displayImage("https://studio.univs.ai/image-store" + targetData.body_image_path)}>                  
                  </div>
                }
              </div>
              <S.DataList>
                <ul>
                  <li className="data-list"><span>GENDER:</span>{targetData && targetData?.apparent_gender == 1 ? 'MALE' : 'FEMALE'}</li>
                  <li className="data-list"><span>AGE:</span>{targetData && targetData?.apparent_age}</li>
                </ul>
              </S.DataList>
            </>
            }
            {targetObject && targetObject.type == "car" &&
              <>
                <div>              
                  {targetData && targetData.image_path &&
                    <div className="image-box car" 
                      style={displayImage("https://studio.univs.ai/image-store" + targetData.image_path)}>                  
                    </div>
                  }
                </div>
                <ul>
                  <li></li>
                  <li></li>                
                </ul>
              </>
            }
          </S.Target>
          <S.ObjectList>
            <div>
              <h3>Human</h3>
              <ul className="human-list">
                {humanData.map((hd) => (
                  <li>
                    <div>
                      {hd && hd.face_image_path &&
                        <div className="image-box"
                          style={displayImage("https://studio.univs.ai/image-store" + hd.face_image_path)}>

                        </div>
                      }
                      {hd && hd.body_image_path &&
                        <div className="image-box body" 
                          style={displayImage("https://studio.univs.ai/image-store" + hd.body_image_path)}>                  
                        </div>
                      }
                    </div>
                    <S.DataList>
                      <ul>
                        <li className="data-list"><span>GENDER:</span>{hd && hd?.apparent_gender == 1 ? 'MALE' : 'FEMALE'}</li>
                        <li className="data-list"><span>AGE:</span>{hd && hd?.apparent_age}</li>
                      </ul>
                    </S.DataList>                    
                  </li>
                ))}
              </ul>
            </div>
            {carData.length > 0 && 
              <div style={{marginTop:'20px'}}>
                <h3>Car</h3>
                <ul className="car-list">
                {carData.map((cd) => (
                    <li>
                      <div>                      
                        {cd && cd.image_path &&
                          <div className="image-box car" 
                            style={displayImage("https://studio.univs.ai/image-store" + cd.image_path)}>                  
                          </div>
                        }
                      </div>
                      <S.DataList>
                        <ul>
                          <li className="data-list"><span>PLATE NUMBER:</span>{cd && cd?.carplate_number}</li>
                        </ul>                      
                      </S.DataList>
                      {cd && cd?.carplate_number &&
                        <Button onClick={() => {
                          searchCarPlate(cd?.carplate_number)
                        }}>Search</Button>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            }
          </S.ObjectList>
        </S.Objects>
        <S.Frames>
          <S.TargetFrame>
            <FrameCanvas 
              props={{
                frameData: frameData,
                targetObject: targetObject,
                relatedObjectIds: frameData && frameData.relatedObjectIds
              }}
            />                    
          </S.TargetFrame>
        </S.Frames>
      </S.Wrapper>
    </ModalLayout>
  )
}

const S = {
  Wrapper: styled.div`
    position: relative;
    width: 100%;
    min-height: 760px;
    background-color: ${Color.Bg100};
    display: flex;
    flex-direction: row;
  `,
  Objects: styled.div`
    width: 480px;
    height: 100%;
    padding-right: 15px;
  `,
  Target: styled.div`
    padding: 10px 5px;
    border-bottom: 1px solid ${Color.Gray100};
    display: flex;
    flex-direction: row;
    div.image-box {
      height: 80px;
      &.body {
        height: 140px;
      }
      &.car {
        width: 210px !important;
        height: 120px;
      }
    }
  `,
  ObjectList: styled.div`
    padding: 10px 5px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 600px;
    ul.human-list {
      margin-top:15px;
      li {
        display:flex;
        flex-direction:row;
        div.image-box {
          height: 80px;
          &.body {
            height: 140px;
          }
        }
      }
    }
    ul.car-list {
      margin-top:15px;
      li {
        display:flex;
        flex-direction:row;
        div.image-box {
          &.car {
            width: 140px !important;
            height: 70px;
          }
        }
      }
    }
  `,
  DataList: styled.div`    
    margin-left:15px;
    flex: 1;
    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      li.data-list {    
        display:flex;   
        margin-bottom: 5px;
        flex-direction: column;
        span {
          margin-left: -5px;
          display: block;
          width: 100%;
          color: ${Color.Gray300}
        }
      }
  }
  `,

  Frames: styled.div`
    flex:1;
  `,
  TargetFrame: styled.div`
    background-color: ${Color.Black};
    display:flex;
    width: 100%;
    min-height: 100%;
    justify-content:center;
    align-items:center; 
  `
}