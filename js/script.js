"use strict"

/// ----------------------------------------- PARTIAL RENDER ----------------------------------------- ///

let main = document.getElementById("main");
let loader = document.getElementById("cont-loader");

ListenersLinks()
document.getElementById("index").click()

async function PartialRender(event) {

    event.preventDefault();
    let scrollTop = main.offsetTop; //distancia entre "main" y el tope de la pagina

	//vaciamos el main y mostramos feedback visual de carga
	main.replaceChildren();
    loader.classList.add("show-loader");

    //fetch .html
	let response = await fetch(this.href);
	let content = await response.text();

    //cargamos el main con el contenido y ocultamos el loader
    loader.classList.remove("show-loader");
    main.innerHTML = content;

	//agregamos EventListeners a los nuevos elementos con las siguientes funciones
	ListenersLinks();

    //this.href en chrome devuelve una url completa, no la direccion relativa, por eso usamos this.getAttribute("href") para comparar
    switch ( this.getAttribute("href") ) {
        case "productos.html":
            if (this.id == "index")
                scrollTop = 0;
            break;
        case "mochilas.html":
        case "mates.html":
        case "gorras.html":
        case "rinioneras.html":
        case "cintos.html":
        case "bolsos.html":
            ListenersProducts();
            break;
        case "contacto.html": 
            ListenersCaptcha();
            break;
        case "carrito.html":
            ListenersCart();
    }
    
    //scrolleamos hasta el contenido, a menos que el link clickeado haya sido "inicio"
    window.scrollTo({ top: scrollTop, behavior: "smooth" });

	// forma alternativa de pedir el fetch
	// fetch(this.href).then(response => {
	// 	response.text().then(content => {
	//     	main.innerHTML = content;
	// 	});
	// });
}

function ListenersLinks() {
	let links = document.getElementsByClassName("links");
	
    for (let item of links) {
		item.addEventListener("click", PartialRender);
	}
}

/// ----------------------------------------- MENU STICKY EN SCROLL ----------------------------------------- ///

let navbarMobile = document.getElementById("header");
let stickyDistance = navbarMobile.offsetTop; 		// Distancia entre navbarMobile y el borde superior de la ventana

window.onscroll = ()=> {
	if (window.scrollY >= stickyDistance) {         // Si la distancia que hemos scrolleado es mayor a stickyDistance, hacer el navbar sticky
		navbarMobile.classList.add("header-menu-sticky");
	} else {
		navbarMobile.classList.remove("header-menu-sticky");
	}
}

/// ----------------------------------------- BANNER ----------------------------------------- ///

let slides = document.getElementsByClassName("slides");
let slideIndex = 0;

ShowSlides();

function ShowSlides() {
	slides[slideIndex].style.display = "none"; 	// Escondemos el slide que se estaba mostrando

	slideIndex++; 								// Iteramos el indice, para agarrar el siguiente
	if (slideIndex >= slides.length) {			// Si llegamos al ultimo (o nos pasamos) volvemos al indice 0
		slideIndex = 0;
	}

	slides[slideIndex].style.display = "block"; // Mostramos el nuevo slide en el banner
	setTimeout(ShowSlides, 5000); 				// Cambiar banner cada 5000ms.
}

/// ----------------------------------------- SIDEBAR ----------------------------------------- ///

let btnOpen = document.getElementById("btn-open");
let btnClose = document.getElementById("btn-close");
let btnProd = document.getElementById("btn-prod");

btnOpen.addEventListener("click", OpenSidebar);
btnClose.addEventListener("click", CloseSidebar);
btnProd.addEventListener("click", ToggleProd);

function OpenSidebar() {
	document.getElementById("sidebar").style.width = "250px";
}

function CloseSidebar() {
	document.getElementById("sidebar").style.width = "0";
}

function ToggleProd() {
	document.getElementById("sidebar-sub").classList.toggle("sidebar-sub-display");
}

/// ----------------------------------------- OPCIONES DE PAGO Y DELIVERY ----------------------------------------- ///

let btnPayments = document.getElementById("btn-payments");
let btnDeliveries = document.getElementById("btn-deliveries");

btnPayments.addEventListener("click", ShowPayments);
btnDeliveries.addEventListener("click", ShowDeliveries);

function ShowPayments() {
	document.getElementById("cont-payments").classList.toggle("display-flex");
}

function ShowDeliveries() {
	document.getElementById("cont-deliveries").classList.toggle("display-flex");
}

/// ----------------------------------------- CAPTCHA ----------------------------------------- ///

let captchaText;
let captchaResult;
let formContact;

function ListenersCaptcha() {

    formContact = document.getElementById("form-contacto");
	captchaText = document.getElementById("captcha-texto");
	captchaResult = document.getElementById("captcha-notificacion");
	formContact.addEventListener("submit", Compare);
	document.getElementById("btn-refresh").addEventListener("click", Generate);

	Generate();
}

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';  //alfabeto, de estos caracteres se va a componer el captcha
const ALPHASIZE = alphabet.length;                                                  //tamaño del alfabeto, para saber hasta q numero buscar
const LENGHT = 6;                                                                   //tamaño del captcha q queremos
var captchaIsWrong = false;                                                         //bool de control para limpiar la notificacion luego de un refresh, pero no luego de un error

function Generate() {

    let index = 1;
    let indexedChar = '';
    let captcha = "";
    
    for(let i=1; i<=LENGHT; i++){
        index = Math.floor(Math.random() * ALPHASIZE);      //consigo un numero random entre 0 y 62, lo uso como indice
        indexedChar = alphabet.charAt(index);               //busco en el alfabeto el caracter q corresponde al indice
        captcha += indexedChar;                             //construimos el captcha 1 letra a la ves
    }

    captchaText.innerHTML = captcha;                        //mostramos el captcha en la pagina
    
    if(captchaIsWrong)
        captchaIsWrong = false;                             //en caso de venir de un error, solo reiniciamos la booleana de control
    else
        captchaResult.innerHTML = "";                       //en caso de venir de un refresh, limpiamos la notificacion
}

function Compare(event){

    event.preventDefault();                                     //prevenimos que se recargue la pagina

    let datosFormulario = new FormData(formContact);            //guardamos la data del form enviado
    let captchaInput = datosFormulario.get("captcha-input");    //recuperamos el campo que nos interesa

    if (captchaInput == captchaText.innerHTML){
        captchaResult.innerHTML = "Gracias por enviarnos tu mensaje!";
        formContact.reset();	    //vaciamos el form
    }
    else {
        captchaResult.innerHTML = "Captcha mal ingresado, por favor intente nuevamente";
        captchaIsWrong = true;      //marcamos que venimos de un error para que Generate() no borre la notificacion
        Generate();                 //si t equivocas generamos de nuevo
    }
}

/// ----------------------------------------- AGREGAR DESDE PRODUCTOS ----------------------------------------- ///

function ListenersProducts() {

    let forms = document.getElementsByClassName("ul-producto-form");
	
    for (let item of forms) {
		item.addEventListener("submit", AddSingle);
	}
}

async function AddSingle(event) {

    event.preventDefault();

    let formData = new FormData(this);
    
    //obtenemos los valores de los input
    let nombre = formData.get("nombre")
    let precio = formData.get("precio");
    let categoria = formData.get("categoria");

    //construimos el objeto json
    let item = {
        nombre: nombre,
        precio: precio,
        cantidad: "1",
        categoria: categoria
    };

    //quitamos control al usuario para evitar que sature el servidor con requests facilmente
    this.classList.add("disable");

    try {
        let response = await fetch(`https://648caa018620b8bae7ed3718.mockapi.io/productos`, {
            "method": "POST",
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(item)
        });
        
        if (response.status == 201)
            console.log("Creado!");
        
        UpdateCounter(-1);
        //devolvemos control
        this.classList.remove("disable");        
    }
    catch (error){
        console.log(error);
    }
}

/// ----------------------------------------- CARRITO ----------------------------------------- ///

let divCart;
let selectProducts;

let inputName;
let inputPrice;
let inputQuantity;
let inputCategory;

let table;

let idCount;
let lastId;
let total;

let counterCart = document.querySelectorAll(".contador-cart");
UpdateCounter(-1);

function ListenersCart() {

    divCart = document.getElementById("carrito");
	selectProducts = document.getElementById("select-productos");
    
    inputName = document.getElementById("nombre-cart");
	inputPrice = document.getElementById("precio-cart");
    inputQuantity = document.getElementById("cantidad-cart");
    inputCategory = document.getElementById("categoria-cart");
    
	table = document.getElementById("tabla-dinamica");
    
	selectProducts.addEventListener("change", CompleteForm);
    document.getElementById("form-tabla").addEventListener("submit", Add);
	document.getElementById("btn-borrar").addEventListener("click", DeleteLast);
	document.getElementById("btn-reset").addEventListener("click", Reset);

	RenderTable();
}

function CompleteForm() {

    let selectedOption = selectProducts.options[selectProducts.selectedIndex]; //option elejido por el usuario (un producto)

    //reseteamos la cantidad al default
    inputQuantity.value = 1;

    //completamos 3 campos del form de forma automatica, nombre y categoria estan ocultos (hidden), precio es visible pero no editable
    inputName.value = selectedOption.text;                      //el texto del option elejido sera el nombre
    inputPrice.value = selectProducts.value;                    //el value de cada option corresponde al precio
    inputCategory.value = selectedOption.parentElement.label;   //revisamos el parent (optgroup) y usamos su label como categoria
}

/// ----------------------------------------- API REST Y TABLA DINAMICA ----------------------------------------- ///

async function Add(event) {

    event.preventDefault();

    let formData = new FormData(this);
    
    //obtenemos los valores de los input
    let nombre = formData.get("nombre")
    let precio = formData.get("precio");
    let cantidad = formData.get("cantidad");
    let categoria = formData.get("categoria");

    //construimos el objeto json
    let item = {
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
        categoria: categoria
    };

    //enviamos el item solo si la cantidad y el precio son validos
    if ( (item.cantidad > 0) && (item.precio > 0) ) {

        //quitamos control al usuario para evitar que sature el servidor con requests facilmente
        divCart.classList.add("disable");

        try {
            let response = await fetch(`https://648caa018620b8bae7ed3718.mockapi.io/productos`, {
                "method": "POST",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(item)
            });
         
            if (response.status == 201)
                console.log("Creado!");
            
            RenderTable();
        }
        catch (error){
            console.log(error);
        }
    }
}

async function DeleteLast(event) {

    event.preventDefault();

    try {
        if (idCount > 0){

            //quitamos control al usuario para evitar que sature el servidor con requests facilmente
            divCart.classList.add("disable");
            
            let response = await fetch(`https://648caa018620b8bae7ed3718.mockapi.io/productos/${lastId}`, {
                "method": "DELETE"
            });

            if (response.ok)
                console.log("Borrado!");
        }
    }
    catch (error){
        console.log(error);
    }
    
    RenderTable();
}

async function Reset(event) {

    event.preventDefault();

    try {
        if (idCount > 0) {

            //quitamos control al usuario para evitar que sature el servidor con requests facilmente
            divCart.classList.add("disable");
            
            let response = await fetch("https://648caa018620b8bae7ed3718.mockapi.io/productos");
            
            if (response.ok) {
                let jsonCart = await response.json();
            
                for (let item of jsonCart) {
                    response = await fetch(`https://648caa018620b8bae7ed3718.mockapi.io/productos/${item.id}`, {
                        "method": "DELETE"
                    });
                }

                if (response.ok)
                    console.log("Reseteado!");
            }
        }
    }
    catch (error){
        console.log(error);
    }
    
    RenderTable();
}

async function RenderTable() {

	//vaciamos la tabla y agregamos feedback visual
	table.replaceChildren();
    loader.classList.add("show-loader");

    //creamos y agregamos el thead
    let thead = document.createElement("thead");
    thead.appendChild( CreateTr("Articulo", "Precio", "Cantidad", "Importe") );
    table.appendChild(thead);
    
	//hacemos el fetch y recibimos el array de objetos
    try{
        let response = await fetch("https://648caa018620b8bae7ed3718.mockapi.io/productos");
	    
        if (response.ok) {

            let jsonCart = await response.json();
            
            //terminamos el feedback visual
            loader.classList.remove("show-loader");

            //analizamos el array contando los elementos de oferta para resaltarlos, un elemento a la vez
            table.appendChild( ProcessCart(jsonCart) ); //ProcessCart retorna un tbody, con cada tr armado y resaltado si es necesario

            idCount = jsonCart.length;
            UpdateCounter(idCount);
            console.log("numero de items: " + idCount);

            //creamos y agregamos el tfoot
            let tfoot = document.createElement("tfoot");
            tfoot.appendChild( CreateTr("", "", "Total:", total) );
            table.appendChild(tfoot);

            //devolvemos el control al usuario, todas las funciones que llamen RenderTable quitaran control al usuario antes de su request
            divCart.classList.remove("disable");
	    }
        else {
            FetchError("Error de respuesta del servidor!");
        }
    }
    catch(error) {
        FetchError("Error!");
        console.log(error);
    }
}

function ProcessCart(jsonCart) {

    let tbody = document.createElement("tbody");
    let contadorOferta = 0;
    total = 0;    

    for (let item of jsonCart){
        let deOferta = "null";	//la clase no puede ser un string vacio para el metodo classList.add() que usamos luego, entonces usamos un nombre de clase no utilizado
        let precio = item.precio;
        
        if ((item.categoria == "Mochilas") || (item.categoria == "Bolsos")) {
            contadorOferta+= item.cantidad;
            if (contadorOferta >= 2) {
                deOferta = "oferta";
                precio *= 0.8;
            }
        }

        let importe = precio*item.cantidad;
        total += importe;
        
        //armamos cada tr y lo agregamos al tbody
        let tr = CreateTr(item.nombre, precio, item.cantidad, importe);
        tr.classList.add(deOferta);
        tbody.appendChild(tr);
    }

    if (jsonCart.length > 0 )
        lastId = jsonCart[jsonCart.length-1].id;
    else
        lastId = 0;

    return tbody;
}

async function UpdateCounter(idCount) {

    if (idCount < 0) {
        try{
            let response = await fetch("https://648caa018620b8bae7ed3718.mockapi.io/productos");
            if (response.ok) {
                let jsonCart = await response.json();
                idCount = jsonCart.length;
            }
        }
        catch (error){
            console.log(error);
        }
    }

    //actualizamos el icono de carrito
    for (let counter of counterCart) {
        counter.innerHTML = idCount;
    }
}

function FetchError(errorString) {
    
    let errorText = document.createTextNode(errorString);
    let errorH1 = document.createElement("h1");
    errorH1.appendChild(errorText);
    table.appendChild(errorH1);
}

function CreateTr(a, b, c, d) {

	const tr = document.createElement("tr");
    
    const textA = document.createTextNode(a);
	const textB = document.createTextNode(b);
	const textC = document.createTextNode(c);
	const textD = document.createTextNode(d);
    
	const tdA = document.createElement("td");
	const tdB = document.createElement("td");
	const tdC = document.createElement("td");
	const tdD = document.createElement("td");

	tdA.appendChild(textA);
	tdB.appendChild(textB);
	tdC.appendChild(textC);
	tdD.appendChild(textD);
	tr.append(tdA, tdB, tdC, tdD);

    return tr;
}