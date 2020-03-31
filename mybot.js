//Referencia a otras clases del proyecto, viene ser algo asin como un import de java o usin de .Net
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
var chivato =false;//Esta variable controla que el bot rebele o el nombre del usuario que elimina mensajes.
var argumentos = null;//Propiedad Array que contiene los argumentos
var comando = null;//Propiedad String que contiene el comando ejecutado
//Mensaje de error estandar para cuando algun comando no recibe los parametros indicados
var msjError ="Lo siento pero no entiendo tu comando.. puede que sea erroneo, usa "+config.prefix +"help para más info!.";
var msjNoPerimsos="Lo siento, no tienes permisos para ejecutar ese comando ... :thumbsdown: :thumbsdown: :thumbsdown: :thumbsdown:";
var ArrayRolAdmin= new Array();
var userAdmin= false;
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


  client.on('message', (message) => {

    //#region region ### Tratamiento de comando parametros y roles del usuario que activo el evento ###     
    if(message.author.bot)//Si el mensaje lo mando otro bot, no repondera
        return;

  
    //Si el mensaje NO comienza por un prefix o prefijo, no se tratara o gestionara el mensaje   
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

     //Determinamos si el usuario que escribio un mensaje tiene un rol de administrador o no, estos roles estan indicados enel fichero config.json y son cogidos manualmente de cada servidor
     RecogerRolesAdmins();

      //Comprobar si el usuario que ejecuto un comando es Admin o no
        for(var i=0;i<ArrayRolAdmin.length;i++){
            console.log("Rol "+(i+1)+" "+config.rolesAdmin[i]);
            if(message.guild.roles.cache.find(r => r.name === config.rolesAdmin[i])){
                console.log("Si lo tiene!!!");
                userAdmin=true;
                break;
            }else{
                userAdmin=false;
            }
        }
        console.log("El usuario tiene un rol de admin --> "+userAdmin);
    }
    //#endregion

    //#### Respuesta al comando help "Ayuda de comandos para el usuario" ####
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
        if(userAdmin){
            if(!chivato){          
                message.delete(); //Borra el mensaje para que no se mantenga en el historial 
                chivato=true;
                message.channel.send("[El chivato esta activado] :eyes: os estoy vigilando a todos .... "); 
            }
        }else{
            message.channel.send(msjNoPerimsos); 
        }              
    }
    //#### Desactivar chivato ####  esto permite que el bot NO chive los mensajes eliminados
    if(message.content.startsWith(config.prefix+'chivato off')) {
        if(userAdmin){
            if(chivato){
                message.delete();//Borra el mensaje para que no se mantenga en el historial 
                chivato=false;
                message.channel.send("[El chivato esta desactivado] :smirk: :kissing_heart:   no dire ni mu de tus travesuras ... "); 
            }
        }else{
            message.channel.send(msjNoPerimsos); 
        }
               
    }
    //####Comando de equipo ####  Este comando permite hacer equipo en base a un numero de equipos a realizar y unos participantes o nombres pasados por parametros
    if(message.content.startsWith(config.prefix+'equipo')) {  
        var equipos= Equipo();   
        if(equipos != null)//Si es distinto de null es que tood fue bien
        {
            message.channel.send("Los equipos son los siguientes: \n");
        
            for(var i=0;i<equipos.length;i++){
                message.channel.send("Equipo "+(i+1)+": "+equipos[i]);
            }
        }
        else{
            message.channel.send(msjError);
        }
    }

    //####Comando de prueba ####  esto permite Testear codigo sucio para entender las librias de discord y deburar codigo ##POR AQUIIIIII
    if(message.content.startsWith(config.prefix+'prueba')) {
     
        
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
     if(getArgumentos() != null){ 
         console.log(getArgumentos());
        arrayParticipantesSorteo = getArgumentos(); 
        var elegido = Math.floor(Math.random()*arrayParticipantesSorteo.length);//Numero aleatorio que escoge un ganador
        console.log("GANADOR: "+elegido);    
        return arrayParticipantesSorteo[elegido];  
     }else{
         return msjError;
     }
    
}

/**Esta funcion divide el numero de participantes pasados por argumentos entre un numero indicado, para realizar un numero de equipos en base a los participantes
 * Ej: -equipo 2 juan pedro ramon esther
 * El primer argumento despues del comando, ser siempre el numero de equipos se desea realizar, este ejemplo anterior 2*/ 
function Equipo(){
    if(getArgumentos()!=null)
    {  
        var arrayArgumentosParaEquipos=new Array();
        arrayArgumentosParaEquipos=getArgumentos();

        var arrayParticipantesEquipos=new Array();   
        var numeroDeEquipos=0;//Equipos que se va realizar o entre los que hay que dividir o repartir los participantes
        //Guardamos el numero de equipos que se  desea hacer por un lado y los participantes por otro
        for(var i=0;i<arrayArgumentosParaEquipos.length;i++)
        {
            if(i==0)//En la posicion 0 de los argumentos/args siempre estara el numero de equipos que deseamos realizar o entre los que hay que dividir a los participantes
            {
                //console.log("Numero de equipos a hacer se encuentra en pos: ["+i+"] y es -> "+arrayArgumentosParaEquipos[i]);
                numeroDeEquipos=arrayArgumentosParaEquipos[i];
            }
            else if(i!=0){
                arrayParticipantesEquipos[i-1]=arrayArgumentosParaEquipos[i];
            }
        }

        //Si podemos convertir a entero el primer parametro recodigo (Que se supone ser el numero de equipos a hacer) y si hay datos en el arrayParticipantesEquipos
        if(parseInt(numeroDeEquipos) && arrayParticipantesEquipos!=""){
            console.log("Numero de participantes: "+arrayParticipantesEquipos.length);
            var  num= parseInt(numeroDeEquipos);//Realizamos un casting de string a int
            num = Math.abs(num);//Lo pasamos al valor absoluto sin signo
            var numParticipantes =arrayParticipantesEquipos.length;
            var resultadoDivision =Math.round(numParticipantes/num);//se redondea el resultado
            console.log("Dividiremos los participantes en : "+resultadoDivision);

            var arrayEquipos = new Array(num);//Equipos entre los que dividimos los participantes
            //------------------
            //Sacamos el numero de participantes que deben ir para cada grupo, es decir si 'num' es 2, vamos sacando participantes para un grupo de dos en dos de forma aleatoria
            while(arrayParticipantesEquipos.length!=0)
            {
                //console.log("------------------------------\nTamaño del array-> "+arrayParticipantesEquipos.length);
                for(var i = 0; i<num;i++){               
                    /*Si la lista de participantes son un numero  mayor que en el que se van a dividir 
                    los equipos es decir si los grupo 'num' son de 2, dos para cada equipo, de forma que si queda solo un elemento en el array, cogera dos elementos de este*/             
                    if(arrayParticipantesEquipos.length>=num)
                    {                  
                        var posElegida = Math.floor(Math.random()*arrayParticipantesEquipos.length);
                        var participanteEscogido = arrayParticipantesEquipos.splice(posElegida,1);//Escogemos una posicion del array "arrayParticipantesEquipos" sacamos su dato y eliminamos ese elemnto del array
                        if(arrayEquipos[i]!=null)//Si ya hay algo en es aposicion del array
                            arrayEquipos[i]+= participanteEscogido+" ";
                        else//Si aun no hay nada en esa posicion del array
                            arrayEquipos[i]= participanteEscogido+" ";
                    }
                    else if(arrayParticipantesEquipos.length<num && arrayParticipantesEquipos.length>0)
                    {    
                        //Cogemos el unico que queda y lo metemos en el ultimo grupo  al que se asigno un participantes que sera el que menos tenia hasta el momento
                        var participanteEscogido=arrayParticipantesEquipos.splice(0,1);
                        if(arrayEquipos[i]!=null)//Si ya hay algo en es aposicion del array
                            arrayEquipos[i]+=participanteEscogido+" ";
                        else//Si aun no hay nada en esa posicion del array
                            arrayEquipos[i]= participanteEscogido+" ";
                    }              
                }
            }

            console.log("### EQUIPOS ####");
            for(var i =0;i<arrayEquipos.length;i++){
                console.log(" ### Mi equipo "+(i+1) +"->"+arrayEquipos[i]);
            }
            return arrayEquipos;
        }
        return null;//Si el valor no se puede convertir, es decir si no se paso un numero de equipos a hacer y en su lugar se paso un caracter como -equipos D paco ramon juan
    }else{
        return null;//Si no se paso ningun argumento tras el comando, como por ejemplo -equipos
    }

}

function RecogerRolesAdmins(){
    for(var i=0;i<config.rolesAdmin.length;i++){
        ArrayRolAdmin[i]=config.rolesAdmin[i];
        console.log("Rol recogido en pos-> "+i+" "+ArrayRolAdmin[i]);
    }
}

/*Esta funcion es especifica para optener los argumentos pasados por el usuario y guardarlos en la propiedad correpondiente de los argumentos
intentando evitar espacios o posiciones vacias*/
function GuardarArgumentos(msj){
    console.log(" Resto del msj que se guardaran como argumentos --> "+msj+"\n");
    if(msj !=""){
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
}
 
 //Logeo el bot en discord, es decir inicia sesion
 client.login(config.token);
