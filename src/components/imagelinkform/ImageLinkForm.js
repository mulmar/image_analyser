import React from 'react';
import './imagelinkform.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit, onSelectChange}) => {
	return (
		<div>
			<p className='f3'>
				{'this magic brain will detect faces in your pictures. Give it a try!'}
			</p>
			<div className='center'>
			<div className='form center pa4 br3 shadow-5'>
				<input className='f4 w-70 pa2 center' type='text' onChange={onInputChange}/>
				<button 
				className='w-30 grow f4 link ph3 pv dib white bg-light-purple' 
				onClick={onButtonSubmit}>Detect</button>
			</div>
			</div>
				<select name="model" onChange={onSelectChange}>
					<option value ="GENERAL_MODEL">describe image</option>
					<option value ="FACE_DETECT_MODEL">facedetection</option>
				</select> 
		</div>
		);
}

export default ImageLinkForm;