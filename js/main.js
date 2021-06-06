//SIMULADOR PARA LLEVAR LA ADMINISTRACION DE UNA LIBRERIA
//Declaración de clase Libro

class Libro {
    constructor(obj) {
        this.titulo = obj.titulo;
        this.autor = obj.autor;
        this.anio = parseInt(obj.anio);
        this.precio = parseFloat(obj.precio);
        this.isbn = parseInt(obj.isbn);
        this.editorial = obj.editorial;
        this.genero = obj.genero;
        this.idioma = obj.idioma;

    }
    //funcion para generar las card (chicas) de los libros como resultado de busquedas/filtrados

    generarCard(contenedorDestino) {

        //Obtengo el div contenedor y lo asocio a un objeto
        let contenedor = document.getElementById(contenedorDestino);
        let card = document.createElement("div");
        card.classList.add("cards");
        card.innerHTML = `<a id=${this.isbn} href="#"><img src="/portadas/${this.isbn}.jpg" alt="" class="imagenCard"></a>
                          <p class="tituloCard">${this.titulo}</p>
                          <p class="autorCard">${this.autor}</p>
                          <p class="precioCard"> $${this.precio}</p>`;

        return contenedorDestino ? contenedor.appendChild(card) : card;

    }

    obtenerLibro(contenedorDestino) {
        //Obtengo el div contenedor y lo asocio a un objeto

        let main = document.getElementById(contenedorDestino);
        main.innerHTML = "";

        let contenedor = document.createElement("div");
        contenedor.classList.add("contenedor");
      
        contenedor.innerHTML =  `<img src="/portadas/${this.isbn}.jpg" alt="" class="imagen">
                                <div class="descripcion">
                                <p><strong>Título del libro:</strong> ${this.titulo}</p>
                                <p><strong>Autor:</strong> ${this.autor}</p>
                                <p><strong>Año:</strong> ${this.anio}</p>
                                <p><strong>Género:</strong> ${this.genero}</p>
                                <p><strong>Idioma:</strong> ${this.idioma}</p>
                                <p><strong>ISBN:</strong> ${this.isbn}</p>
                                <p><strong>Peso:</strong> ${this.peso} grs</p>
                                <p><strong>Volumen:</strong> ${this.volumen} cm^3</p>
                                <p><strong>Editorial:</strong> ${this.editorial}</p>
                                <p><strong>Precio:</strong> <span style="font-size:1.3rem;">$${this.precio}</span></p>
                                <button type="button" id="botonCarrito">Añadir al carrito</button></div>`;
        

       
        return contenedorDestino ? main.appendChild(contenedor) : contenedor;
    }
}


//Instancio objetos de la clase Libro tomando los datos de data.js

const libros = [];
for (const obj of LIBROS) {
    libros.push(new Libro(obj));
}

const seleccionados = [];

function generarCardLibros() {
    let contenedor = document.getElementById("container");
    contenedor.innerHTML = "";
    for (let i = 0; i < libros.length; i++) {
        libros[i].generarCard("container");
    }
    
        $("a").click(function() {
            
            for(let i = 0;i<libros.length;i++){
                if(libros[i].isbn == this.id){
                    libros[i].obtenerLibro("detallesLibro");
                    $("#botonCarrito").click(function() {
                        alert("Se ha añadido al carrito");
                        seleccionados.push(libros[i].isbn);
                        sessionStorage.setItem(`nro${seleccionados.length}`,libros[i].isbn);
                    });
                    
                }
            }
       
    });
}

//Obtengo los select del DOM (transformar a funcion que contenga arrays de "select")

let sCategorias = document.getElementsByTagName("select");

//funciones para el llenado de los select

//funcion que elimina duplicados y ordena alfabeticamente
function eliminaDuplisYordena(arrayOrigen, key) {

    let arrayDestino = [];

    for (i = 0; i < arrayOrigen.length; i++) {
        arrayDestino[i] = arrayOrigen[i][key];
    }
    //Elimino duplicados
    arrayDestino = [...new Set(arrayDestino)];

    //ordeno alfabeticamente
    arrayDestino.sort();

    return arrayDestino;

}

//funcion para rellenar los select
function rellenarSelects(arrayDatos, select) {

    for (i = 0; i < arrayDatos.length; i++) {
        let c = document.createElement("option");
        c.text = arrayDatos[i];
        select.options.add(c, i + 1);
    }

}

//lleno los array de cada categoría, borro duplicados y ordeno alfabéticamente (con la funcion eliminaDuplisYordena)
const categorias = ["genero", "autor", "titulo", "anio", "idioma", "editorial"]; //colocar los id de los selects y llamarlos con eso


//Aplico la función rellenar select a los select de cada filtro
for (let i = 0; i < categorias.length; i++) {
    rellenarSelects(eliminaDuplisYordena(libros, String(categorias[i])), sCategorias[i]);
}


let btnBuscar = document.getElementById("btnBuscador");


/*
function mostrarLibro() {

    for (let i = 0; i < libros.length; i++) {
        if (libros[i].titulo == sTitulo.options[sTitulo.selectedIndex].text) {
            libros[i].obtenerLibro();
            break;
        }
    }
}*/

//Intenté esto para filtrar, no me anduvo

function filtrarPor(clave, valor, array) {
    return array.filter(x => x[clave] == valor);
}


/*function filtrarLibros(x) {

    let arrayResultado = filtrarPor("autor", x, libros);
    for (i = 0; i < arrayResultado.length; i++)
        alert(arrayResultado[i].titulo);

}*/
/*filtrarLibros("Julio Verne");*/

//btnBuscar.addEventListener("click", function () { filtrarLibros(sAutor.options[sAutor.selectedIndex].text); }, false);
//btnBuscar.addEventListener("click", function () { mostrarLibro(); }, false);
btnBuscar.addEventListener("click", function () { generarCardLibros(); }, false);





/*
//declaro a la variable que almacenará el valor total de la venta de los libros seleccionados
let subTotalPrecio = 0;

//Inicio del programa

let opcionInicio = parseInt(prompt("Bienvenido al Sistema de Administración de Librería (S.A.L). \nIngrese una opción:" +
    "\n1) Consultar un libro\n2) Editar un libro (a implementar) \n3) Ingresar un libro\n4) Eliminar un libro (a implementar)"));

let idConsulta;

switch (opcionInicio) {
    case 1:
        //Consulta al usuario sobre que libro desea información

        idConsulta = parseInt(prompt("Ingrese el id del libro a consultar: (id válidos del 0 al " + libros.length + ")"));

        //verifico que la entrada sea correcta

        while (idConsulta < 0 || idConsulta > libros.length) {
            idConsulta = parseInt(prompt("Por favor ingrese un id válido: (id válidos del 0 al " + libros.length + ")"));

        }
        libros[idConsulta].obtenerLibro();
        break;
    case 2:

    case 3:
        //Pedir al usuario los datos del libro a añadir en la base de datos

        let titulo = prompt("Ingrese el título del libro a añadir:");
        let autor = prompt("Ingrese el autor del libro a añadir:");
        let editorial = prompt("Ingrese la editorial del libro a añadir:");
        let anio = parseInt(prompt("Ingrese el año de publicación del libro a añadir:"));
        let precio = parseFloat(prompt("Ingrese el precio del libro a añadir:"));
        let isbn = parseInt(prompt("Ingrese el código ISBN del libro a añadir:"));
        let peso = parseFloat(prompt("Ingrese el peso del libro a añadir:"));
        let volumen = parseFloat(prompt("Ingrese el volumen del libro a añadir:"));
        //Añado el libro al array libros
        libros.push(new Libro(titulo, autor, anio, precio, isbn, peso, volumen, editorial));
        alert("Se ha añadido el nuevo libro con éxito");
        //Mostrar el contenido del libro añadido
        libros[libros.length - 1].obtenerLibro();
    case 4:

        break;
    default:

}


//Consulta al usuario si desea sumar ese libro al listado a vender

let entradaUsuario2 = prompt("Desea agregar el libro al carrito (S/N):");

//verifico que la entrada sea correcta

verificarRespuesta(entradaUsuario2);

if (entradaUsuario2 == "n") {
    alert("No se ha sumado el libro al total");

} else if (entradaUsuario2 == "s") {
    let descuento = parseFloat(prompt("Ingrese el descuento a aplicar (0 a 0.5 para indicar 0% a 50% de descuento"));
    subTotalPrecio += sumarLibro(0.21, descuento, idConsulta);
}

function sumarLibro(iva, descuento, index) {

    return libros[index].precio * (1 + iva - descuento);


}
alert("El precio a abonar es $" + subTotalPrecio);


//funcion que "no sale" hasta que el usuario ingrese una respuesta que sea sólo s ó n

function verificarRespuesta(entrada) {

    while (entrada.toLowerCase() != 'n' && entrada.toLowerCase() != 's') {
        entrada = prompt("Por favor ingrese una respuesta válida (S/N):");

    }
}

*/
//en el menu ppal tienen q estar las opciones, agregar libro, borrar libro, consultar libro..agregar sera con push y "borrar" dejará las propiedades del libro vacías
//y quizas 