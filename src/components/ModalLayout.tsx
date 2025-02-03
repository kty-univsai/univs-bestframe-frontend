import React from 'react';
import styled from '@emotion/styled';
import Modal from '@mui/material/Modal';

import { Color } from '@/styles/color';

type TProps = {
  children: React.ReactNode,
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  width: number;
}

export const ModalLayout = ({
  children,
  state,
  setState,
  width
}: TProps) => {
  return(
    <S.Modal
      open={state}
      onClose={() => {setState(false)}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <S.ModalInner className="neo-style-1" style={{width: `${width}px`}}>
        <div className="neo-style-2 none-active">
          {children}
        </div>
      </S.ModalInner>
    </S.Modal>
  )
}

const S = {
  Modal: styled(Modal)`
    h2{
      text-align: center;
      margin-bottom: 20px;
    }
  `,
  ModalInner: styled.div`
    border: 2px solid ${Color.Primary};
    padding: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${Color.Bg100};
    outline: none;
    box-shadow: 1px 1px 10px #0000004a;
    border-radius: 28px;
    > div{
      padding: 20px;
    }
    @media (max-width: 768px) {
      width: 95% !important;
      > div{
        padding: 20px 10px;
      }
    }
  `,
}