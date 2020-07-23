let DB;

//Selectores de la interfaz
const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citas = document.querySelector('#citas'),
      heading = document.querySelector('#administra');


//Esperar por DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  //crear la base de datos
  let crearDB = window.indexedDB.open('citas', 1);

  //Si hay error enviarlo a la consola
  crearDB.onerror = function() {
    console.log('Hubo un error');
  }

  //Si todo está bien, mostrar en consola y asignar la base de datos
  crearDB.onsuccess = function() {
    console.log('Todo listo');
  }
})