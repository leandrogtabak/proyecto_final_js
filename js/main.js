//SIMULADOR PARA LLEVAR LA ADMINISTRACION DE UNA LIBRERIA
//Declaración de clase Libro

class Libro {
    constructor(obj) {
        this.titulo = obj.titulo;
        this.autor = obj.autor;
        this.anio = obj.anio;
        this.precio = obj.precio;
        this.isbn = obj.isbn;
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

        contenedor.innerHTML = `<img src="/portadas/${this.isbn}.jpg" alt="" class="imagen">
                                <div class="descripcion">
                                <p><strong>Título del libro:</strong> ${this.titulo}</p>
                                <p><strong>Autor:</strong> ${this.autor}</p>
                                <p><strong>Año:</strong> ${this.anio}</p>
                                <p><strong>Género:</strong> ${this.genero}</p>
                                <p><strong>Idioma:</strong> ${this.idioma}</p>
                                <p><strong>ISBN:</strong> ${this.isbn}</p>
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


//lleno los array de cada categoría, borro duplicados y ordeno alfabéticamente (con la funcion eliminaDuplisYordena)
const categorias = ["genero", "autor", "titulo", "anio", "idioma", "editorial"]; //colocar los id de los selects y llamarlos con eso


function filtrarPor(clave, valor, array) {
    return array.filter(x => x[clave] == valor);
}


function generarCardLibros() {

    let filtrados = [...libros];

    let contenedor = document.getElementById("container");
    contenedor.innerHTML = "";
    //Recorro todo el array de categorias (filtros) para ver cuál no dice "todos" y fue seleccionado por el usuario para filtrar
    //a cada uno le aplico la funcion "filtrarPor"
    /*
    
        for (let i = 0; i < categorias.length; i++) {
            if (sCategorias[i].options[sCategorias[i].selectedIndex].text != "Todos") {
                filtrados = filtrarPor(categorias[i], sCategorias[i].options[sCategorias[i].selectedIndex].text, filtrados);
    
            }
        }
        */
    //utilizar la caja de busqueda sobre los filtrados


    //el problema con este algoritmo es q parto de un subgrupo al q no puedo aplicar la misma idea de ir "filtrando"
    //sino al reves, debo "no borrar" solo los q coincidan con la busqueda

    $('.campoBusqueda').each(function () {
        //console.log($(this).attr('name'))
        //console.log($(this).val())
        buscarPorCampo($(this).val(), $(this).attr('name'))
    });

    //console.log($('.campoBusqueda').val())

    function buscarPorCampo(valor, campo) {
        let filtrados = [];
        
        console.log(valor, campo);
        if (valor != "Todos" && campo != "general") {
            console.log(campo ? campo : 'campo');
            
            filtrados = libros.filter(item => Object.keys(item).some(key => item[key].includes(valor)));
            
        }else{
            valor != "Todos" && (filtrados = libros.filter(item => Object.keys(item).some(key => item[key].includes(valor))));
        }
        console.log(filtrados);
    }


    /*
        let flag = true;
        for (let i = 0; i < filtrados.length; i++) {
            for (const propiedad in filtrados[i]) {
                if (filtrados[i][propiedad].toLowerCase().includes($('#cajaBuscador').val())) {
                    console.log(filtrados[i][propiedad]);
                    flag = false;
                    break;
                } else {
    
                    flag = true;
                }
                //lo borro de filtrados si no está
    
            }
            if (flag) {
                filtrados.splice(i, 1);
                i--;
            }
        }
    
        //Genero las cards para el array de libros que fue filtrado
        for (let i = 0; i < filtrados.length; i++) {
            filtrados[i].generarCard("container");
        }
    */

    $("a").click(function () {

        for (let i = 0; i < libros.length; i++) {
            if (libros[i].isbn == this.id) {
                libros[i].obtenerLibro("detallesLibro");
                $("#botonCarrito").click(function () {
                    alert("Se ha añadido al carrito");
                    seleccionados.push(libros[i].isbn);
                    sessionStorage.setItem(`nro${seleccionados.length}`, libros[i].isbn);
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







//Aplico la función rellenar select a los select de cada filtro
for (let i = 0; i < categorias.length; i++) {
    rellenarSelects(eliminaDuplisYordena(libros, String(categorias[i])), sCategorias[i]);
}

//Hay q hacer q con cada change, se actualice todo, desde filtrados hasta los otros selects, con las subopciones de cada genero disponibles luego de cada filtrado
//con eso, te aseguras q al aplicar un filtro, se actualicen los otros generos q contienen eso



let btnBuscar = document.getElementById("btnBuscador");


btnBuscar.addEventListener("click", function () { generarCardLibros(); }, false);

//Activar la caja de busqueda haciendo trigger del btnBuscar al apretar Enter
$("#cajaBuscador").keyup(function (event) {
    //Enter tecla 13
    if (event.keyCode === 13) {
        $("#btnBuscador").click();
    }
});