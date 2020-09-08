import React from 'react';
import { Field } from '../form-modal'
import { styles } from './styles'
import { global } from '../../styles'
import UploadIcon from '@material-ui/icons/Backup';

export interface FileFieldStructure extends Field {
	type: 'file';
	fileTypes?: string[];
}

interface FileInputProps {
	fieldStructure: FileFieldStructure;
	name: string
	value?: string | File | null;
	error?: string;
	handleChange: (name: string, value: File | string | null) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ fieldStructure, name, value, error, handleChange }) => {
	const previewFile = (image?: string | File | null) => {
		const reader = new FileReader()
		const imagePreview = document.querySelector(`#${name}-preview`)! as HTMLImageElement

		reader.onload = e => {
			imagePreview.src = typeof e.target?.result === 'string' ? e.target?.result : ''
		}

		const filePreviews = {
			audio: 'https://baldwindesign.co/images/audio-preview.png',
			file: 'https://baldwindesign.co/images/file-preview.png'
		}

		if (image && typeof image !== 'string') {
			if (image.type.includes('image')) {
				reader.readAsDataURL(image)
			} else if (image.type.includes('audio')) {
				imagePreview.src = filePreviews.audio
			} else {
				imagePreview.src = filePreviews.file
			}
		}
		if (typeof image === 'string') imagePreview.src = image
	}

	const handleHover = (hover: boolean) => {
		const inputLabel = document.querySelector(`#${name}-label`)! as HTMLLabelElement
		const borderColor = hover ? '#212121' : styles.file_upload.borderColor!
		inputLabel.style.borderColor = errorStyle?.borderColor || borderColor
	}

	const errorStyle = error ? styles.error : null

	return (
		<div style={global}>
			<input
				type="file"
				id={name + '-input'}
				accept={fieldStructure.fileTypes?.join()}
				style={{ ...global, display: 'none' }}
				onChange={e => {
					handleChange(name, e.target.files ? e.target.files[0] : null)
					previewFile(e.target.files ? e.target.files[0] : null)
				}}
			/>

			<label
				id={name + '-label'}
				htmlFor={name + '-input'}
				style={{ ...styles.file_upload, ...global, ...errorStyle }}
				onMouseEnter={() => handleHover(true)}
				onMouseLeave={() => handleHover(false)}
			>
				<div style={{ ...global, ...styles.upload_overlay, ...errorStyle }}>
					<UploadIcon />
					<label style={global}>{fieldStructure.label || name}</label>
				</div>

				<img
					id={`${name}-preview`}
					src={typeof value === 'string' ? value : undefined}
					style={{ ...global, ...styles.image_preview }}
				/>
			</label>

			{fieldStructure.helpText || error ? (
				<p style={{ ...styles.help_text, ...errorStyle }}>
					{error || fieldStructure.helpText}
				</p>
			) : null}
		</div>
	);
}
