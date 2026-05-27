
function contrasena(e) {
  var key = e.keyCode || e.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  // Define aquí los caracteres permitidos (letras de la a a la z, números del 0 al 9)
  var letrasYNumeros = "abcdefghijklmnñopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|:,.?/";
  
  // Si la tecla presionada no está en la lista, bloquéala
  if (letrasYNumeros.indexOf(tecla) == -1) {
    return false;
  }
}


// function soloLetrasYNumeros(e) {
//   var key = e.keyCode || e.which;
//   var tecla = String.fromCharCode(key).toLowerCase();
//   // Define aquí los caracteres permitidos (letras de la a a la z, números del 0 al 9)
//   var letrasYNumeros = "abcdefghijklmnñopqrstuvwxyz0123456789";
  
//   // Si la tecla presionada no está en la lista, bloquéala
//   if (letrasYNumeros.indexOf(tecla) == -1) {
//     return false;
//   }
// }

function soloLetrasYNumeros(e) {

  const tecla = e.key.toLowerCase();

  const permitidos =
    "abcdefghijklmnñopqrstuvwxyz0123456789 ";

  // Permitir teclas especiales
  const especiales = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Delete"
  ];

  if (
    permitidos.indexOf(tecla) === -1 &&
    !especiales.includes(e.key)
  ) {
    e.preventDefault();
    return false;
  }

  return true;
}


function soloLetrasYNumeros2(e) {

  const tecla = e.key.toLowerCase();

  const permitidos =
    "abcdefghijklmnñopqrstuvwxyz0123456789!@#-.+ ";

  // Permitir teclas especiales
  const especiales = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Delete"
  ];

  if (
    permitidos.indexOf(tecla) === -1 &&
    !especiales.includes(e.key)
  ) {
    e.preventDefault();
    return false;
  }

  return true;
}


function soloNumeros(e) {
  var key = e.keyCode || e.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  // Define aquí los caracteres permitidos (letras de la a a la z, números del 0 al 9)
  var letrasYNumeros = "0123456789";
  
  // Si la tecla presionada no está en la lista, bloquéala
  if (letrasYNumeros.indexOf(tecla) == -1) {
    return false;
  }
}

function soloLetras(e) {
  var key = e.keyCode || e.which;
  var tecla = String.fromCharCode(key).toLowerCase();
  // Define aquí los caracteres permitidos (letras de la a a la z, números del 0 al 9)
  var letrasYNumeros = "abcdefghijklmnñopqrstuvwxyz";
  
  // Si la tecla presionada no está en la lista, bloquéala
  if (letrasYNumeros.indexOf(tecla) == -1) {
    return false;
  }
}


