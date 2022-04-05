import React from 'react'

function BoardFunction(props) {
  return (
    <div>
      <div className="row">
          <Box index={0} turn={props.sendTurn} value={props.game[0]} winnerLine={props.winnerLine}/>
          <Box index={1} turn={props.sendTurn} value={props.game[1]} winnerLine={props.winnerLine}/>
          <Box index={2} turn={props.sendTurn} value={props.game[2]} winnerLine={props.winnerLine}/>
        </div>
        <div className="row">
          <Box index={3} turn={props.sendTurn} value={props.game[3]} winnerLine={props.winnerLine}/>
          <Box index={4} turn={props.sendTurn} value={props.game[4]} winnerLine={props.winnerLine}/>
          <Box index={5} turn={props.sendTurn} value={props.game[5]} winnerLine={props.winnerLine}/>
        </div>
        <div className="row">
          <Box index={6} turn={props.sendTurn} value={props.game[6]} winnerLine={props.winnerLine}/>
          <Box index={7} turn={props.sendTurn} value={props.game[7]} winnerLine={props.winnerLine}/>
          <Box index={8} turn={props.sendTurn} value={props.game[8]} winnerLine={props.winnerLine}/>
        </div>
    </div>
  )
}

const Box = ({ index, turn, value, winnerLine }) => {
  console.log(winnerLine);
	return (
	  <div className={"box " + (winnerLine.includes(index) ? "box--winning" : null)}  onClick={() => turn(index)}>
		  {value}
	  </div>
	);
};


export default BoardFunction