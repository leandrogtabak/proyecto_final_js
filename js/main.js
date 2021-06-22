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

        //Defino un div llamado card que será la descripción de cada libro en los resultados de busqueda
        let card = $(`<div class="tarjetas"><a id=${this.isbn} href="#"><img src="/portadas/${this.isbn}.jpg" alt="" class="imagenCard"></a>
                    <p class="tituloCard">${this.titulo}</p>
                    <p class="autorCard">${this.autor}</p>
                    <p class="precioCard"> $${this.precio}</p></div>`);
        //Si contenedor no es undefined, hacer append a contenedor de la card
        return contenedorDestino ? $(`#${contenedorDestino}`).append(card) : card;

    }

    obtenerLibro(contenedorDestino) {
        $(`#${contenedorDestino}`).html('');
        let contenedor = (`<div class="modal fade" id="modalDetalles" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header style="">
                                    <span style="font-size:1.3rem;font-weight:700;">${this.titulo}</span>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body contenedor">
                                        
                                        <img src="/portadas/${this.isbn}.jpg" alt="" class="imagen">
                                        <div class="descripcion">
                                        <p><strong>Título del libro:</strong> ${this.titulo}</p>
                                        <p><strong>Autor:</strong> ${this.autor}</p>
                                        <p><strong>Año:</strong> ${this.anio}</p>
                                        <p><strong>Género:</strong> ${this.genero}</p>
                                        <p><strong>Idioma:</strong> ${this.idioma}</p>
                                        <p><strong>ISBN:</strong> ${this.isbn}</p>
                                        <p><strong>Editorial:</strong> ${this.editorial}</p>
                                        <p><strong>Precio:</strong> <span style="font-size:1.3rem;font-weight:700;">$${this.precio}</span></p>
                                       </div>
                                        </div>
                                        <div class="modal-footer">
                                        <button type="button" id = "botonCarrito" class="btn btn-success" data-bs-dismiss="modal">Añadir al carrito</button>
                                    </div>
                             </div>
                            </div>
                            </div>`);

        return contenedorDestino ? $(`#${contenedorDestino}`).append(contenedor) : contenedor;
    }
}

let datosLibros = [];
const libros = [];
const seleccionados = [];
const categorias = ["genero", "autor", "titulo", "anio", "idioma", "editorial"]; //colocar los id de los selects y llamarlos con eso
//Obtengo los select del DOM (transformar a funcion que contenga arrays de "select")

let sCategorias = document.getElementsByTagName("select");

$().ready(() => {
    $.getJSON("js/data.JSON", (data, respuesta) => {
        if (respuesta == "success") {
            datosLibros = data;

            for (const obj of datosLibros) {
                libros.push(new Libro(obj));
            }
            //Aplico la función rellenar select a los select de cada filtro
            for (let i = 0; i < categorias.length; i++) {
                rellenarSelects(eliminaDuplisYordena(libros, String(categorias[i])), sCategorias[i]);
            }


        } else {
            console.log("ERROR");
        }
    })
})




//--------------------------Declaración de funciones--------------------------------//

//Comentar que hace esta función

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

//Comentar que hace esta funcion


function filtrarPor(clave, valor, array) {
    return array.filter(x => x[clave] == valor);
}

function generarCardLibros() {


    let filtrados = [...libros];

    let contenedor = document.getElementById("conteiner");
    contenedor.innerHTML = "";

    //Recorro todo el array de categorias (filtros) para ver cuál no dice "todos" y fue seleccionado por el usuario para filtrar
    //a cada uno le aplico la funcion "filtrarPor"


    for (let i = 0; i < categorias.length; i++) {
        if (sCategorias[i].options[sCategorias[i].selectedIndex].text != "Todos") {
            filtrados = filtrarPor(categorias[i], sCategorias[i].options[sCategorias[i].selectedIndex].text, filtrados);

        }
    }

    //utilizar la caja de busqueda sobre los filtrados


    //el problema con este algoritmo es q parto de un subgrupo al q no puedo aplicar la misma idea de ir "filtrando"
    //sino al reves, debo "no borrar" solo los q coincidan con la busqueda
    //si bien esto anda, no se recomienda canbiar el valor de la variable de iteracion dentro del cuerpo de la iteracion
    //camnbiar la funcion por la nueva

    let flag = true;
    for (let i = 0; i < filtrados.length; i++) {
        for (const propiedad in filtrados[i]) {
            if (filtrados[i][propiedad].toLowerCase().includes($('#cajaBuscador').val().toLowerCase())) {
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
        filtrados[i].generarCard("conteiner");
    }


    $("a").click(function () {

        for (let i = 0; i < libros.length; i++) {
            if (libros[i].isbn == this.id) {
                libros[i].obtenerLibro("detallesLibro");
                $("#modalDetalles").modal('show');
                $("#botonCarrito").click(function () {


                    $("#pie").html(`<div class="modal fade" id="modalAniadido" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                               Añadido exitosamente!
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Se ha añadido <strong>${libros[i].titulo}</strong> al carrito
                            </div>
                            <div class="modal-footer">
                                <button type="button" id = "btnAceptarModal" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>`);



                    seleccionados.push(libros[i]);
                    sessionStorage.setItem(`nro${seleccionados.length}`, libros[i].isbn);
                    $('#modalAniadido').modal('show');

                    $("#btnAceptarModal").click(fadear);
                });

            }
        }


    });


}

let btnBuscar = document.getElementById("btnBuscador");

//dar nombres a las funciones y solo llamarlas desde el codigo arriba

function fadear() {
    $("#oa").fadeOut(1000);

}
let totalCarrito = 0;
let contadorItems = 0;

$("#btnVerCarrito").click(function () {


    let content = ('');
    
    for (const seleccionado of seleccionados) {

        totaCarrito += parseFloat(seleccionado.precio);
        content += ` <tr>
                    <td class="w-25">
                        <img src="/portadas/${seleccionado.isbn}.jpg" class="img-fluid img-thumbnail" alt="Sheep" style="height:150px;">
                    </td>
                    <td>${seleccionado.titulo}</td>
                    <td>$${seleccionado.precio}</td>
                    <td><input type="text" class="form-control cantidades" id="cantArt${contador}" maxlength="2" style="width:40px !important;margin:0px auto !important;"></td>
                    <td id="subTotal${contador}"></td>
                    <td><button type="button" class="btn btn-danger btn-sm" aria-label="Close">
                        <img src="img/fa.png" alt="" style="height:8px;"></button></td>`
      contadorItems++;
    }


    $("#pie").html(`<div class="modal fade" id="modalCarrito" tabindex="-1"  aria-hidden="true">
<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
  <div class="modal-content">
    <div class="modal-header border-bottom-0">
      <h5 class="modal-title">
        Carrito de compras
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    
    </div>
    <div class="modal-body">

    <table class="table align-middle table-image text-center">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Producto</th>
        <th scope="col">Precio</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Total</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
     
    ${content}
       
      </tr>
    </tbody>
  </table> 



      <div class="d-flex justify-content-end">
        <h5>Total: <span class="price text-success" id="total">$${total}</span></h5>
      </div>
    </div>
    <div class="modal-footer border-top-0 d-flex justify-content-between">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-success">Comprar Carrito</button>
    </div>
  </div>
</div>
</div>`);

    for (let i = 0; i < contadorItems; i++) {
        $(`#cantArt${i}`).val("1");
        $(`#subTotal${i}`).html(`$${parseFloat(($(`#cantArt${i}`).val())) * seleccionados[i].precio}`);

    }
$(".cantidades").change(function (e) { 
    e.preventDefault();
    
    let matches = this.id.match(/(\d+)/);
    let total2 = 0;
    
    $(`#subTotal${matches[0]}`).html(`$${parseFloat($(this).val()) * seleccionados[matches[0]].precio}`);
    let i = 0;
    for(const cantidad of $('.cantidades')){
       
    total2 += parseFloat($(cantidad).val()) * seleccionados[i].precio;
    i++;
    }
    $("#total").html(`$${total2}`);
});

    $('#modalCarrito').modal('show');

});






btnBuscar.addEventListener("click", function () { generarCardLibros(); }, false);

//Activar la caja de busqueda haciendo trigger del btnBuscar al apretar Enter
$("#cajaBuscador").keyup(function (event) {
    //Enter tecla 13
    if (event.keyCode === 13) {
        $("#btnBuscador").click();
    }
})
