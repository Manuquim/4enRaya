
export const Square = ({ children, isSelected , fila , col , updateBoard }) =>
{
  let ponerColor=null;
  switch(children) {
    case 'x':
      ponerColor='circulo rojo';
      break;
    case 'o':
      ponerColor='circulo amarillo';
      break;
    case 'W':
      ponerColor='circulo negro';
      break;
    default:
      ponerColor=null;
  }

  const className=`square ${isSelected ? 'is-selected' : ''}`+ponerColor;

  const handleClick = () =>
  {
    updateBoard(fila,col);
  }

  return (
    <div onClick={handleClick} className={className}></div>
  )
}