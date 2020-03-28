//Referencia a otras clases del proyecto, viene ser algo asin como un import de java o usin de .Net
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
var chivato =false;//Esta variable controla que el bot rebele o el nombre del usuario que elimina mensajes.
var argumentos = null;//Propiedad Array que contiene los argumentos
var comando = null;//Propiedad String que contiene el comando ejecutado

 //#region ### PROPIEDADES ###
 function getArgumentos(){
     if(argumentos!=null)
        return argumentos;
 }

 function getComando(){
   if(comando!=null)  
        return comando;
}

function setArgumentos(args){
    argumentos=args;
}

function setComando(cmd){
     comando=cmd;
}

//#endregion


//const miembrostags = client.users.cache.map(u => `${u.username}`).join(", ");//optine la lista de usuarios del servidor

//#region ### EVENTOS ### 

//Activacion de el bot en discord.js
client.on('ready', () => {
    console.log(`Estoy listo!`);
 });

 //#### Respuesta al comando help "Ayuda de comandos para el usuario" ####
  client.on('message', (message) => {
    if(message.author.bot)//Si el mensaje lo mando otro bot, no repondera
        return;

     //Si el mensaje no comienza por un prefix o prefijo, no se tratara o gestionara el mensaje   
    if(message.content.startsWith(config.prefix)){
        console.log("\n-----------COMIENZO TRATAMIENTO DE ENTRADA-------------\n")
    //## Separamos el comando de los argumentos y los semaparamos para guardarlos en las propiedades Argumentos y Comando
      var msj = message.content.slice(config.prefix.length).trim().split(/ +/g);//Quita el prefijo o prefix de la cadena y elimina espacios
      console.log(" El msj antes de sacar el comando sin prefijo -> "+msj+"\n");
      var cmd = msj.shift().toLowerCase();//Se queda solo con la 1º posicion es decir con el comando 
      setComando(cmd);//Guardamos el comando
      console.log(" Comando --> "+ cmd+"\n");
      //Guardamos los argumentos en la propiedad GerArgumentos()
      GuardarArgumentos(msj);
    }

    if(message.content.startsWith(config.prefix+'help')) {
      message.channel.send("Comandos disponibles: [Usa siempre el prefijo "+config.prefix+"] delante de cada comando.");
      message.channel.send("[sorteo] \n###Ejemplo 1###\n "+config.prefix+"sorteo Pedro Marcos Maria. \n ###Ejemplo 2### (usando menciones)\n"+config.prefix+"sorteo @Pedro @Marcos @Maria.");       
    }
    //#### Respuesta al mensaje SORTEO #### 
    if(message.content.startsWith(config.prefix+'sorteo')) {                  
            message.channel.send("¡El ganador es: **"+Sorteo()+"**! :partying_face:");             
        }
    //#### Activar chivato ####  esto permite que el bot chive los mensajes eliminados
    if(message.content.startsWith(config.prefix+'chivato on')) {     
        if(!chivato){          
            message.delete(); //Borra el mensaje para que no se mantenga en el historial 
            chivato=true;
            message.channel.send("[El chivato esta activado] :eyes: os estoy vigilando a todos .... "); 
        }               
    }
    //#### Desactivar chivato ####  esto permite que el bot NO chive los mensajes eliminados
    if(message.content.startsWith(config.prefix+'chivato off')) {
        if(chivato){
            message.delete();//Borra el mensaje para que no se mantenga en el historial 
            chivato=false;
            message.channel.send("[El chivato esta desactivado] :smirk: :kissing_heart:   no dire ni mu de tus travesuras ... "); 
        }
               
    }

  //let rol = message.guild.roles.cache.find(r => r.name === "Administrador");
    //####Comando de prueba ####  esto permite Testear codigo sucio para entender las librias de discord y deburar codigo ##POR AQUIIIIII
    if(message.content.startsWith(config.prefix+'prueba')) {
       //let rol = message.guild.roles.cache.find(r => r.name === "Banquer@ corrupt@"); PENDIENTE PREGUNTAR POR LOS PRIVILEGIOS DEL USUARIO QUE MANDO EL MENSAJE
       //let rol = message.client.user.username;
       //var n = client.users.cache.randomKey();
        //client.user.setUsername("BotWilly"); //Cambia el nombre al bot NO USAR
      //console.log(n);
      Equipo();
        
        //console.log("El rol es: "+rol.resolveID("Banquer@ corrupt@"));  
        //message.channel.send("[ROL]: "+rol);      
    }
        
 //#### Respues a un mensaje de un cliente de discord con el contenido 'ping' y respuesta del bot 'pong' ####
    if(message.content.startsWith(config.prefix+'miembros')) {
      message.channel.send("Saldra la imagen de el que habla? "+ message.author.displayAvatarURL());
      message.channel.send("Cantidad de miembros "+ miembrostags.length);
      /*for(var i=0; i< message.channel.users.length-1;i++){
          //message.channel.send("Miembro "+i+1+" "+miembrostags.username);
          message.channel.send("Miembro "+i+1);
      }*/
      //message.channel.send(`pong 🏓!!`);
    }

 });

//#### Evento que muestra quien elimino un mensaje y que contenia ####
 client.on("messageDelete", (message) => {
    if(chivato)//Si chivato esta a true, entonces el bot chivara quien elimino mensajes
    {
        //let canal = client.channels.cache.get('ID-CANAL'); 
        //message.channel.send(`**${message.author.username}** elimino un mensaje con el contenido: ${message}`); //Corregir que el mismo que elimina sea el mismo que escribio el mensaje o poner el nombre de ambos
        console.log(message.content);
        if(message.content!="-chivato on" && message.content!="-chivato off")
            message.channel.send(`**${client.user.username}** elimino un mensaje con el contenido: ${message}`); //Corregir que el mismo que elimina sea el mismo que escribio el mensaje o poner el nombre de ambos
    }
    
});

//#endregion

/*Esta funcion escoge aleatoriamente a uno de los participantes pasados por una cadena, separados por,*/
function Sorteo(){
     var arrayParticipantesSorteo= new Array(); 
     arrayParticipantesSorteo = getArgumentos(); 
     var elegido = Math.floor(Math.random()*arrayParticipantesSorteo.length);//Numero aleatorio que escoge un ganador
     console.log("GANADOR: "+elegido);    
     return arrayParticipantesSorteo[elegido];  
}

/**Esta funcion divide el numero de participantes pasados por argumentos entre un numero indicado, apra realizar un numero de equipos en base a los participantes
 * Ej: -equipo 2 juan pedro ramon esther
 * El primer argumento despues del comando, ser siempre el numero de equipos se desea realizar, este ejemplo anterior 2*/ 
function Equipo(){   ///PO AQUIU********[TESTEO]
    var arrayArgumentosParaEquipos=new Array();
    arrayArgumentosParaEquipos=getArgumentos();

    var arrayParticipantesEquipos=new Array();   
    var numeroDeEquipos=0;//Equipos que se va realizar o entre los que hay que dividir o repartir los participantes
    //Guardamos el numero de equipos que se  desea hacer por un lado y los participantes por otro
    for(var i=0;i<arrayArgumentosParaEquipos.length;i++)
    {
        if(i==0)//En la posicion 0 de los argumentos/args siempre estara el numero de equipos que deseamos realizar o entre los que hay que dividir a los participantes
        {
            console.log("pos: ["+i+"] "+arrayArgumentosParaEquipos[i]);
            numeroDeEquipos=arrayArgumentosParaEquipos[i];
        }
        else if(i!=0){
            arrayParticipantesEquipos[i-1]=arrayArgumentosParaEquipos[i];
        }
    }

    if(parseInt(numeroDeEquipos)){
        var  num= parseInt(numeroDeEquipos);//Realizamos un casting de string a int
        num = Math.abs(num);//Lo pasamos al valor absoluto sin signo
        var numParticipantes =arrayParticipantesEquipos.length;
        var resultadoDivision =Math.round(numParticipantes/num);//se redondea el resultado
        console.log("Result: "+resultadoDivision);
        //Creamos un array con el numero de posiciones equivalentes a el numero de equipos que vamos a crear 'variable-> num'
        var arrayEquiposCreados=new Array(num);

        /*Mientras la longitud del array de participantes es mayor que el numero de equipos que vamos hacer
        sigue sacando participantes para repartir entre equipos [TESTEO]*/
        while(arrayParticipantesEquipos.length> num){
            var equipoEscogido= Math.floor(Math.random()*num);
            for(var i=0;i<num;i++){
                console.log("Bucle 1 : ");
            var posEscogida=Math.floor(Math.random()*arrayParticipantesEquipos.length);//Numero aleatorio que escoge un elegido
            //Splice
            var elementoEscogido= arrayParticipantesEquipos.splice(posEscogida,1);
            arrayEquiposCreados[equipoEscogido]+=elementoEscogido.toString()+",";//Guardamos los participantes
            }

        }

        //Por si quedan restos de el reparto de participantes entre los equipos
        var  longitudElemento = 0;
        while(arrayParticipantesEquipos.length>0 && arrayParticipantesEquipos.length<num){
            for(var i=0;i<arrayEquiposCreados.length;i++){
                console.log("Bucle 2 : ");
               
                console.log("Variable longitudElemento: "+longitudElemento);
                
                if(longitudElemento!=0 && longitudElemento>arrayEquiposCreados[i].length)//si este elemnto es menor que se le añade un participante.//ERROR AQUI
                {
                    console.log("ENTRO");
                    //Añade un participante
                    var posEscogida=Math.floor(Math.random()*arrayParticipantesEquipos.length);//Numero aleatorio que escoge un elegido
                     //Splice
                    var elementoEscogido= arrayParticipantesEquipos.splice(posEscogida,1);
                    arrayEquiposCreados[i]+=elementoEscogido.toString()+",";//Guardamos los participantes
                }
                longitudElemento = arrayEquiposCreados[i].length;

            }
        }

        console.log("Que  hay: "+arrayEquiposCreados);


   
        

    }
    else{//Error al transformar el tipo de cade a int
        console.log("No se transformo");   
    }

   

    console.log("El tipo de dato de numeroDeEquipos -> "+ typeof(numeroDeEquipos));

    console.log("Numero de equipos ha hacer-> "+numeroDeEquipos+"\nParticipantes-> "+arrayParticipantesEquipos);

}

/*Esta funcion es especifica para optener los argumentos pasados por el usuario y guardarlos en la propiedad correpondiente de los argumentos
intentando evitar espacios o posiciones vacias*/
function GuardarArgumentos(msj){
    console.log(" Resto del msj que se guardaran como argumentos --> "+msj+"\n");
    var mensaje = new String(msj);//Necesitamos reconvertirloa  string para que nos permite usar el metodo split de la clase String 
    var arraymsj = new Array();
    arraymsj = mensaje.split(',');
    var args = new Array();//Array donde guardaremos los argumentos

     /*Esta variable indica la cantidad que se va restar al indice de 'i' de el 'arraymsj'  para guardarlo los datos en el segundo array 'args',ya que por defecto
        como  vamos a guardar la primera posicion del 'arraymsj'  en el array 'args' tendremos que ir restando 0 al indice (el decir en pricipio como si nada)
         para cuadrar posiciones de los array,
         pero si se encuentra un ESPACIO o una Posicon del array VACIA.. esta varaible
        se incrementara a medida que encuentre espacios.. restando  1 o mas(segun el numero de espacios que se encuentren o pos vacias) al indice*/
         var restador = 0;

         //Buscamos posiciones vacias en el array como ""
    for(var i=0;i<arraymsj.length;i++){         
        if(arraymsj[i]==""){ //si arraymsj es del mismo tipo que "" y el contenido es IGUAL de una cadena vacia (Es decir NO hay un dato en esa pos del array)  
            restador++;
        }
        if(arraymsj[i]!=""){ //si arraymsj es del mismo tipo que "", pero el contenido es diferente de una cadena vacia (Es decir hay un dato en esa pos del array)    
            args[i-restador]=arraymsj[i];//Guardamos los parametros en un nuevo array que almacenaremos en la propiedad Argumentos
        }                        
    }
    
    console.log(" Argumentos --> "+args+"\n\n Longitud de array de argumentos [args] --> "+args.length+"\n\n-----------FIN TRATAMIENTO DE ENTRADA-------------\n");
    setArgumentos(args);//Guardamos el array de argumentos
    //console.log("El getargumentos "+ getArgumentos());

}
 
 //Logeo el bot en discord, es decir inicia sesion
 client.login(config.token);
