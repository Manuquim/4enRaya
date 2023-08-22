//Funcion para encontrar combinacion ganadora y ganador si hay
export const isWinner = (x,fila,col)=>
{
  let aux=x[fila][col];
    if(aux ==='x' || aux==='o')
    {
      //Horizontal derecha
      if((col+3)<7)
      {
        if(aux===x[fila][col+1]&&aux===x[fila][col+2]&&aux===x[fila][col+3])
        return aux;
      }
      //Horizontal izquierda
      if(col-3>=0)
      {
        if((aux===x[fila][(col-1)])&&(aux===x[fila][(col-2)])&&(aux===x[fila][(col-3)]))
        return aux;
      }
      //Vertical arriba
      if((fila-3)>=0)
      {
        if((aux===x[fila-1][col])&&(aux===x[fila-2][col])&&(aux===x[fila-3][col]))
        return aux;
      }
      //Vertical abajo
      if((fila+3)<6)
      {
        if(aux===x[fila+1][col]&&aux===x[fila+2][col]&&aux===x[fila+3][col])
        return aux;
      }
      //Diagonal arriba derecha
      if((fila-3)>=0&&(col+3)<7)
      {
        if(aux===x[fila-1][col+1]&&aux===x[fila-2][col+2]&&aux===x[fila-3][col+3])
        return aux;
      }
      //Diagonal arriba izquierda
      if(((fila-3)>=0) && ((col-3)>=0))
      {
        if(aux===x[fila-1][col-1]&&aux===x[fila-2][col-2]&&aux===x[fila-3][col-3])
        return aux;
      }
      //Diagonal abajo derecha
      if(((fila+3)<6) && ((col+3)<7))
      {
        if(aux===x[fila+1][col+1]&&aux===x[fila+2][col+2]&&aux===x[fila+3][col+3])
        return aux;
      }
       //Diagonal abajo izquda
      if(((fila+3)<6) && ((col-3)>=0))
      {
        if(aux===x[fila+1][col-1]&&aux===x[fila+2][col-2]&&aux===x[fila+3][col-3])
          return aux;
      }
    }
  return '0';
}

export const tablas = (x) => {
  let tablas=true;
  for(let i=0; i<7;i++)
    if(x[0][i]==='W') tablas=false;
  
  return tablas;
}