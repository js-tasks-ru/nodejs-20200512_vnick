function sum(a, b) {
  /* ваш код */
  if(typeof a  === 'number' && typeof b === 'number'){
    return (a + b);
  }else{
    throw new TypeError('Один из аргументов не является числом.');
  }
}

module.exports = sum;
