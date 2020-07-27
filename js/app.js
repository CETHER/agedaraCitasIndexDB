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
    
    //Aignar a la base de datos
    DB = crearDB.result;
    console.log('mostrarCitas');
    mostrarCitas();
  }

  //método sólo para correr una vez y crear el Schema de la BD
  crearDB.onupgradeneeded = function(e) {
    //el evento es la misma base de datos
    console.log('Sólo una vez');
    let db = e.target.result;

    //definir el object store que toma 2 parametros
    //nombre de la base de datos y las opciones
    let objectStore = db.createObjectStore('citas', {
      keyPath: 'key',
      autoIncrement: true,
    });

    //Crear índices y campos de la base de datos
    //create index, parametros, nombre, keypaht y opciones
    objectStore.createIndex('mascota', 'mascota', {
      unique: false,
    });
    objectStore.createIndex('cliente', 'cliente', {
      unique: false,
    });
    objectStore.createIndex('telefono', 'telefono', {
      unique: false,
    });
    objectStore.createIndex('fecha', 'fecha', {
      unique: false,
    });
    objectStore.createIndex('hora', 'hora', {
      unique: false,
    });
    objectStore.createIndex('sintomas', 'sintomas', {
      unique: false,
    });

  }

  //Cuando el formulario de envía
  form.addEventListener('submit', agregarDatos);

  function agregarDatos(e) {
    e.preventDefault();

    const nuevaCita = {
      mascota: nombreMascota.value,
      cliente: nombreCliente.value,
      telefono: telefono.value,
      fecha: fecha.value,
      hora: hora.value,
      sintomas: sintomas.value,
    }

    //En indexDB se utilizan las transacciones
    let transaction = DB.transaction(['citas'], 'readwrite');
    let objectStore = transaction.objectStore('citas');

    let peticion = objectStore.add(nuevaCita);

    peticion.onsuccess = () => {
      form.reset();
    }

    transaction.oncomplete = () => {
      console.log('Cita agregada');
    }

    transaction.onerror = () => {
      console.log('Hubo un error');
    }
  }

  function mostrarCitas() {
    //Limpiar las citas anteriores
    while(citas.firstChild) {
      citas.removeChild(citas.firstChild);
    }

    let objectStore = DB.transaction('citas').objectStore('citas');

    //retorna una petición
    objectStore.openCursor().onsuccess = function(e) {
      //cursor se ubica en el registro indicado para acceder  a los datos
      let cursor = e.target.result;
      console.log(cursor);

      if (cursor) {
        let citaHTML = document.createElement('li');
        citaHTML.setAttribute('data-cita-id', cursor.value.key);
        citaHTML.classList.add('list-group-item');

        citaHTML.innerHTML = `
          <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
        `

        citas.appendChild(citaHTML);

        cursor.continue();
      }
    }
  }
})