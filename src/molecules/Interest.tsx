import React, { FC } from 'react';

import './interest.scss';

export interface InterestInterface {
    interest: string
    onClick?: () => void
}

export const Interest: FC<InterestInterface> = ({ interest, onClick }) => {
    return <div onClick={onClick} className='interest'>{interest}</div>
}