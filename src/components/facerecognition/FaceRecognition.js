import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box }) => {
	return (
		
		<div>
		<div >
			<div className='absolute'>
			<img id='inputimage' src={imageUrl} alt='' width='600px' height='auto' />
			<div className='bounding-box center' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
			</div>
		</div>
		<aside id='descriptions' className='rights'>
		</aside>
		</div>
		);
}

export default FaceRecognition;