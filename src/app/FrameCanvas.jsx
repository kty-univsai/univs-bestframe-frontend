import React, { useEffect, useRef, useState } from 'react';

export const FrameCanvas = ({ props }) => {


    const { frameData, targetObject, relatedObjectIds } = props;

    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [humanList, setHumanList] = useState([])
    const [carList, setCarList] = useState([])


    useEffect(() => {
        setHumanList([])
        setCarList([])
        if (frameData) {
            const img = new Image();
            img.src = "https://studio.univs.ai/image-store" + frameData.frame_image;
            img.onload = () => setImage(img);

            let humanList = [];
            let carList = [];
            
            if (relatedObjectIds) {
                if (relatedObjectIds["human"]) {
                    for (const id of relatedObjectIds["human"]) {
                        frameData.metadata.human.forEach(fd => {
                            if (fd.id == id) {
                                humanList.push(fd);
                            }
                        });
                    }                               
                }                  
                if (relatedObjectIds["car"]) {
                    for (const id of relatedObjectIds["car"]) {
                        frameData.metadata.car.forEach(fd => {
                            if (fd.id == id) {
                                carList.push(fd);
                            }
                        });
                    }                           
                }
            }

            if (targetObject) {
                if (targetObject.type == 'car') {
                    carList.forEach((cl) => {
                        if (cl.id == targetObject.id) {
                            cl.target = true;
                        }
                    });
                }
                else {
                    humanList.forEach((hl) => {
                        if (hl.id == targetObject.id) {
                            hl.target = true;
                        }
                    });
                }
                
            }
            setCarList(carList);
            setHumanList(humanList);

        }         
      }, [frameData, targetObject, relatedObjectIds]);
    
    useEffect(() => {
        if (frameData) {
            const parentWidth = canvasRef.current.parentElement.offsetWidth;
            const parentHeight = canvasRef.current.parentElement.offsetHeight;
            // 이미지 비율 계산
            const imageWidth = frameData.metadata.width;
            const imageHeight = frameData.metadata.height;

            const imageRatio = imageWidth / imageHeight;
            const parentRatio = parentWidth / parentHeight;
      
            let canvasWidth, canvasHeight;
            if (parentRatio > imageRatio) {
              // 부모의 비율이 이미지의 비율보다 클 경우: 높이에 맞추기
              canvasHeight = parentHeight;
              canvasWidth = canvasHeight * imageRatio;
            } else {
              // 부모의 비율이 이미지의 비율보다 작을 경우: 너비에 맞추기
              canvasWidth = parentWidth;
              canvasHeight = canvasWidth / imageRatio;
            }
      
            // 캔버스 크기 설정
            setCanvasSize({ width: canvasWidth, height: canvasHeight });    
        }
        
    }, [image]);

    useEffect(() => {
        drawCanvas();

    }, [image, canvasSize]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!image) return;

        // 출력용 크기 (canvas 크기)
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // 배경 이미지 그리기
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 캔버스를 깨끗이 지운 후
        // ctx.drawImage(image, 0, 0, imageWidth, imageHeight, 0, 0, canvasWidth, canvasHeight); // 이미지를 출력
        ctx.drawImage(image, 0, 0,  canvasWidth, canvasHeight); 
        // JSON 데이터로 받은 rect를 비율에 맞게 그리기

        // 이미지의 원본 크기
        const imageWidth = image.width;
        const imageHeight = image.height;
    
        // 이미지 비율을 계산 (출력 크기 기준으로 비율 계산)
        const scaleX = canvasWidth / imageWidth;
        const scaleY = canvasHeight / imageHeight;

        carList.forEach((car) => {
            const x1 = car.rect[0];
            const y1 = car.rect[1];
            const x2 = car.rect[2];
            const y2 = car.rect[3];

            const scaledX1 = x1 * scaleX;
            const scaledY1 = y1 * scaleY;
            const scaledX2 = x2 * scaleX;
            const scaledY2 = y2 * scaleY;

            ctx.strokeStyle = 'red';  // 선 색상
            ctx.lineWidth = 3;        // 선 두께
            ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
        })


        humanList.forEach((hl) => {
            const x1 = hl.rect[0];
            const y1 = hl.rect[1];
            const x2 = hl.rect[2];
            const y2 = hl.rect[3];

            const scaledX1 = x1 * scaleX;
            const scaledY1 = y1 * scaleY;
            const scaledX2 = x2 * scaleX;
            const scaledY2 = y2 * scaleY;

            ctx.strokeStyle = 'red';  // 선 색상
            ctx.lineWidth = 3;        // 선 두께
            ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
        })

    //     rectData.forEach((rect) => {
    //     const { x1, y1, x2, y2 } = rect;
        
    //     // 비율에 맞게 좌표 변환
    //     const scaledX1 = x1 * scaleX;
    //     const scaledY1 = y1 * scaleY;
    //     const scaledX2 = x2 * scaleX;
    //     const scaledY2 = y2 * scaleY;

    //     // 직사각형 그리기 (strokeRect로 테두리 그리기)
    //     ctx.strokeStyle = 'red';  // 선 색상
    //     ctx.lineWidth = 2;        // 선 두께
    //     ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
    // });
  };

  

  return <canvas 
    ref={canvasRef} 
    width={canvasSize.width}
    height={canvasSize.height}
    style={{
      display: 'block',
      margin: '0 auto',
      backgroundColor: '#f1f1f1', // 배경 색
    }}
  />;
};
