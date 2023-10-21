import React, { FC, useRef, useState } from 'react';

interface CreateInterestInterface {
    isCreating?: boolean
    onSubmit?: (value: string) => void
    onNewInterest: () => void
}

export const CreateInterest: FC<CreateInterestInterface> = ({ onSubmit, onNewInterest, isCreating }) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>();
    const $onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    if(!isCreating) {
		return <button onClick={onNewInterest} className="interest interest--new">+ Add More</button>
    }

    return (
        <div className='interest interest--creating'>
            <input
                ref={inputRef}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if(e.key === 'Enter') {
                        if(inputRef.current) {
                            inputRef.current.blur();
                        }
                    }
                }}
                onBlur={() => {
                    onSubmit(value);
                    setValue('');
                }}
                autoFocus
                className=''
                type='text'
                onChange={$onChange}
                value={value}
            />
        </div>
    );
}