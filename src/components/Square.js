import React from 'react'

export default function Square(props) {
  return (
	<button 
		className={"square " + (props.isWinning ? "square--winning" : null)} 
		onClick={props.handleClick}>
			{props.value}
	</button>
  )
}
