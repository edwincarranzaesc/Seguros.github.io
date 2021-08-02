import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  cod,
  getString,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";

const daoMensaje = getFirestore().
  collection("Mensaje");
let AseguradoId = "";
/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLUListElement} */
const lista = document.
  querySelector("#lista");

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(Asegurado) {
  if (tieneRol(Asegurado,
    ["Cliente"])) {
    AseguradoId = Asegurado.email;
    consulta();
    forma.addEventListener(
      "submit", agrega);
  }
}

/** Agrega un usuario a la base de
 * datos.
 * @param {Event} evt */
async function agrega(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    /** @type {string} */
    const texto = getString(
      formData, "texto").trim();
    const timestamp =
      // @ts-ignore
      firebase.firestore.
        FieldValue.
        serverTimestamp();
    
    const modelo = {
      AseguradoId,
      texto,
      timestamp
    };
    
    await daoMensaje.add(modelo);
    forma.texto.value = "";
  } catch (e) {
    muestraError(e);
  }
}


function consulta() {
  
  daoMensaje.
    orderBy("timestamp", "desc").
    onSnapshot(
      htmlLista, errConsulta);
}

/** 
 * 
 * @param {import(
    "../lib/tiposFire.js").
    
 */
function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    /* 
     *  */
    snap.forEach(doc =>
      html += htmlFila(doc));
  } else {
    
    html += /* html */
      `<li class="vacio">
        -- Por el momento el ChatoBoot no se encuentra funcionando --
      </li>`;
  }
  lista.innerHTML = html;
}

/** Agrega el texto HTML

 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
function htmlFila(doc) {
  /** Recupera los datos del
   * documento.
   * @type {import("./tipos.js").
                      Mensaje} */
  const data = doc.data();
  /* Agrega un li con los datos
   
   * inyección de código. */
  return ( /* html */
    `<li class="fila">
      <strong class="primario">
        ${cod(data.AseguradoId)}
      </strong>
      <span class="secundario">
        ${cod(data.texto)}
      </span>
    </li>`);
}

/** Función que se invoca cuando
 * 
 * vez.
 * @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  // Intenta conectarse otra vez.
  consulta();
}
