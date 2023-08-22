import { useState } from 'react';
import { TURNS } from './constants';
import { isWinner , tablas } from './funciones/isWinner';
import { Square } from './component/Square';
import confetti from "canvas-confetti";
import './App.css';



function App() {
  const[board,setBoard]=useState(Array(6).fill().map((row)=>new Array(7).fill('W'))); 
  const[turn,setTurn]=useState(TURNS.X);
  const[winner,setWinner]=useState(null);

  const updateBoard = (fila,col) => {
    const newBoard=[...board];
    //comprobar si columna llena
    if(newBoard[0][col]==='W')
    {
      //Colocar turno en primera posicion libre
      //while con dos condiciones en JS da problemas, por eso se usa bucle for
      let pos=0;
      for(let i=0;i<6;i++)
      {
        if(newBoard[i][col]==='W')
        {
          pos=i;
        }
      }
      newBoard[pos][col]=turn;
      setBoard([...newBoard]);

      //Vemos si hay ganador
      let ganador=isWinner(newBoard,pos,col);
      if(ganador==='x' || ganador==='o')
      {
        confetti();
        setWinner(ganador);
        ganador !='0' ? `el ganador es:${ganador}`:'no Winner';
      }
      else
      {
        
        //Actualizar turno
        if(tablas(newBoard))setWinner(false)
        const newTurn = turn===TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);
      }
    }
  }

  const reset = () =>{
    setBoard(board.map((_,fila)=>board[fila].map((j)=>j='W'))); 
    setTurn(TURNS.X);
    setWinner(null);
  }

  return (
    <>
      <h1>4-en-Raya</h1>
      <button onClick={reset}>RESET</button>
      <main className='board'>
        <section className='game'>
        {
          board.map((_,fila)=>board[fila].map((j,col)=>
          <Square key={`${fila}${col}`} children={j} updateBoard={updateBoard} fila={fila} col={col}></Square>))
        }
        </section>

        <section className='turn'>
          <Square isSelected={turn===TURNS.X}>
            {TURNS.X}
          </Square>
          <Square isSelected={turn===TURNS.O}>
            {TURNS.O}
          </Square>
        </section> 
        
        {winner!==null&&(
        <section className='winner'>
          <div className='text'>
            <h3> 
              {winner===false ? 'Empate' : 'Gano:'}
            </h3>
            <header className='win'>
              {winner&&<Square>{winner}</Square>}
            </header>
            <button onClick={reset}>Empezar de nuevo</button>
          </div>
        </section>
        )} 
      </main>
    </>
  )
}

export default App
