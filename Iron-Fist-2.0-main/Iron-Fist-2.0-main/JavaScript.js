if (window.Swal) {
Swal.fire({
    title : '¿Preparado para salvar el mundo?',
    html: '<div class="Alerta_Inicio_Contenido"><div class="Alerta_Inicio_Planeta"><img src="IMG/planeta_tierra.png" alt="Planeta Tierra"></div><p><strong>IRON FIST</strong> es un juego que mejorara tus reflejos a medida que pases de nivel, retandote cada vez mas y desbloqueando grandes logros al final de cada uno.</p><div class="Alerta_Inicio_Caracteristicas"><div><i class="fas fa-bolt"></i><span>Reflejos</span></div><div><i class="fas fa-fire"></i><span>Meteoritos</span></div><div><i class="fas fa-trophy"></i><span>Logros</span></div></div><strong class="Alerta_Inicio_Cierre">¡Esperamos que lo disfrutes!</strong></div>',
    icon: undefined,
    confirmButtonText: '¡ESTOY PREPARADO!',
    width: 'min(92vw, 560px)',
    customClass: {
        popup: 'Alerta_Inicio_Popup',
        title: 'Alerta_Inicio_Titulo',
        htmlContainer: 'Alerta_Inicio_Texto',
        confirmButton: 'Alerta_Inicio_Boton',
        timerProgressBar: 'Alerta_Inicio_Progreso'
    },
    buttonsStyling: false,
    timer: 100000,
    
    
    timerProgressbar: true,
    /*Funcion de cerrar la alerta*/
    allowOutsideClick: true,
    allowEscapeKey: false,
    allowEnterkey: false,
    stopKeydownPropagation: false,
    });
}

//VALORES PRINCIPALES DEL NIVEL 1, ACA ARRANCA EL TIEMPO, PUNTAJE Y LA META REAL DEL NIVEL
Tiempo = 71 //VARIBLE DE INICIO TIEMPO
Puntaje = 0 //VARIABLE DE INICIO PUNTOS
var Puntaje_Meta_Nivel1 = 27

//ESTE BLOQUE GUARDA LA VIDA DEL PLANETA POR NIVEL, ASI NO SE MEZCLA EL NIVEL 1 CON EL 2 O 3
var VidaPlanetaPorNivel = {}
var Volumen_Juego_Actual = 0.5

//PREPARA LA BARRA DE VIDA DEL PLANETA SEGUN CUANTOS GOLPES PUEDE AGUANTAR
function ConfigurarVidaPlaneta(nivel, golpesPermitidos) {
    VidaPlanetaPorNivel[nivel] = {
        vida: 100,
        danoPorGolpe: Math.ceil(100 / golpesPermitidos)
    }
    ActualizarVidaPlaneta(nivel)
}

//PINTA LA VIDA EN PANTALLA Y CAMBIA EL COLOR DE LA BARRA CUANDO YA ESTA PELIGRANDO
function ActualizarVidaPlaneta(nivel) {
    var estado = VidaPlanetaPorNivel[nivel]
    if (!estado) { return }

    var barra = document.getElementById(nivel === 1 ? "BarraEscudo" : "BarraEscudoLvl" + nivel)
    var texto = document.getElementById("VidaPlanetaTexto" + nivel)
    var vida = Math.max(0, Math.min(100, estado.vida))

    if (barra) {
        barra.style.width = vida + "%"
        barra.classList.toggle("vida-media", vida <= 66 && vida > 33)
        barra.classList.toggle("vida-baja", vida <= 33)
    }

    if (texto) {
        texto.textContent = vida + "%"
    }
}

//LE BAJA VIDA AL PLANETA CUANDO UN METEORITO PASA EL LIMITE, Y AVISA SI YA PERDIMOS TODO
function DanarVidaPlaneta(nivel) {
    var estado = VidaPlanetaPorNivel[nivel]
    if (!estado) {
        ConfigurarVidaPlaneta(nivel, 3)
        estado = VidaPlanetaPorNivel[nivel]
    }

    estado.vida = Math.max(0, estado.vida - estado.danoPorGolpe)
    ActualizarVidaPlaneta(nivel)

    return estado.vida === 0
}

//VUELVE A DEJAR LA VIDA EN 100%, SE USA CUANDO GANAS O CUANDO TOCA REINICIAR EL INTENTO
function ReiniciarVidaPlaneta(nivel) {
    if (!VidaPlanetaPorNivel[nivel]) {
        ConfigurarVidaPlaneta(nivel, 3)
        return
    }

    VidaPlanetaPorNivel[nivel].vida = 100
    ActualizarVidaPlaneta(nivel)
}

//PARA CORTAR UN AUDIO DE GOLPE Y DEJARLO LISTO DESDE EL INICIO
function DetenerAudio(idAudio) {
    var audio = document.getElementById(idAudio)
    if (!audio) { return }

    audio.pause()
    audio.currentTime = 0
}

//APLICA EL MISMO VOLUMEN A TODOS LOS AUDIOS Y SINCRONIZA LOS 3 SLIDERS DEL JUEGO
function Aplicar_Volumen_Juego(valor) {
    valor = Number(valor)
    if (Number.isNaN(valor)) {
        valor = 0.5
    }

    Volumen_Juego_Actual = Math.max(0, Math.min(1, valor))

    document.querySelectorAll('audio').forEach(function(audio) {
        audio.volume = Volumen_Juego_Actual
    })

    document.querySelectorAll('#VolumenControl, .Volumenlvl2 input[type="range"], .Volumenlvl3 input[type="range"]').forEach(function(control) {
        control.value = Volumen_Juego_Actual
    })
}

//REPRODUCE UN AUDIO SOLO SI ESTA PAUSADO, PARA QUE NO SE SIENTA COMO MUSICA ENCIMA DE MUSICA
function ReproducirAudioJuego(idAudio, reiniciar) {
    var audio = document.getElementById(idAudio)
    if (!audio) { return }

    audio.volume = Volumen_Juego_Actual
    if (reiniciar) {
        audio.currentTime = 0
    }

    if (audio.paused) {
        audio.play().catch(function() {})
    }
}

//PAUSA UN AUDIO Y, SI HACE FALTA, LO DEVUELVE AL SEGUNDO CERO
function PausarAudioJuego(idAudio, reiniciar) {
    var audio = document.getElementById(idAudio)
    if (!audio) { return }

    audio.pause()
    if (reiniciar) {
        audio.currentTime = 0
    }
}

//MUSICA NORMAL DEL JUEGO, APAGA LA FINAL POR SI VENIMOS DE OTRO ESTADO RARO
function ReproducirMusicaFondo() {
    PausarAudioJuego("Musica_Final", true)
    ReproducirAudioJuego("Fondo_Ciberpunk", false)
}

//PAUSA LA MUSICA PRINCIPAL SIN REINICIARLA, UTIL PARA EL BOTON DE PAUSA
function PausarMusicaFondo() {
    PausarAudioJuego("Fondo_Ciberpunk", false)
}

//CUANDO SE GANA EL NIVEL 3, CORTA LO DEMAS Y SUELTA LA MUSICA EPICA FINAL
function ReproducirMusicaFinal() {
    PausarAudioJuego("Fondo_Ciberpunk", true)
    DetenerAudio("Triunfo")
    DetenerAudio("Ganaste")
    ReproducirAudioJuego("Musica_Final", true)
}

//LIMPIA LOS AUDIOS AL CAMBIAR DE NIVEL, PARA NO ARRASTRAR SONIDOS VIEJOS
function DetenerMusicaCambioNivel() {
    DetenerAudio("Triunfo")
    DetenerAudio("Ganaste")
    DetenerAudio("Musica_Final")
    DetenerAudio("Fondo_Ciberpunk")
    DetenerAudio("Puntos_sound")
    DetenerAudio("Punto2")
    DetenerAudio("Punto3")
    DetenerAudio("Punto4")
}



//FUNCION DE NARRACIONES

Narracion = 1
document.getElementById("Contenedor_narracion").addEventListener('click',  Iniciar_narracion)
document.getElementById("narracion").addEventListener('ended', Mostrar_Play_Narracion)

//DEJA EL BOTON DE LA HISTORIA OTRA VEZ EN PLAY CUANDO LA NARRACION SE PAUSA O TERMINA
function Mostrar_Play_Narracion(){
    document.getElementById("VOLUMEN").style.display = "inline-flex"
    document.getElementById("PAUSE").style.display = "none"
    Narracion = 1
}

//BOTON DE PLAY/PAUSA DE LA NARRACION DEL CAPITULO, SOLO CAMBIA EL ICONO QUE TOCA VER
function Iniciar_narracion(){
    if(Narracion == 1){
    document.getElementById("narracion").play()
    document.getElementById("VOLUMEN").style.display = "none"
    document.getElementById("PAUSE").style.display = "inline-flex"
    Narracion = 2}
    else{
        document.getElementById("narracion").pause()
        document.getElementById("VOLUMEN").style.display = "inline-flex"
        document.getElementById("PAUSE").style.display = "none"
        Narracion = 1
    }
}




Graficos = 1 //Este es el medidor de graficos

//En esta funcion cambio de fondo al presionar el CHEKBOX, para graurar los graficos dentro del juego
function Graficos_fondo(){
Contenedor_RQ = document.getElementById("Contenedor_RC")
if(Graficos == 1){
document.getElementById("Recursos").style.marginLeft = "60%"
document.getElementById("Fondo").style.background = "url(IMG/Fondo_Espacio2.jpg)"
document.getElementById("Fondo").style.backgroundAttachment = "fixed"
document.getElementById("Fondo").style.backgroundRepeat = "no-repeat"
document.getElementById("Fondo").style.backgroundSize = "100% 120%"
Graficos = 2}
else{
document.getElementById("Recursos").style.marginLeft = "0%"
document.getElementById("Fondo").style.backgroundImage = "url(IMG/Fondo_Espacio.gif) "
Graficos = 1
}
}






//CONTENEDOR QUE CONTEIENE TOO EL JUEGO
//DE POR SI ESTA FUNCION NO SE EJECUTA HASTA QUE SE LA LLAMA, MAS ADELANTE LA LLAMAREMOS
//PARA QUE EL JUEGO INICIE UNA VEZ SE PRESIONE JUGAR
function JUEGO(){
    //ESTAS BANDERAS EVITAN QUE EL NIVEL SIGA MOVIENDO COSAS DESPUES DE GANAR
    var Juego_Nivel1_Terminado = false
    var Intervalo_Perdida_Nivel1
    ConfigurarVidaPlaneta(1, 3)

    function Tiempo_Disminur(){ //FUNCION QUE REDUCE EL TIEMPO Y RESETEAL EL RESULTADO UNA VEZ LLEGUE A 0
        if(Juego_Nivel1_Terminado){ return }
        Tiempo--;
        document.getElementById("Tiempo").innerHTML = Tiempo
        if(Tiempo == 0){
            Tiempo = 71
            Puntaje = 0
            VidaPlanetaPorNivel[1].vida = 0
            ActualizarVidaPlaneta(1)
            document.getElementById("Perdiste_sound").play()
            alert("Lo lamento perdiste")
            ReiniciarVidaPlaneta(1)
            document.getElementById("Puntaje").innerHTML = 0+"&nbsp;/&nbsp;"+27} }

    
        Restar_Tiempo = setInterval(Tiempo_Disminur, 1000)

        //AÑADIMOS LA FUNCION AUMENTAR PUNTOS AL PASAR EL CURSOR SOBRE LOS METIORITOS
        document.getElementById("Meteiorito").addEventListener('mouseover', Aumentar_Puntos)
        document.getElementById("Meteiorito2").addEventListener('mouseover', Aumentar_Puntos)


        //FUNCION QUE UNICAMENTE AUMENTA PUNTOS Y RESETEA LAS VARIABLES AL LLEGAR A CIERTO LIMITE
        function Aumentar_Puntos(){
            if(Juego_Nivel1_Terminado){ return }
            Puntaje++;
            document.getElementById("Puntaje").innerHTML = Puntaje + "&nbsp;/&nbsp;" + Puntaje_Meta_Nivel1
            if(Puntaje >= Puntaje_Meta_Nivel1){
                Juego_Nivel1_Terminado = true
                Puntaje = 0 
                Tiempo = 71
                ReiniciarVidaPlaneta(1)


                //CUANDO YA SE CUMPLE EL PUNTAJE, ESTE BOTON MANDA AL NIVEL 2
                document.getElementById("NEXT").onclick = Habilitar_Siguienten_LVL
                function Habilitar_Siguienten_LVL(){
                DetenerMusicaCambioNivel()
                clearInterval(Desbloquear_Pantalla)
                document.getElementById("Seccion_Juego").classList.remove("juego-activo")
                document.getElementById("NIVEL_01").style.display = "none"
                document.getElementById("NIVEL_02").style.display = "block"
                document.getElementById("GANASTE_PANTALLA").style.display = "none"
                document.getElementById("Contenedor_LVL").classList.remove("nivel-disponible")
                document.getElementById("Contenedor_LVL").style.display = "none"}
                document.getElementById("Tiempo").innerHTML = 70
                document.getElementById("Puntaje").innerHTML = 0+"&nbsp;/&nbsp;"+Puntaje_Meta_Nivel1
                document.getElementById("Triunfo").play()
                PausarMusicaFondo()
                document.getElementById("Puntos_sound").pause()
                document.getElementById("Punto2").pause()
                document.getElementById("GANASTE_PANTALLA").style.display = "flex"
                document.body.appendChild(document.getElementById("Contenedor_LVL"))
                document.getElementById("Contenedor_LVL").classList.add("nivel-disponible")
                document.getElementById("Contenedor_LVL").style.setProperty("display", "flex", "important")
                
                //CONGELA LOS METEORITOS Y APAGA LOS INTERVALOS PARA QUE NO SIGAN MOLESTANDO EN LA PANTALLA DE VICTORIA
                function Ganaste_Pantalla(){

                    clearInterval(Reanudar_trayectoria)
                    clearInterval(Reanudar_trayectoria2)
                    clearInterval(Restar_Tiempo)
                    clearInterval(Intervalo_Perdida_Nivel1)

                    document.getElementById("Meteiorito").style.left = "-70%"
                    document.getElementById("Meteiorito").style.transition = "0s"

                    document.getElementById("Meteiorito2").style.left = "-70%"
                    document.getElementById("Meteiorito2").style.transition = "0s"}
                    
                Desbloquear_Pantalla  =  setInterval(Ganaste_Pantalla, 50)

                Swal.fire({
                    title : 'FELICIDADES POR SUPERAR <br> EL NIVEL <br><br> <img src="IMG/Check.png" width = "120px"><br>',
                    html: 'Al parecer nos salvamos, agradecemos tu ayuda y ezfuerzo al superar este nivel, esperamos seguir contando contigo, si algo mas sucede y por cierto, no olvides que te esperan grandes cosas al final del juego asi que no pares de intentar ',
                    icon: undefined,
                    confirmButtonText: 'QUIERO CONTINUAR',
                    width: 'min(88vw, 560px)',
                    customClass: {
                        popup: 'Alerta_Logro_Popup',
                        title: 'Alerta_Logro_Titulo',
                        htmlContainer: 'Alerta_Logro_Texto',
                        confirmButton: 'Alerta_Logro_Boton',
                        timerProgressBar: 'Alerta_Logro_Progreso'
                    },
                    buttonsStyling: false,
                    timer: 100000,
                    
                    
                    timerProgressbar: true,
                    /*Funcion de cerrar la alerta*/
                    allowOutsideClick: true,
                    allowEscapeKey: false,
                    allowEnterkey: false,
                    stopKeydownPropagation: false,
                    });
                    
                        }
                    }



        //ESTA FUNCION DIRIGE AL PRIMER METIORITO 1 A LA TIERRA 
        function Metiorito_Direccion(){
            if(Juego_Nivel1_Terminado){ return }
            Distancia1 = 80
            Altura1 = Math.round(Math.random()* 450)

            document.getElementById("Meteiorito").style.left = Distancia1 + "%"
            document.getElementById("Meteiorito").style.top = Altura1 + "px"}

            setTimeout(Metiorito_Direccion, 2000)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
            Reanudar_trayectoria = setInterval(Metiorito_Direccion, 2430)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,4 SEGUNDOS


        //ESTA FUNCION DIRIGE AL PRIMER METIORITO 2 A LA TIERRA         
        function Metiorito_Direccion2(){
            if(Juego_Nivel1_Terminado){ return }
            Distancia2 = 80
            Altura2 = Math.round(Math.random()* 450)

            document.getElementById("Meteiorito2").style.left = Distancia2 + "%"
            document.getElementById("Meteiorito2").style.top = Altura2 + "px"}

            setTimeout(Metiorito_Direccion2, 2600)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
            Reanudar_trayectoria2 = setInterval(Metiorito_Direccion2, 2350)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,3 SEGUNDOS


        //AQUI ADJUNTAMOS LA ACCION DE LA FUNCION EXPULZAR AL PASAR SOBRE EL METIORITO
        document.getElementById("Meteiorito").addEventListener('mouseover', Explulsar)
        document.getElementById("Meteiorito2").addEventListener('mouseover', Explulsar2)


        //ESTA ES LA FUNCION QUE EXPULSA AL METIRITO 1 DE MANERA ALEATORIA FUERA DEL MAPA
        function Explulsar (){
            if(Juego_Nivel1_Terminado){ return }
            document.getElementById("Puntos_sound").play()
            Distancia = "-500"
            Altura = Math.round(Math.random()* 450)

            document.getElementById("Meteiorito").style.left = Distancia + "px"
            document.getElementById("Meteiorito").style.top = Altura + "px"
            document.getElementById("Meteiorito").style.transition = "1.8s"}


        //ESTA ES LA FUNCION QUE EXPULSA AL METIRITO 2 DE MANERA ALEATORIA FUERA DEL MAPA
        function Explulsar2 (){
            if(Juego_Nivel1_Terminado){ return }
            document.getElementById("Punto2").play()
            Distancia = "-500"
            Altura = Math.round(Math.random()* 450)
    
            document.getElementById("Meteiorito2").style.left = Distancia + "px"
            document.getElementById("Meteiorito2").style.top = Altura + "px"
            document.getElementById("Meteiorito2").style.transition = "1.8s"}




        
        //ESTA FUNCION SE ENCARGA DE ALERTARTE UNA VEZ EL METIORITO CRUZE LA LINEA CON UN PERDISTE
        //TAMBIEN RESETEA LOS VALORES Y LLEVA A LOS METIORITOS FUERA DEL MAPA DE MANERA INSTANTANEA
        function perdiste (){
            if(Juego_Nivel1_Terminado){ return }
            var limite = document.querySelector(".Limite_Laser_Red")
            var limiteX = limite ? limite.getBoundingClientRect().left : window.innerWidth * 0.7

            //MIDE EL METEORITO EN PANTALLA PARA SABER SI YA TOCO LA LINEA ROJA
            function Meteorito_Cruzo_Limite(id){
                var meteorito = document.getElementById(id)
                var posicion = meteorito.getBoundingClientRect()

                return posicion.left > 0 && posicion.right >= limiteX
            }

            if(Meteorito_Cruzo_Limite("Meteiorito") || Meteorito_Cruzo_Limite("Meteiorito2")) {

                document.getElementById("Perdiste_sound").play()
                document.getElementById("Meteiorito").style.left = "-70%"
                document.getElementById("Meteiorito").style.transition = "0s"

                document.getElementById("Meteiorito2").style.left = "-70%"
                document.getElementById("Meteiorito2").style.transition = "0s"
                
                if (DanarVidaPlaneta(1)) {
                    alert("YA ES DEMASIADO TARDE, LOS METEORITOS DESTRUYERON GRAN PARTE DEL CONTINENTE Y LO MEJOR ES ESPERAR LO PEOR")
                    ReiniciarVidaPlaneta(1)
                    Tiempo = 71
                    Puntaje = 0
                    document.getElementById("Tiempo").innerHTML = 70
                    document.getElementById("Puntaje").innerHTML = 0+"&nbsp;/&nbsp;"+Puntaje_Meta_Nivel1
                } }
        
            else {
                document.getElementById("Meteiorito").style.transition = "2.4s"
                document.getElementById("Meteiorito2").style.transition = "2.4s"} }

        Intervalo_Perdida_Nivel1 = setInterval(perdiste, 80)//SE REVISA VARIAS VECES POR SEGUNDO SIN CONGELAR EL NAVEGADOR
        //QUE NO SABEMOS CUANDO EL METIORITO VA A SUPERAR EL LIMITE
        }

        
        //LE DECIMOS QUE AL PRECIONAR EL BOTON JUGAR EJECUTARA LA FUNCION PLAY     
        //ESTA BANDERA ES PARA QUE NO ARRANQUE DOS VECES SI LE DAN DOBLE CLICK A JUGAR
        var Juego_Nivel1_Iniciado = false
        document.getElementById("Play").addEventListener('click', PLAY)

        Conteo = 4 //ESTE ES EL CONTEO DE LA CUENTA REGRESIVA QUE SE DA DESPUEZ DE PRESINAR JUGAR
            
            //ESTA FUNCION EJECUTA UN CONJUNTO DE ACCIONES AL PRESIONAR JUGAR
            function PLAY(){
                if (Juego_Nivel1_Iniciado) { return }
                Juego_Nivel1_Iniciado = true
                ReproducirMusicaFondo()
                //SACA LA PANTALLA DE INICIO Y DESPUES DE LA CUENTA REGRESIVA YA ARRANCA EL NIVEL
                //MUEVE EL TITULO FUERA DEL CONTENEDOR UNA VEZ DE CLICK A JUGAR
                document.getElementById("Texo").style.left = "-900px" 
                //MUEVE AL BOTON PLAY TRANS PRESIONAR PRESIONAR AL MISMO BOTON
                document.getElementById("Contenedor_Mensaje_Star").style.left = "-100%" 
                    //ESTA FUNCION CONTIENE AL JUEGO COMO TAL
                    function ARRACAR(){    
                        JUEGO()}
                //INVOCA AL JUEGO UNA VEZ PASEN 4 SEGUNDO - OSEA UNA VEZ TERMINE EL CONTADOR
                tiempo_de_arranque =  setTimeout(ARRACAR, 4100)
                //ESTA FUNCION EJECUTA LA CUENTA REGRESIVA Y RETIRA LA PANTALLA START 
                function ESPERAR(){
                    function Cuenta_rg(){
                        Conteo--;
                        document.getElementById("RGB").innerHTML = Conteo
                        if(Conteo == -1){
                        document.getElementById("Contenedor_contador").style.display = "none"
                        function Borrar(){
                        document.getElementById("Start").style.display = "none"

                            DETENER_JUEGO() }//HABILITA LA FUNCION DE PAUSE Y REANUDAR UNA VEZ CARGUE EL JUEGO
                        setTimeout(Borrar, 500) }  }
                        setInterval (Cuenta_rg, 1000)}

                        setTimeout(ESPERAR, 350)}//SE EJECUTARA EN UN LAPSO DE 350, DESPUES DE PRESIONAR EL BOTON





            //ESTA FUNCION CONTIENE EL REANUDE Y PAUSE DEL BOTON
            function DETENER_JUEGO (){
                //INDICA QUE LA FUNCION DE PAUSE SE EJECUTARA UNA VEZ SE DE CLICK AL BOTON DE PAUSE        
                document.querySelectorAll("#Pause").forEach(function(BotonPause){
                    BotonPause.addEventListener('click', PAUSE)
                })
                document.getElementById("Reanudar").addEventListener('click', function(evento){
                    evento.stopPropagation()
                    PAUSE()
                })
                //ESTA VARIABLE INDICA SI SE EJECUTA O NO EL DESPAUSEO
                Activo = 1 
                    //HACE QUE EL JUEGO SE DETENGA
                    function PAUSE(){ //Colocar la funcion de pausa y reanudar
                        //SI LLEGA A UNA EJECUTA LA FUNCION PAUSE
                        if (Activo == 1){
                        
                        PausarMusicaFondo()
                        document.getElementById("Pausa_Pantalla").style.display = "flex"
                        clearInterval(Restar_Tiempo)//BORRAMOS LA FUNCION DE TIEMPO
                        document.getElementById("Tiempo").innerHTML = Tiempo
                        clearInterval(Reanudar_trayectoria2)
                        clearInterval(Reanudar_trayectoria)

                            //DEJA LOS METEORITOS QUIETOS EXACTAMENTE DONDE ESTABAN CUANDO PAUSASTE
                            function Metiorito_detener (){   
                            document.getElementById("Meteiorito").style.left = document.getElementById("Meteiorito").offsetLeft + "px" 
                            document.getElementById("Meteiorito2").style.left = document.getElementById("Meteiorito2").offsetLeft + "px" 

                            document.getElementById("Meteiorito").style.top = document.getElementById("Meteiorito").offsetTop + "px" 
                            document.getElementById("Meteiorito2").style.top = document.getElementById("Meteiorito2").offsetTop + "px" }

                            Pusae_offf = setInterval(Metiorito_detener, 50) //LE ASEGNAMOS UNA ID, PARA BORRALO UNA VEZ SE DESPAUSEE
                            Activo = 2} //CAMBIAMOS EL VALOR PARA QUE AL VOLVER A DARLE CLICK EJECUTE LA CONDICIONAL DE REANUDAR

                        else { //LA FUNCION DE REANUDAR
                            clearInterval(Pusae_offf) //BORRAMOS LA FUNCION, PARA QUE EL REANUDAR PUEDA EJECUTARSE DE NUEVO
                            document.getElementById("Pausa_Pantalla").style.display = "none"
                            ReproducirMusicaFondo()
                            //VUELVE A CREAR EL RELOJ Y LAS RUTAS DE METEORITOS PARA CONTINUAR LA PARTIDA
                            function Tiempo_Disminur(){//VOLVEMOS A CREAR LA FUNCION DE TIEMPO PARA QUE REANUEDE EL CONTEO
                                Tiempo--;
                                document.getElementById("Tiempo").innerHTML = Tiempo
                                if(Tiempo == 0){
                                    Tiempo = 71
                                    Puntaje = 0
                                VidaPlanetaPorNivel[1].vida = 0
                                ActualizarVidaPlaneta(1)
                                document.getElementById("Perdiste_sound").play()    
                                alert("Lo lamento perdiste")
                                ReiniciarVidaPlaneta(1)
                                document.getElementById("Meteiorito").style.left = "-70%"
                                document.getElementById("Meteiorito").style.transition = "0s" //CREAR UNA FUNCION EN BASE A ESTO Y PASAR COMO REANUDAR EN GANASTE
                
                                document.getElementById("Meteiorito2").style.left = "-70%"
                                document.getElementById("Meteiorito2").style.transition = "0s"}
                                
                                else{
                                    document.getElementById("Meteiorito").style.transition = "2.4s"
                                    document.getElementById("Meteiorito2").style.transition = "2.4s"}}

                        Restar_Tiempo = setInterval(Tiempo_Disminur, 1000)
        
                        document.getElementById("Meteiorito").style.left = Distancia1 + "%"
                        document.getElementById("Meteiorito").style.top = Altura1 + "px"
                        document.getElementById("Meteiorito").style.transition = "2.4s"

                        document.getElementById("Meteiorito2").style.left = Distancia2 + "%"
                        document.getElementById("Meteiorito2").style.top = Altura2 + "px"
                        document.getElementById("Meteiorito2").style.transition = "2.4s"

                        
                        function Metiorito_Direccion(){
                            Distancia1 = 80
                            Altura1 = Math.round(Math.random()* 450)
                
                            document.getElementById("Meteiorito").style.left = Distancia1 + "%"
                            document.getElementById("Meteiorito").style.top = Altura1 + "px"}
                
                            setTimeout(Metiorito_Direccion, 2000)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
                            Reanudar_trayectoria = setInterval(Metiorito_Direccion, 2430)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,4 SEGUNDOS
                
                
                        //ESTA FUNCION DIRIGE AL PRIMER METIORITO 2 A LA TIERRA         
                        function Metiorito_Direccion2(){
                            Distancia2 = 80
                            Altura2 = Math.round(Math.random()* 450)
                
                            document.getElementById("Meteiorito2").style.left = Distancia2 + "%"
                            document.getElementById("Meteiorito2").style.top = Altura2 + "px"}
                
                            setTimeout(Metiorito_Direccion2, 2000)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
                            Reanudar_trayectoria2 = setInterval(Metiorito_Direccion2, 2350)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,3 SEGUNDOS





                        Activo = 1} } } //CAMBIAMOS EL VALOR DE NUEVO A 1 PARA QUE AL SIGUIENTE CLICK SE EJECUTE EL PAUSE  S



    





//TRANSICIONES ENTRE PAGINAS----------------------------------------------------------------------------------



function Mover() {//TRANSICION DE LA PRIMERA SECCION A LA SEGUNDA
    var contenedor = document.getElementById("Seccion_01")
    contenedor.style.top = "-100%"
    contenedor.style.transition = "2s"
    function Desaparecer(){
    var contenedor = document.getElementById("Seccion_01")
    var Reglas = document.getElementById("Reglas")

    Reglas.style.top = "3%"
    Reglas.style.transition = "1s"
    contenedor.style.display = "none"


    }
    setTimeout(Desaparecer,1090)

}


function Mover_2(){
    var Reglas_Sacar = document.getElementById("Reglas") 

    //AL SALIR DE LAS REGLAS APAGAMOS LA MUSICA PARA QUE LA HISTORIA NO ARRANQUE CON RUIDO ENCIMA
    DetenerAudio("Fondo_Ciberpunk")

    Reglas_Sacar.style.top = "-100%"
    Reglas_Sacar.style.transition = "1.4s"



    function Desaparecer2(){
    var Reglas_Sacar = document.getElementById("Reglas")
    var contenedor_2 = document.getElementById("Seccion_2")
    var imagen = document.getElementById("Imagen")
    var mensaje = document.getElementById("Mensaje")
    var titulo = document.getElementById("Titulo_historia")
 
    Reglas_Sacar.style.display = "none"
    contenedor_2.style.top = "0%"

    imagen.style.left = "50%"
    imagen.style.transform = "translateX(-50%)"
    imagen.style.transition = "2s"
    mensaje.style.right = "50%"
    mensaje.style.transform = "translateX(50%)"
    mensaje.style.transition = "2s"
    titulo.style.left = "2%"
    titulo.style.transition = "1s"
    }
    setTimeout(Desaparecer2, 1260)



}


function Mover_3 (){//TRANSICION DE LA SEGUNDA SECCION A LA TERCERA 

var contenedor_2 = document.getElementById("Seccion_2")
var Supremo = document.getElementById("Seccion_suprema")

document.getElementById("narracion").pause()
Mostrar_Play_Narracion()
//AL ENTRAR AL JUEGO SE ESCONDE LA HISTORIA Y SE PREPARA EL CONTENEDOR DEL NIVEL 1
contenedor_2.style.top = "-100%"
contenedor_2.style.transition = "1.4s"
Supremo.style.height = "160vh" //Le aumente para que no tape al contenedor del juego


    function Desaparaceer3(){
    var Seccion_Juego = document.getElementById("Seccion_Juego")
    var contenedor_2 = document.getElementById("Seccion_2")
    var juego = document.getElementById("Registraar")
    var Titulo_jugar = document.getElementById("Titulo_jugar")
    var Contenedor_juego = document.getElementById("Contenedor_Juego")
    var Cabezara = document.getElementById("Cabezera")

        Seccion_Juego.classList.add("juego-activo")
        contenedor_2.style.display = "none"
        if (juego) {
            juego.style.top = "0%"
            juego.style.transition = "0s"
        }
        if (Titulo_jugar) {
            Titulo_jugar.style.left = "0%"
            Titulo_jugar.style.transition = "0.8s"
        }
        if (Contenedor_juego) {
            Contenedor_juego.style.left = "0%"
            Contenedor_juego.style.transition = "1.2s"
        }
        if (Cabezara) {
            Cabezara.style.left = "0%"
            Cabezara.style.transition = "1.2s"
        }

    }

    setTimeout(Desaparaceer3, 900)
}

//RELOJ


function Reloj_Tiempo(){
    //RELOJ DECORATIVO DE LA PAGINA, SI FALTA ALGUN ELEMENTO NO ROMPE NADA Y SOLO SE SALE
    var actualizar_Hora = function(){
        var Fecha = new Date(),
        Horas = Fecha.getHours(),
        ampm,
        Minutos = Fecha.getMinutes(),
        Segundos = Fecha.getSeconds(),
        diaSemana = Fecha.getDay(),
        dia = Fecha.getDate(),
        mes = Fecha.getMonth(),
        Año = Fecha.getFullYear();

        var pHoras = document.getElementById("Hora"),
            pAMPM = document.getElementById("AMPM"),
            pMinutos = document.getElementById("Minutos"),
            pSegundos = document.getElementById("Segundos"),
            pDia_Semana = document.getElementById("Dia_Semana"),
            pDia = document.getElementById("dia"),
            pMes = document.getElementById("mes"),
            pAño = document.getElementById("año");

            if (!pHoras || !pAMPM || !pMinutos || !pSegundos || !pDia_Semana || !pDia || !pMes || !pAño) {
                return
            }

            var semana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
            pDia_Semana.textContent = semana [diaSemana];
            pDia.textContent = dia
            var Mes_Actual = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Nomviembre', 'Diciembre']
            pMes.textContent = Mes_Actual[mes];
            pAño.textContent = Año

            if(Horas >= 12){
                Horas = Horas - 12;
                ampm = 'PM';
            }
            else{ampm = 'AM';}

            if(Horas == 0){
                Horas = 12;
            }
            if(Horas < 10){
                Horas = "0" + Horas
            }
            pHoras.textContent = Horas
            pAMPM.textContent = ampm
            if(Minutos < 10){
                Minutos = "0" + Minutos
            }
            pMinutos.textContent = Minutos
            if(Segundos < 10){
                Segundos = "0" + Segundos
            }
            pSegundos.textContent = Segundos
        };
    actualizar_Hora();
}


Reloj_Tiempo()

setInterval(Reloj_Tiempo, 1000)

// Control de volumen global para los tres niveles
function Configurar_Volumen_Juego() {
    //LOS TRES CONTROLES DE VOLUMEN MANEJAN LO MISMO, ASI DA IGUAL EN QUE NIVEL ESTES
    var controlesVolumen = document.querySelectorAll('#VolumenControl, .Volumenlvl2 input[type="range"], .Volumenlvl3 input[type="range"]')

    if (controlesVolumen.length === 0) {
        return
    }

    var volumenInicial = controlesVolumen[0].value || 0.5

    controlesVolumen.forEach(function(control) {
        control.addEventListener('input', function() {
            Aplicar_Volumen_Juego(control.value)
        })
        control.addEventListener('change', function() {
            Aplicar_Volumen_Juego(control.value)
        })
    })

    Aplicar_Volumen_Juego(volumenInicial)
}

Configurar_Volumen_Juego()

var BotonVolverInicio = document.getElementById("BotonVolverInicio")
if (BotonVolverInicio) {
    //BOTON FINAL PARA REGRESAR AL INICIO SIN TENER QUE ARMAR TODO EL ESTADO OTRA VEZ
    BotonVolverInicio.addEventListener("click", function() {
        window.location.reload()
    })
}

