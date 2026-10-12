Tiempolvl2 = 61 //VARIBLE DE INICIO TIEMPO
Puntajelvl2 = 0 //VARIABLE DE INICIO PUNTOS
//META REAL DEL NIVEL 2, SI CAMBIA EL NUMERO DE PUNTOS SE TOCA ACA
var Puntaje_Meta_Nivel2 = 34





//CONTENEDOR QUE CONTEIENE TOO EL JUEGO
//DE POR SI ESTA FUNCION NO SE EJECUTA HASTA QUE SE LA LLAMA, MAS ADELANTE LA LLAMAREMOS
//PARA QUE EL JUEGO INICIE UNA VEZ SE PRESIONE JUGAR
function JUEGOlvl2(){
    ConfigurarVidaPlaneta(2, 3)

    //RELOJ DEL NIVEL 2, SI LLEGA A CERO TE REINICIA EL INTENTO
    function Tiempo_Disminurlvl2(){ //FUNCION QUE REDUCE EL TIEMPO Y RESETEAL EL RESULTADO UNA VEZ LLEGUE A 0
        Tiempolvl2--;
        document.getElementById("Tiempolvl2").innerHTML = Tiempolvl2
        if(Tiempolvl2 == 0){
            Tiempolvl2 = 61
            Puntajelvl2 = 0
            VidaPlanetaPorNivel[2].vida = 0
            ActualizarVidaPlaneta(2)
            alert("El tiempo se agoto, lo lamento, de seguro lo lograras para la siguiente")
            ReiniciarVidaPlaneta(2)
            document.getElementById("Puntajelvl2").innerHTML = 0+"&nbsp;/&nbsp;"+Puntaje_Meta_Nivel2} }

    
        Restar_Tiempolvl2 = setInterval(Tiempo_Disminurlvl2, 1000)

        //AÑADIMOS LA FUNCION AUMENTAR PUNTOS AL PASAR EL CURSOR SOBRE LOS METIORITOS
        document.getElementById("Meteioritolvl2").addEventListener('mouseover', Aumentar_Puntoslvl2)
        document.getElementById("Meteiorito2lvl2").addEventListener('mouseover', Aumentar_Puntoslvl2)
        document.getElementById("Meteiorito3lvl2").addEventListener('mouseover', Aumentar_Puntoslvl2)


        //FUNCION QUE UNICAMENTE AUMENTA PUNTOS Y RESETEA LAS VARIABLES AL LLEGAR A CIERTO LIMITE
        function Aumentar_Puntoslvl2(){
            Puntajelvl2++;
            document.getElementById("Puntajelvl2").innerHTML = Puntajelvl2 + " / " + Puntaje_Meta_Nivel2
            if(Puntajelvl2 >= Puntaje_Meta_Nivel2){
                Puntajelvl2 = 0 
                Tiempolvl2 = 61
                ReiniciarVidaPlaneta(2)

                document.getElementById("Tiempolvl2").innerHTML = 60
                document.getElementById("Puntajelvl2").innerHTML = 0+"&nbsp;/&nbsp;"+Puntaje_Meta_Nivel2
                PausarMusicaFondo()
                document.getElementById("Triunfo").play()
                document.getElementById("NEXT").addEventListener('click', Habilitar_Siguienten_LVL)
                //DESPUES DE GANAR, EL BOTON SIGUIENTE ESCONDE EL NIVEL 2 Y MUESTRA EL 3
                function Habilitar_Siguienten_LVL(){
                document.getElementById("NIVEL_01").style.display = "none"
                document.getElementById("NIVEL_02").style.display = "none"
                document.getElementById("NIVEL3").style.display = "block"
                document.getElementById("Contenedor_LVL").classList.remove("nivel-disponible")}
                            
                //DETIENE TODO LO QUE SE ESTABA MOVIENDO PARA QUE LA PANTALLA DE GANASTE QUEDE LIMPIA
                function Ganaste_Pantallalvl2(){

                    clearInterval(Reanudar_trayectorialvl2)
                    clearTimeout(Activador_iniciallvl2)
                    clearInterval(Reanudar_trayectoria2lvl2)
                    clearTimeout(Activador_inicial2lvl2)
                    clearInterval(Reanudar_trayectoria3lvl2)
                    clearTimeout(Activador_inicial3lvl2) 
                    clearInterval(Restar_Tiempolvl2) 

                    document.getElementById("Meteioritolvl2").style.left = "-70%"
                    document.getElementById("Meteioritolvl2").style.transition = "0s"

                    document.getElementById("Meteiorito2lvl2").style.left = "-70%"
                    document.getElementById("Meteiorito2lvl2").style.transition = "0s"
                    
                    document.getElementById("Meteiorito3lvl2").style.left = "-70%"
                    document.getElementById("Meteiorito3lvl2").style.transition = "0s"}

                     setInterval(Ganaste_Pantallalvl2, 50)


                document.getElementById("GanastePantallaLvL2").style.display = "flex"
                document.getElementById("Contenedor_LVL").classList.add("nivel-disponible")
                Swal.fire({
                    title : 'FELICIDADES POR SUPERAR <br> EL NIVEL <br><br> <img src="IMG/Check.png" width = "120px"><br>',
                    html: '¿VERDAD QUE FUE DIFÍCIL?. Prepárate para el siguiente nivel que las cosas van a empeorar. Agradecemos tu dedicación en pasar este nivel, esperemos que puedas seguir defendiendo la tierra de esa manera y mejores tu habilidad de reacción ',
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
        function Metiorito_Direccionlvl2(){
            Distancia1lvl2 = 80
            Altura1lvl2 = Math.round(Math.random()* 450)

            document.getElementById("Meteioritolvl2").style.left = Distancia1lvl2 + "%"
            document.getElementById("Meteioritolvl2").style.top = Altura1lvl2 + "px"}

            Activador_iniciallvl2 = setTimeout(Metiorito_Direccionlvl2, 3500)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
            Reanudar_trayectorialvl2 = setInterval(Metiorito_Direccionlvl2, 2030)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,4 SEGUNDOS


        //ESTA FUNCION DIRIGE AL PRIMER METIORITO 2 A LA TIERRA         
        function Metiorito_Direccion2lvl2(){
            Distancia2lvl2 = 80
            Altura2lvl2 = Math.round(Math.random()* 450)

            document.getElementById("Meteiorito2lvl2").style.left = Distancia2lvl2 + "%"
            document.getElementById("Meteiorito2lvl2").style.top = Altura2lvl2 + "px"}

            Activador_inicial2lvl2 = setTimeout(Metiorito_Direccion2lvl2, 3000)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
            Reanudar_trayectoria2lvl2 = setInterval(Metiorito_Direccion2lvl2, 2750)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,3 SEGUNDOS

            //ESTA FUNCION DIRIGE AL PRIMER METIORITO 3 A LA TIERRA
            function Metiorito_Direccion3lvl2(){
                Distancia3lvl2 = 80
                Altura3lvl2 = Math.round(Math.random()* 450)
    
                document.getElementById("Meteiorito3lvl2").style.left = Distancia3lvl2 + "%"
                document.getElementById("Meteiorito3lvl2").style.top = Altura3lvl2 + "px"}
    
            Activador_inicial3lvl2  = setTimeout(Metiorito_Direccion3lvl2, 2200)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
            Reanudar_trayectoria3lvl2 = setInterval(Metiorito_Direccion3lvl2, 2470)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,3 SEGUNDOS
       


        //AQUI ADJUNTAMOS LA ACCION DE LA FUNCION EXPULZAR AL PASAR SOBRE EL METIORITO
        document.getElementById("Meteioritolvl2").addEventListener('mouseover', Explulsarlvl2)
        document.getElementById("Meteiorito2lvl2").addEventListener('mouseover', Explulsar2lvl2)
        document.getElementById("Meteiorito3lvl2").addEventListener('mouseover', Explulsar3lvl2)

        //ESTA ES LA FUNCION QUE EXPULSA AL METEORITO 1 DE MANERA ALEATORIA FUERA DEL MAPA
        function Explulsarlvl2 (){
            document.getElementById("Puntos_sound").play()
            Distancialvl2 = "-500"
            Alturalvl2 = Math.round(Math.random()* 450)
            document.getElementById("Meteioritolvl2").style.left = Distancialvl2 + "px"
            document.getElementById("Meteioritolvl2").style.top = Alturalvl2 + "px"
            document.getElementById("Meteioritolvl2").style.transition = "1.8s"}


        //ESTA ES LA FUNCION QUE EXPULSA AL METEORITO 2 DE MANERA ALEATORIA FUERA DEL MAPA
        function Explulsar2lvl2 (){
            document.getElementById("Punto2").play()
            Distancialvl2 = "-500"
            Alturalvl2 = Math.round(Math.random()* 450)
            document.getElementById("Meteiorito2lvl2").style.left = Distancialvl2 + "px"
            document.getElementById("Meteiorito2lvl2").style.top = Alturalvl2 + "px"
            document.getElementById("Meteiorito2lvl2").style.transition = "1.8s"}

         //ESTA ES LA FUNCION QUE EXPULSA AL METEORITO 3 DE MANERA ALEATORIA FUERA DEL MAPA
        function Explulsar3lvl2 (){
            document.getElementById("Punto3").play()
            Distancialvl2 = "-500"
            Alturalvl2 = Math.round(Math.random()* 450)
            document.getElementById("Meteiorito3lvl2").style.left = Distancialvl2 + "px"
            document.getElementById("Meteiorito3lvl2").style.top = Alturalvl2 + "px"
            document.getElementById("Meteiorito3lvl2").style.transition = "1.8s"}




        
        //ESTA FUNCION SE ENCARGA DE ALERTARTE UNA VEZ EL METIORITO CRUZE LA LINEA CON UN PERDISTE
        //TAMBIEN RESETEA LOS VALORES Y LLEVA A LOS METIORITOS FUERA DEL MAPA DE MANERA INSTANTANEA
        function perdistelvl2 (){
            var limite = document.querySelector(".Limitelvl2")
            var limiteX = limite ? limite.getBoundingClientRect().left : window.innerWidth * 0.7

            //REVISA CADA METEORITO CONTRA LA LINEA DE PERDIDA DEL NIVEL
            function Meteorito_Cruzo_Limite(id){
                var meteorito = document.getElementById(id)
                var posicion = meteorito.getBoundingClientRect()

                return posicion.left > 0 && posicion.right >= limiteX
            }

            if(Meteorito_Cruzo_Limite("Meteioritolvl2") ||
            Meteorito_Cruzo_Limite("Meteiorito2lvl2") ||
            Meteorito_Cruzo_Limite("Meteiorito3lvl2"))
            
            {
                document.getElementById("Perdiste_sound").play()
            
                document.getElementById("Meteioritolvl2").style.left = "-70%"
                document.getElementById("Meteioritolvl2").style.transition = "0s"

                document.getElementById("Meteiorito2lvl2").style.left = "-70%"
                document.getElementById("Meteiorito2lvl2").style.transition = "0s"

                document.getElementById("Meteiorito3lvl2").style.left = "-70%"
                document.getElementById("Meteiorito3lvl2").style.transition = "0s"

                if (DanarVidaPlaneta(2)) {
                    alert("YA ES DEMASIADO TARDE, LOS METEORITOS DESTRUYERON GRAN PARTE DEL CONTINENTE Y LO MEJOR ES ESPERAR LO PEOR")
                    ReiniciarVidaPlaneta(2)
                    Tiempolvl2 = 61
                    Puntajelvl2 = 0
                    document.getElementById("Tiempolvl2").innerHTML = 60
                    document.getElementById("Puntajelvl2").innerHTML = 0+"&nbsp;/&nbsp;"+Puntaje_Meta_Nivel2
                } }
        
            else {
                document.getElementById("Meteioritolvl2").style.transition = "2s"
                document.getElementById("Meteiorito2lvl2").style.transition = "2s"
                document.getElementById("Meteiorito3lvl2").style.transition = "2s"           
            } }

        setInterval(perdistelvl2, 80)//SE REVISA VARIAS VECES POR SEGUNDO SIN CONGELAR EL NAVEGADOR
        //QUE NO SABEMOS CUANDO EL METIORITO VA A SUPERAR EL LIMITE
        }

        
        //LE DECIMOS QUE AL PRECIONAR EL BOTON JUGAR EJECUTARA LA FUNCION PLAY     
        //EVITA QUE EL NIVEL 2 SE DUPLIQUE SI EL BOTON JUGAR RECIBE MAS DE UN CLICK
        var Juego_Nivel2_Iniciado = false
        document.getElementById("Playlvl2").addEventListener('click', PLAYlvl2)

        Conteolvl2 = 4 //ESTE ES EL CONTEO DE LA CUENTA REGRESIVA QUE SE DA DESPUEZ DE PRESINAR JUGAR
            
            //ESTA FUNCION EJECUTA UN CONJUNTO DE ACCIONES AL PRESIONAR JUGAR
            function PLAYlvl2(){
                if (Juego_Nivel2_Iniciado) { return }
                Juego_Nivel2_Iniciado = true
                ReproducirMusicaFondo()
                document.getElementById("Startlvl2").classList.add("cuenta-activa")
                //SACA LOS TEXTOS DE INICIO Y DEJA SOLO LA CUENTA REGRESIVA ANTES DE JUGAR
                //MUEVE EL TITULO FUERA DEL CONTENEDOR UNA VEZ DE CLICK A JUGAR
                document.getElementById("Texolvl2").style.left = "-900px" 
                //MUEVE AL BOTON PLAY TRANS PRESIONAR PRESIONAR AL MISMO BOTON
                document.getElementById("Playlvl2").style.left = "-900px" 
                document.getElementById("Dificultad").style.left = "-900px"
                    //ESTA FUNCION CONTIENE AL JUEGO COMO TAL
                    function ARRACARlvl2(){    
                        JUEGOlvl2()}
                //INVOCA AL JUEGO UNA VEZ PASEN 4 SEGUNDO - OSEA UNA VEZ TERMINE EL CONTADOR
                tiempo_de_arranquelvl2 =  setTimeout(ARRACARlvl2, 4100)
                //ESTA FUNCION EJECUTA LA CUENTA REGRESIVA Y RETIRA LA PANTALLA START 
                function ESPERARlvl2(){
                    function Cuenta_rglvl2(){
                        Conteolvl2--;
                        document.getElementById("RGBlvl2").innerHTML = Conteolvl2
                        if(Conteolvl2 == -1){
                        document.getElementById("Contenedor_contadorlvl2").style.display = "none"
                        function Borrarlvl2(){
                        document.getElementById("Startlvl2").style.display = "none"

                            DETENER_JUEGOlvl2() }//HABILITA LA FUNCION DE PAUSE Y REANUDAR UNA VEZ CARGUE EL JUEGO
                        setTimeout(Borrarlvl2, 500) }  }
                        setInterval (Cuenta_rglvl2, 1000)}

                        setTimeout(ESPERARlvl2, 350)}//SE EJECUTARA EN UN LAPSO DE 350, DESPUES DE PRESIONAR EL BOTON


            //ESTA FUNCION CONTIENE EL REANUDE Y PAUSE DEL BOTON
            function DETENER_JUEGOlvl2 (){
                //INDICA QUE LA FUNCION DE PAUSE SE EJECUTARA UNA VEZ SE DE CLICK AL BOTON DE PAUSE        
                document.getElementById("Pauselvl2").addEventListener('click', PAUSElvl2)
                document.getElementById("Pausa_Pantallalvl2").addEventListener('click', PAUSElvl2)
                document.getElementById("Reanudarlvl2").addEventListener('click', function(evento){
                    evento.stopPropagation()
                    PAUSElvl2()
                })
                //ESTA VARIABLE INDICA SI SE EJECUTA O NO EL DESPAUSEO
                Activolvl2 = 1 
                    //HACE QUE EL JUEGO SE DETENGA
                    function PAUSElvl2(){
                        //SI LLEGA A UNA EJECUTA LA FUNCION PAUSE
                        if (Activolvl2 == 1){
                        document.getElementById("Pausa_Pantallalvl2").style.display = "table"
                        PausarMusicaFondo()
                        clearInterval(Restar_Tiempolvl2)//BORRAMOS LA FUNCION DE TIEMPO
                        document.getElementById("Tiempolvl2").innerHTML = Tiempolvl2
                            clearInterval(Reanudar_trayectorialvl2)
                            clearInterval(Reanudar_trayectoria2lvl2)
                            clearInterval(Reanudar_trayectoria3lvl2)

                            //MANTIENE LOS 3 METEORITOS CLAVADOS EN SU SITIO MIENTRAS ESTA PAUSADO
                            function Metiorito_detenerlvl2 (){   
                            document.getElementById("Meteioritolvl2").style.left = document.getElementById("Meteioritolvl2").offsetLeft + "px" 
                            document.getElementById("Meteiorito2lvl2").style.left = document.getElementById("Meteiorito2lvl2").offsetLeft + "px" 
                            document.getElementById("Meteiorito3lvl2").style.left = document.getElementById("Meteiorito3lvl2").offsetLeft + "px" 

                            document.getElementById("Meteioritolvl2").style.top = document.getElementById("Meteioritolvl2").offsetTop + "px" 
                            document.getElementById("Meteiorito2lvl2").style.top = document.getElementById("Meteiorito2lvl2").offsetTop + "px" 
                            document.getElementById("Meteiorito3lvl2").style.top = document.getElementById("Meteiorito3lvl2").offsetTop + "px" }

                            Pusae_offflvl2 = setInterval(Metiorito_detenerlvl2, 50) //LE ASEGNAMOS UNA ID, PARA BORRALO UNA VEZ SE DESPAUSEE
                            Activolvl2 = 2} //CAMBIAMOS EL VALOR PARA QUE AL VOLVER A DARLE CLICK EJECUTE LA CONDICIONAL DE REANUDAR

                        else { //LA FUNCION DE REANUDAR
                            clearInterval(Pusae_offflvl2) 
                            document.getElementById("Pausa_Pantallalvl2").style.display = "none"
                            ReproducirMusicaFondo()
                            //AL REANUDAR, SE VUELVEN A ACTIVAR EL RELOJ Y LAS RUTAS DEL NIVEL 2
                            function Tiempo_Disminurlvl2(){//VOLVEMOS A CREAR LA FUNCION DE TIEMPO PARA QUE REANUEDE EL CONTEO
                                Tiempolvl2--;
                                document.getElementById("Tiempolvl2").innerHTML = Tiempolvl2
                                if(Tiempolvl2 == 0){
                                    Tiempolvl2 = 61
                                    Puntajelvl2 = 0
                                    VidaPlanetaPorNivel[2].vida = 0
                                    ActualizarVidaPlaneta(2)
                                alert("Lo lamento perdiste")
                                ReiniciarVidaPlaneta(2) } }

                                Restar_Tiempolvl2 = setInterval(Tiempo_Disminurlvl2, 1000)
        
                        document.getElementById("Meteioritolvl2").style.left = Distancia1lvl2 + "%"
                        document.getElementById("Meteioritolvl2").style.top = Altura1lvl2 + "px"
                        document.getElementById("Meteioritolvl2").style.transition = "2s"

                        document.getElementById("Meteiorito2lvl2").style.left = Distancia2lvl2 + "%"
                        document.getElementById("Meteiorito2lvl2").style.top = Altura2lvl2 + "px"
                        document.getElementById("Meteiorito2lvl2").style.transition = "2s"

                        document.getElementById("Meteiorito3lvl2").style.left = Distancia3lvl2 + "%"
                        document.getElementById("Meteiorito3lvl2").style.top = Altura3lvl2 + "px"
                        document.getElementById("Meteiorito3lvl2").style.transition = "2s"

                        function Metiorito_Direccionlvl2(){
                            Distancia1lvl2 = 80
                            Altura1lvl2 = Math.round(Math.random()* 450)
                
                            document.getElementById("Meteioritolvl2").style.left = Distancia1lvl2 + "%"
                            document.getElementById("Meteioritolvl2").style.top = Altura1lvl2 + "px"}
                
                            setTimeout(Metiorito_Direccionlvl2, 1700)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
                            Reanudar_trayectorialvl2 = setInterval(Metiorito_Direccionlvl2, 2430)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,4 SEGUNDOS
                
                
                            function Metiorito_Direccion2lvl2(){
                                Distancia2lvl2 = 80
                                Altura2lvl2 = Math.round(Math.random()* 400)
                
                                document.getElementById("Meteiorito2lvl2").style.left = Distancia2lvl2 + "%"
                                document.getElementById("Meteiorito2lvl2").style.top = Altura2lvl2 + "px"}
                
                                setTimeout(Metiorito_Direccion2lvl2, 1)
                                Reanudar_trayectoria2lvl2 = setInterval(Metiorito_Direccion2lvl2, 2050)
                
                            
                            function Metiorito_Direccion3lvl2(){
                                Distancia3lvl2 = 80
                                Altura3lvl2 = Math.round(Math.random()* 350)
                    
                                document.getElementById("Meteiorito3lvl2").style.left = Distancia3lvl2 + "%"
                                document.getElementById("Meteiorito3lvl2").style.top = Altura3lvl2 + "px"}
                    
                                setTimeout(Metiorito_Direccion3lvl2, 1700)//PRIMERO VA A SER EJECUTADO A LOS DOS PRIMEROS SEGUNDOS
                                Reanudar_trayectoria3lvl2 = setInterval(Metiorito_Direccion3lvl2, 2570)//LUEGO SE VA A LLAMAR A LOS METIORITOS CADA 2,3 SEGUNDOS

                        Activolvl2 = 1 } } } //CAMBIAMOS EL VALOR DE NUEVO A 1 PARA QUE AL SIGUIENTE CLICK SE EJECUTE EL PAUSE  S 

                
