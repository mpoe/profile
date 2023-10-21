import './App.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import profileData from './data/data.json';
import { Interest } from './molecules/Interest';
import { CreateInterest } from './molecules/create';

const birthdayRegex = /^[\d]{4}-[\d]{2}-[\d]{2}$/;

type FormDataType = {
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	birthday: string,
	interests: Array<string>,
}

const schema = yup.object({
	firstName: yup.string().required(),
	lastName: yup.string().required(),
	email: yup.string().required(),
	phoneNumber: yup.string().required(),
	birthday: yup.string().matches(birthdayRegex),
	interests: yup.array().of(yup.string())
})

type ModalType = {
	title: string,
	message: string,
	onConfirm: () => void,
}

const defaultModalState = {
	title: '',
	message: '',
	onConfirm: () => {},
}

function App() {
	const [modal, setModal] = useState<ModalType>(defaultModalState);
	const [data, setData] = useState<FormDataType>(null);
	const [creatingNewInterest, setIsCreatingNewInterest] = useState(false);
	const [image, setImage] = useState<string>(null);
	const [showHover, setShowHover] = useState(false);
	const [isEdittingProfile, setIsEdittingProfile] = useState(false);
    const imageInput = useRef<HTMLInputElement>();
	const modalRef = useRef<HTMLDialogElement>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema)
	})

	useEffect(() => {
		setTimeout(() => {
			setData(profileData);
		}, 500);
	}, [])

	const $removeInterest = (index: number) => {
		setData({
			...data,
			interests: data.interests.filter((interest, i) => i !== index)});
	}

	const $createNewInterest = () => {
		setIsCreatingNewInterest(true);
	}

	const $onCreateNewInterest = (value: string): null => {
		if(value === '') {
			setIsCreatingNewInterest(false);
			return null;
		}
		// should validate the value if it exists in the array?
		setData({
			...data,
			interests: [...data.interests, value]
		})
		setIsCreatingNewInterest(false);
		return null;
	}

	const $showHover = () => {
		setShowHover(true);
	}

	const $hideHover = () => {
		setShowHover(false);
	}

	const $displayForm = () => {
		setIsEdittingProfile(true);
	}

	const $handleSubmit = (formData: FormDataType) => {
		console.log('errors', errors);
		console.log('formData', formData);
		setData({...data, ...formData});
		setIsEdittingProfile(false);
	}

	const $closeDialog = () => {
		setModal(defaultModalState);
		modalRef.current.close();
	}

	const $handleInput = () => {
		if(image) {
			imageInput.current.value = '';
			modalRef.current.showModal();
			setModal({
				title: 'Delete profile photo?',
				message: 'You are about to delete your profile photo, would you like to proceed?',
				onConfirm: () => {
					setImage(null);
					$closeDialog();
				},
			})
			return;
		}
		imageInput.current.click();
	}

	const $handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const src = URL.createObjectURL(e.target.files[0])
		setImage(src);
	}

	if(!data) {
		return <i className="fa fa-circle-o-notch fa-spin"></i>;
	}

	return (
		<div className="profile__wrapper">
			<dialog ref={modalRef} className={`profile__dialog${modal.title!== '' ? ' profile__dialog--show' : ''}`}>
				<div className='profile__dialog__warning'>
					<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 64 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
				</div>
				<h3>{modal.title}</h3>
				<p>{modal.message}</p>
				<div className='profile__dialog__actions'>
					<button onClick={$closeDialog} className='profile__dialog__actions__secondary'>No, keep it</button>
					<button onClick={modal.onConfirm} className='profile__dialog__actions__primary'>Yes, delete it</button>
				</div>
			</dialog>
			<div className="profile__header">
				<div onPointerOver={$showHover} onPointerLeave={$hideHover} className='profile__header__image'>
					<input ref={imageInput} type="file" accept='image/*' className='profile__header__image__input' onChange={$handleImageInput}/>
					{image ? (
						<img className='profile__header__image__img' src={image} alt="profile" />
					) : (
						<svg className='profile__header__image__fallback' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
					)}
					{showHover && (
						<div className='profile__header__image__hover' onClick={$handleInput}>
							{image ? (
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
							)}
						</div>
					)}
				</div>
				<div>
					<h4>Profile</h4>
					<p className='profile__header__sub'>Update your photo and personal information.</p>
				</div>
			</div>
			<div className="profile__body">
				<div className='profile__body__header'>
					<h4>Personal info</h4>
					{!isEdittingProfile && (<button className='profile__body__button' onClick={$displayForm}>Edit info</button>)}
				</div>
				<form onSubmit={handleSubmit($handleSubmit)} className='profile__body__form'>
					<div className='profile__body__form__content'>
						<p className="bold">First name</p>
						{isEdittingProfile ? (
							<>
								<input {...register("firstName")} defaultValue={data.firstName} />
								{errors.firstName && <p className="profile__body__form__content__input__error">Name is required</p>}
							</>
						) : (
							<p>{data.firstName}</p>
						)}
					</div>
					<div className='profile__body__form__content'>
						<p className="bold">Last name</p>
						{isEdittingProfile ? (
							<>
								<input {...register("lastName")} defaultValue={data.lastName} />
								{errors.lastName && <p className="profile__body__form__content__input__error">Last name is required</p>}
							</>
						) : (
							<p>{data.lastName}</p>
						)}
					</div>
					<div className='profile__body__form__content'>
						<p className="bold">Phone</p>
						{isEdittingProfile ? (
							<>
								<input {...register("phoneNumber")} defaultValue={data.phoneNumber} />
								{errors.phoneNumber && <p className="profile__body__form__content__input__error">Number is required</p>}
							</>
						) : (
							<p>{data.phoneNumber}</p>
						)}
					</div>
					<div className='profile__body__form__content'>
						<p className="bold">Email</p>
						{isEdittingProfile ? (
							<>
								<input {...register("email")} defaultValue={data.email} />
								{errors.email && <p className="profile__body__form__content__input__error">Email is required</p>}
							</>
						) : (
							<p>{data.email}</p>
						)}
					</div>
					<div className='profile__body__form__content'>
						<p className="bold">Birthday</p>
						{isEdittingProfile ? (
							<>
								<input {...register("birthday")} defaultValue={data.birthday} />
								{errors.birthday && <p className="profile__body__form__content__input__error">Birthday must match the parttern "YYYY-MM-DD"</p>}
							</>
						) : (
							<p>{data.birthday}</p>
						)}
					</div>
					{isEdittingProfile && (
						<>
							<span />
							<button type='submit'>Submit</button>
						</>
					)}
				</form>
			</div>
			<div className="profile__footer">
				<h4>Other settings</h4>
				<p className="bold">Interests</p>
				<div className='profile__interests'>
					{data.interests.map((interest, i) => (
						<Interest onClick={() => $removeInterest(i)} key={interest} interest={interest} />
					))}
					<CreateInterest onNewInterest={$createNewInterest} onSubmit={$onCreateNewInterest} isCreating={creatingNewInterest}/>
				</div>
			</div>
		</div>
	);
}

export default App;
