var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
  var secPubNub=0;
  var Filler1ct = null,
      Filler1results = null,
      CntInFiller1 = null,
      CntOutFiller1 = null,
      Filler1actual = 0,
      Filler1time = 0,
      Filler1sec = 0,
      Filler1flagStopped = false,
      Filler1state = 0,
      Filler1speed = 0,
      Filler1speedTemp = 0,
      Filler1flagPrint = 0,
      Filler1secStop = 0,
      Filler1ONS = false,
      Filler1timeStop = 60, //NOTE: Timestop en segundos
      Filler1Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      Filler1flagRunning = false;
  var Filler2ct = null,
      Filler2results = null,
      CntInFiller2 = null,
      CntOutFiller2 = null,
      Filler2actual = 0,
      Filler2time = 0,
      Filler2sec = 0,
      Filler2flagStopped = false,
      Filler2state = 0,
      Filler2speed = 0,
      Filler2speedTemp = 0,
      Filler2flagPrint = 0,
      Filler2secStop = 0,
      Filler2ONS = false,
      Filler2timeStop = 60, //NOTE: Timestop en segundos
      Filler2Worktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      Filler2flagRunning = false;
  var StickInserterct = null,
      StickInserterresults = null,
      CntInStickInserter = null,
      CntOutStickInserter = null,
      StickInserteractual = 0,
      StickInsertertime = 0,
      StickInsertersec = 0,
      StickInserterflagStopped = false,
      StickInserterstate = 0,
      StickInserterspeed = 0,
      StickInserterspeedTemp = 0,
      StickInserterflagPrint = 0,
      StickInsertersecStop = 0,
      StickInserterONS = false,
      StickInsertertimeStop = 60, //NOTE: Timestop en segundos
      StickInserterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      StickInserterflagRunning = false;
  var PickAndPlacect = null,
      PickAndPlaceresults = null,
      CntInPickAndPlace = null,
      CntInPickAndPlace1 = null,
      CntOutPickAndPlace = null,
      PickAndPlaceactual = 0,
      PickAndPlacetime = 0,
      PickAndPlacesec = 0,
      PickAndPlaceflagStopped = false,
      PickAndPlacestate = 0,
      PickAndPlacespeed = 0,
      PickAndPlacespeedTemp = 0,
      PickAndPlaceflagPrint = 0,
      PickAndPlacesecStop = 0,
      PickAndPlaceONS = false,
      PickAndPlacetimeStop = 60, //NOTE: Timestop en segundos
      PickAndPlaceWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      PickAndPlaceflagRunning = false,
      PickAndPlacedeltaRejected = null,
      PickAndPlaceRejectFlag = false,
      PickAndPlaceReject,
      PickAndPlaceVerify = (function(){
            try{
              PickAndPlaceReject = fs.readFileSync('PickAndPlaceRejected.json')
              if(PickAndPlaceReject.toString().indexOf('}') > 0 && PickAndPlaceReject.toString().indexOf('{\"rejected\":') != -1){
                PickAndPlaceReject = JSON.parse(PickAndPlaceReject)
              }else{
                throw 12121212
              }
            }catch(err){
              if(err.code == 'ENOENT' || err == 12121212){
                fs.writeFileSync('PickAndPlaceRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
                PickAndPlaceReject = {
                  rejected : 0
                }                 
              }
            }
      })();
  var Wrappingct = null,
      Wrappingresults = null,
      CntInWrapping = null,
      CntOutWrapping = null,
      Wrappingactual = 0,
      Wrappingtime = 0,
      Wrappingsec = 0,
      WrappingflagStopped = false,
      Wrappingstate = 0,
      Wrappingspeed = 0,
      WrappingspeedTemp = 0,
      WrappingflagPrint = 0,
      WrappingsecStop = 0,
      WrappingONS = false,
      WrappingtimeStop = 60, //NOTE: Timestop en segundos
      WrappingWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      WrappingflagRunning = false;
  var CasePackerct = null,
      CasePackerresults = null,
      CntInCasePacker = null,
      CntOutCasePacker = null,
      CasePackeractual = 0,
      CasePackertime = 0,
      CasePackersec = 0,
      CasePackerflagStopped = false,
      CasePackerstate = 0,
      CasePackerspeed = 0,
      CasePackerspeedTemp = 0,
      CasePackerflagPrint = 0,
      CasePackersecStop = 0,
      CasePackerONS = false,
      CasePackertimeStop = 60, //NOTE: Timestop en segundos
      CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      CasePackerflagRunning = false,
      CasePackerdeltaRejected = null,
      CasePackerRejectFlag = false,
      CasePackerReject,
      CasePackerVerify = (function(){
            try{
              CasePackerReject = fs.readFileSync('CasePackerRejected.json')
              if(CasePackerReject.toString().indexOf('}') > 0 && CasePackerReject.toString().indexOf('{\"rejected\":') != -1){
                CasePackerReject = JSON.parse(CasePackerReject)
              }else{
                throw 12121212
              }
            }catch(err){
              if(err.code == 'ENOENT' || err == 12121212){
                fs.writeFileSync('CasePackerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
                CasePackerReject = {
                  rejected : 0
                }                 
              }
            }
      })();
  var CaseSealerct = null,
      CaseSealerresults = null,
      CntInCaseSealer = null,
      CntOutCaseSealer = null,
      CaseSealeractual = 0,
      CaseSealertime = 0,
      CaseSealersec = 0,
      CaseSealerflagStopped = false,
      CaseSealerstate = 0,
      CaseSealerspeed = 0,
      CaseSealerspeedTemp = 0,
      CaseSealerflagPrint = 0,
      CaseSealersecStop = 0,
      CaseSealerONS = false,
      CaseSealertimeStop = 60, //NOTE: Timestop en segundos
      CaseSealerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      CaseSealerflagRunning = false,
      CaseSealerdeltaRejected = null,
      CaseSealerRejectFlag = false,
      CaseSealerReject,
      CaseSealerVerify = (function(){
            try{
              CaseSealerReject = fs.readFileSync('CaseSealerRejected.json')
              if(CaseSealerReject.toString().indexOf('}') > 0 && CaseSealerReject.toString().indexOf('{\"rejected\":') != -1){
                CaseSealerReject = JSON.parse(CaseSealerReject)
              }else{
                throw 12121212
              }
            }catch(err){
              if(err.code == 'ENOENT' || err == 12121212){
                fs.writeFileSync('CaseSealerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
                CaseSealerReject = {
                  rejected : 0
                }                 
              }
            }
      })();
  var BoxFormerct = null,
      BoxFormerresults = null,
      CntInBoxFormer = null,
      CntOutBoxFormer = null,
      BoxFormeractual = 0,
      BoxFormertime = 0,
      BoxFormersec = 0,
      BoxFormerflagStopped = false,
      BoxFormerstate = 0,
      BoxFormerspeed = 0,
      BoxFormerspeedTemp = 0,
      BoxFormerflagPrint = 0,
      BoxFormersecStop = 0,
      BoxFormerONS = false,
      BoxFormertimeStop = 60, //NOTE: Timestop en segundos
      BoxFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
      BoxFormerflagRunning = false;
  var CntOutEOL=null,
      secEOL=0;
  var publishConfig;
      var intId1,intId2,intId3,intId4,intId5;
      var files = fs.readdirSync("C:/PULSE/VERSALINE_LOGS/"); //Leer documentos
      var actualdate = Date.now(); //Fecha actual
      var text2send=[];//Vector a enviar
      var flagInfo2Send=0;
      var i=0;
      var pubnub = new PubNub({
        publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
      subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
        uuid: "MEX_TUL_VERSALINE"
      });


      var senderData = function (){
        pubnub.publish(publishConfig, function(status, response) {
      });};

      var client1 = modbus.client.tcp.complete({
        'host': "192.168.10.97",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client2 = modbus.client.tcp.complete({
        'host': "192.168.10.98",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client3 = modbus.client.tcp.complete({
        'host': "192.168.10.99",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client4 = modbus.client.tcp.complete({
        'host': "192.168.10.100",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
      var client5 = modbus.client.tcp.complete({
        'host': "192.168.10.101",
        'port': 502,
        'autoReconnect': true,
        'timeout': 60000,
        'logEnabled': true,
        'reconnectTimeout' : 30000
      });
}catch(err){
    fs.appendFileSync("error_declarations.log",err + '\n');
}
try{
  client1.connect();
  client2.connect();
  client3.connect();
  client4.connect();
  client5.connect();
}catch(err){
  fs.appendFileSync("error_connection.log",err + '\n');
}
try{
  /*----------------------------------------------------------------------------------function-------------------------------------------------------------------------------------------*/
  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
        if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/VERSALINE_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (3*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          secPubNub=0;
          publishConfig = {
            channel : "MEX_TUL_Monitor",
            message : {
                  line: "Versaline",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
//PubNub --------------------------------------------------------------------------------------------------------------------
client1.on('connect', function(err) {
  intId1 =
    setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntInFiller1 = joinWord(resp.register[0], resp.register[1]);
          CntInFiller2 = joinWord(resp.register[2], resp.register[3]);
          CntInStickInserter = joinWord(resp.register[4], resp.register[5])*16;
          //------------------------------------------Filler1----------------------------------------------
                Filler1ct = CntInFiller1 // NOTE: igualar al contador de salida
                if (!Filler1ONS && Filler1ct) {
                  Filler1speedTemp = Filler1ct
                  Filler1sec = Date.now()
                  Filler1ONS = true
                  Filler1time = Date.now()
                }
                if(Filler1ct > Filler1actual){
                  if(Filler1flagStopped){
                    Filler1speed = Filler1ct - Filler1speedTemp
                    Filler1speedTemp = Filler1ct
                    Filler1sec = Date.now()
                    Filler1time = Date.now()
                  }
                  Filler1secStop = 0
                  Filler1state = 1
                  Filler1flagStopped = false
                  Filler1flagRunning = true
                } else if( Filler1ct == Filler1actual ){
                  if(Filler1secStop == 0){
                    Filler1time = Date.now()
                    Filler1secStop = Date.now()
                  }
                  if( ( Date.now() - ( Filler1timeStop * 1000 ) ) >= Filler1secStop ){
                    Filler1speed = 0
                    Filler1state = 2
                    Filler1speedTemp = Filler1ct
                    Filler1flagStopped = true
                    Filler1flagRunning = false
                    Filler1flagPrint = 1
                  }
                }
                Filler1actual = Filler1ct
                if(Date.now() - 60000 * Filler1Worktime >= Filler1sec && Filler1secStop == 0){
                  if(Filler1flagRunning && Filler1ct){
                    Filler1flagPrint = 1
                    Filler1secStop = 0
                    Filler1speed = Filler1ct - Filler1speedTemp
                    Filler1speedTemp = Filler1ct
                    Filler1sec = Date.now()
                  }
                }
                Filler1results = {
                  ST: Filler1state,
                  CPQO: CntInFiller1*16,
                  SP: Filler1speed
                }
                if (Filler1flagPrint == 1) {
                  for (var key in Filler1results) {
                    if( Filler1results[key] != null && ! isNaN(Filler1results[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_Filler1_Versaline.log', 'tt=' + Filler1time + ',var=' + key + ',val=' + Filler1results[key] + '\n')
                  }
                  Filler1flagPrint = 0
                  Filler1secStop = 0
                  Filler1time = Date.now()
                }
          //------------------------------------------Filler1----------------------------------------------
          //------------------------------------------Filler2----------------------------------------------
                Filler2ct = CntInFiller2 // NOTE: igualar al contador de salida
                if (!Filler2ONS && Filler2ct) {
                  Filler2speedTemp = Filler2ct
                  Filler2sec = Date.now()
                  Filler2ONS = true
                  Filler2time = Date.now()
                }
                if(Filler2ct > Filler2actual){
                  if(Filler2flagStopped){
                    Filler2speed = Filler2ct - Filler2speedTemp
                    Filler2speedTemp = Filler2ct
                    Filler2sec = Date.now()
                    Filler2time = Date.now()
                  }
                  Filler2secStop = 0
                  Filler2state = 1
                  Filler2flagStopped = false
                  Filler2flagRunning = true
                } else if( Filler2ct == Filler2actual ){
                  if(Filler2secStop == 0){
                    Filler2time = Date.now()
                    Filler2secStop = Date.now()
                  }
                  if( ( Date.now() - ( Filler2timeStop * 1000 ) ) >= Filler2secStop ){
                    Filler2speed = 0
                    Filler2state = 2
                    Filler2speedTemp = Filler2ct
                    Filler2flagStopped = true
                    Filler2flagRunning = false
                    Filler2flagPrint = 1
                  }
                }
                Filler2actual = Filler2ct
                if(Date.now() - 60000 * Filler2Worktime >= Filler2sec && Filler2secStop == 0){
                  if(Filler2flagRunning && Filler2ct){
                    Filler2flagPrint = 1
                    Filler2secStop = 0
                    Filler2speed = Filler2ct - Filler2speedTemp
                    Filler2speedTemp = Filler2ct
                    Filler2sec = Date.now()
                  }
                }
                Filler2results = {
                  ST: Filler2state,
                  CPQO: CntInFiller2*16,
                  SP: Filler2speed
                }
                if (Filler2flagPrint == 1) {
                  for (var key in Filler2results) {
                    if( Filler2results[key] != null && ! isNaN(Filler2results[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_Filler2_Versaline.log', 'tt=' + Filler2time + ',var=' + key + ',val=' + Filler2results[key] + '\n')
                  }
                  Filler2flagPrint = 0
                  Filler2secStop = 0
                  Filler2time = Date.now()
                }
          //------------------------------------------Filler2----------------------------------------------
          //------------------------------------------StickInserter----------------------------------------------
                StickInserterct = CntInStickInserter // NOTE: igualar al contador de salida
                if (!StickInserterONS && StickInserterct) {
                  StickInserterspeedTemp = StickInserterct
                  StickInsertersec = Date.now()
                  StickInserterONS = true
                  StickInsertertime = Date.now()
                }
                if(StickInserterct > StickInserteractual){
                  if(StickInserterflagStopped){
                    StickInserterspeed = StickInserterct - StickInserterspeedTemp
                    StickInserterspeedTemp = StickInserterct
                    StickInsertersec = Date.now()
                    StickInsertertime = Date.now()
                  }
                  StickInsertersecStop = 0
                  StickInserterstate = 1
                  StickInserterflagStopped = false
                  StickInserterflagRunning = true
                } else if( StickInserterct == StickInserteractual ){
                  if(StickInsertersecStop == 0){
                    StickInsertertime = Date.now()
                    StickInsertersecStop = Date.now()
                  }
                  if( ( Date.now() - ( StickInsertertimeStop * 1000 ) ) >= StickInsertersecStop ){
                    StickInserterspeed = 0
                    StickInserterstate = 2
                    StickInserterspeedTemp = StickInserterct
                    StickInserterflagStopped = true
                    StickInserterflagRunning = false
                    StickInserterflagPrint = 1
                  }
                }
                StickInserteractual = StickInserterct
                if(Date.now() - 60000 * StickInserterWorktime >= StickInsertersec && StickInsertersecStop == 0){
                  if(StickInserterflagRunning && StickInserterct){
                    StickInserterflagPrint = 1
                    StickInsertersecStop = 0
                    StickInserterspeed = StickInserterct - StickInserterspeedTemp
                    StickInserterspeedTemp = StickInserterct
                    StickInsertersec = Date.now()
                  }
                }
                StickInserterresults = {
                  ST: StickInserterstate,
                  CPQO: CntInStickInserter,
                  SP: StickInserterspeed
                }
                if (StickInserterflagPrint == 1) {
                  for (var key in StickInserterresults) {
                    if( StickInserterresults[key] != null && ! isNaN(StickInserterresults[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_StickInserter_Versaline.log', 'tt=' + StickInsertertime + ',var=' + key + ',val=' + StickInserterresults[key] + '\n')
                  }
                  StickInserterflagPrint = 0
                  StickInsertersecStop = 0
                  StickInsertertime = Date.now()
                }
          //------------------------------------------StickInserter----------------------------------------------
        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {
    clearInterval(intId1);
  });
  client2.on('connect', function(err) {
    intId2 =
      setInterval(function(){
          client2.readHoldingRegisters(0, 16).then(function(resp) {
            CntInPickAndPlace1 = joinWord(resp.register[0], resp.register[1]) +
                                 joinWord(resp.register[2], resp.register[3]) +
                                 joinWord(resp.register[4], resp.register[5]) +
                                 joinWord(resp.register[6], resp.register[7]) +
                                 joinWord(resp.register[8], resp.register[9]) +
                                 joinWord(resp.register[10], resp.register[11]) +
                                 joinWord(resp.register[12], resp.register[13]) +
                                 joinWord(resp.register[14], resp.register[15]);
          });//Cierre de lectura
        },1000);
    });//Cierre de cliente

    client2.on('error', function(err){
      clearInterval(intId2);
    });
    client2.on('close', function() {
      clearInterval(intId2);
    });
    client3.on('connect', function(err) {
      intId3 =
        setInterval(function(){
            client3.readHoldingRegisters(0, 16).then(function(resp) {
              CntInPickAndPlace   = joinWord(resp.register[0], resp.register[1]) +
                                    joinWord(resp.register[2], resp.register[3]) +
                                    joinWord(resp.register[4], resp.register[5]) +
                                    joinWord(resp.register[6], resp.register[7]) +
                                    joinWord(resp.register[8], resp.register[9]) +
                                    joinWord(resp.register[10], resp.register[11]) +
                                    joinWord(resp.register[12], resp.register[13]) +
                                    joinWord(resp.register[14], resp.register[15]);
              CntInPickAndPlace   += CntInPickAndPlace1;

            });//Cierre de lectura
          },1000);
      });//Cierre de cliente

      client3.on('error', function(err){
        clearInterval(intId3);
      });
      client3.on('close', function() {
        clearInterval(intId3);
      });
      client4.on('connect', function(err) {
        intId4 =
          setInterval(function(){
              client4.readHoldingRegisters(0, 16).then(function(resp) {
                CntInWrapping =  joinWord(resp.register[0], resp.register[1]) +
                                 joinWord(resp.register[2], resp.register[3]) +
                                 joinWord(resp.register[4], resp.register[5]) +
                                 joinWord(resp.register[6], resp.register[7]) +
                                 joinWord(resp.register[8], resp.register[9]) +
                                 joinWord(resp.register[10], resp.register[11]) +
                                 joinWord(resp.register[12], resp.register[13]) +
                                 joinWord(resp.register[14], resp.register[15]);
                CntOutPickAndPlace = CntInWrapping;
                //------------------------------------------PickAndPlace----------------------------------------------
                      PickAndPlacect = CntOutPickAndPlace // NOTE: igualar al contador de salida
                      if (!PickAndPlaceONS && PickAndPlacect) {
                        PickAndPlacespeedTemp = PickAndPlacect
                        PickAndPlacesec = Date.now()
                        PickAndPlaceONS = true
                        PickAndPlacetime = Date.now()
                      }
                      if(PickAndPlacect > PickAndPlaceactual){
                        if(PickAndPlaceflagStopped){
                          PickAndPlacespeed = PickAndPlacect - PickAndPlacespeedTemp
                          PickAndPlacespeedTemp = PickAndPlacect
                          PickAndPlacesec = Date.now()
                          PickAndPlacedeltaRejected = null
                          PickAndPlaceRejectFlag = false
                          PickAndPlacetime = Date.now()
                        }
                        PickAndPlacesecStop = 0
                        PickAndPlacestate = 1
                        PickAndPlaceflagStopped = false
                        PickAndPlaceflagRunning = true
                      } else if( PickAndPlacect == PickAndPlaceactual ){
                        if(PickAndPlacesecStop == 0){
                          PickAndPlacetime = Date.now()
                          PickAndPlacesecStop = Date.now()
                        }
                        if( ( Date.now() - ( PickAndPlacetimeStop * 1000 ) ) >= PickAndPlacesecStop ){
                          PickAndPlacespeed = 0
                          PickAndPlacestate = 2
                          PickAndPlacespeedTemp = PickAndPlacect
                          PickAndPlaceflagStopped = true
                          PickAndPlaceflagRunning = false
                          if(CntInPickAndPlace - CntOutPickAndPlace - PickAndPlaceReject.rejected != 0 && ! PickAndPlaceRejectFlag){
                            PickAndPlacedeltaRejected = CntInPickAndPlace - CntOutPickAndPlace - PickAndPlaceReject.rejected
                            PickAndPlaceReject.rejected = CntInPickAndPlace - CntOutPickAndPlace
                            fs.writeFileSync('PickAndPlaceRejected.json','{"rejected": ' + PickAndPlaceReject.rejected + '}')
                            PickAndPlaceRejectFlag = true
                          }else{
                            PickAndPlacedeltaRejected = null
                            }
                          PickAndPlaceflagPrint = 1
                        }
                      }
                      PickAndPlaceactual = PickAndPlacect
                      if(Date.now() - 60000 * PickAndPlaceWorktime >= PickAndPlacesec && PickAndPlacesecStop == 0){
                        if(PickAndPlaceflagRunning && PickAndPlacect){
                          PickAndPlaceflagPrint = 1
                          PickAndPlacesecStop = 0
                          PickAndPlacespeed = PickAndPlacect - PickAndPlacespeedTemp
                          PickAndPlacespeedTemp = PickAndPlacect
                          PickAndPlacesec = Date.now()
                        }
                      }
                      PickAndPlaceresults = {
                        ST: PickAndPlacestate,
                        CPQI: CntInPickAndPlace,
                        CPQO: CntOutPickAndPlace,
                        CPQR : PickAndPlacedeltaRejected,
                        SP: PickAndPlacespeed
                      }
                      if (PickAndPlaceflagPrint == 1) {
                        for (var key in PickAndPlaceresults) {
                          if( PickAndPlaceresults[key] != null && ! isNaN(PickAndPlaceresults[key]) )
                          //NOTE: Cambiar path
                          fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_PickAndPlace_Versaline.log', 'tt=' + PickAndPlacetime + ',var=' + key + ',val=' + PickAndPlaceresults[key] + '\n')
                        }
                        PickAndPlaceflagPrint = 0
                        PickAndPlacesecStop = 0
                        PickAndPlacetime = Date.now()
                      }
                //------------------------------------------PickAndPlace----------------------------------------------

              });//Cierre de lectura
            },1000);
        });//Cierre de cliente

        client4.on('error', function(err){
          clearInterval(intId4);
        });
        client4.on('close', function() {
            clearInterval(intId4);
        });
        client5.on('connect', function(err) {
          intId5 =
            setInterval(function(){
                client5.readHoldingRegisters(0, 16).then(function(resp) {
                  CntInCasePacker =  joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3]);
                  CntOutCaseSealer = joinWord(resp.register[4], resp.register[5]);
                  CntOutEOL = CntOutCaseSealer;
                  CntOutBoxFormer =  joinWord(resp.register[8], resp.register[9]);
                  CntInCaseSealer =  joinWord(resp.register[10], resp.register[11]);
                  CntOutCasePacker = CntInCaseSealer;
                  CntOutWrapping = CntInCasePacker;
                  //------------------------------------------Wrapping----------------------------------------------
                        Wrappingct = CntOutWrapping // NOTE: igualar al contador de salida
                        if (!WrappingONS && Wrappingct) {
                          WrappingspeedTemp = Wrappingct
                          Wrappingsec = Date.now()
                          WrappingONS = true
                          Wrappingtime = Date.now()
                        }
                        if(Wrappingct > Wrappingactual){
                          if(WrappingflagStopped){
                            Wrappingspeed = Wrappingct - WrappingspeedTemp
                            WrappingspeedTemp = Wrappingct
                            Wrappingsec = Date.now()
                            Wrappingtime = Date.now()
                          }
                          WrappingsecStop = 0
                          Wrappingstate = 1
                          WrappingflagStopped = false
                          WrappingflagRunning = true
                        } else if( Wrappingct == Wrappingactual ){
                          if(WrappingsecStop == 0){
                            Wrappingtime = Date.now()
                            WrappingsecStop = Date.now()
                          }
                          if( ( Date.now() - ( WrappingtimeStop * 1000 ) ) >= WrappingsecStop ){
                            Wrappingspeed = 0
                            Wrappingstate = 2
                            WrappingspeedTemp = Wrappingct
                            WrappingflagStopped = true
                            WrappingflagRunning = false
                            WrappingflagPrint = 1
                          }
                        }
                        Wrappingactual = Wrappingct
                        if(Date.now() - 60000 * WrappingWorktime >= Wrappingsec && WrappingsecStop == 0){
                          if(WrappingflagRunning && Wrappingct){
                            WrappingflagPrint = 1
                            WrappingsecStop = 0
                            Wrappingspeed = Wrappingct - WrappingspeedTemp
                            WrappingspeedTemp = Wrappingct
                            Wrappingsec = Date.now()
                          }
                        }
                        Wrappingresults = {
                          ST: Wrappingstate,
                          CPQI: CntInWrapping,
                          CPQO: CntOutWrapping,
                          SP: Wrappingspeed
                        }
                        if (WrappingflagPrint == 1) {
                          for (var key in Wrappingresults) {
                            if( Wrappingresults[key] != null && ! isNaN(Wrappingresults[key]) )
                            //NOTE: Cambiar path
                            fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_Wrapping_Versaline.log', 'tt=' + Wrappingtime + ',var=' + key + ',val=' + Wrappingresults[key] + '\n')
                          }
                          WrappingflagPrint = 0
                          WrappingsecStop = 0
                          Wrappingtime = Date.now()
                        }
                  //------------------------------------------Wrapping----------------------------------------------
                  //------------------------------------------CasePacker----------------------------------------------
                        CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
                        if (!CasePackerONS && CasePackerct) {
                          CasePackerspeedTemp = CasePackerct
                          CasePackersec = Date.now()
                          CasePackerONS = true
                          CasePackertime = Date.now()
                        }
                        if(CasePackerct > CasePackeractual){
                          if(CasePackerflagStopped){
                            CasePackerspeed = CasePackerct - CasePackerspeedTemp
                            CasePackerspeedTemp = CasePackerct
                            CasePackersec = Date.now()
                            CasePackerdeltaRejected = null
                            CasePackerRejectFlag = false
                            CasePackertime = Date.now()
                          }
                          CasePackersecStop = 0
                          CasePackerstate = 1
                          CasePackerflagStopped = false
                          CasePackerflagRunning = true
                        } else if( CasePackerct == CasePackeractual ){
                          if(CasePackersecStop == 0){
                            CasePackertime = Date.now()
                            CasePackersecStop = Date.now()
                          }
                          if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                            CasePackerspeed = 0
                            CasePackerstate = 2
                            CasePackerspeedTemp = CasePackerct
                            CasePackerflagStopped = true
                            CasePackerflagRunning = false
                            if(CntInCasePacker - CntOutCasePacker - CasePackerReject.rejected != 0 && ! CasePackerRejectFlag){
                                CasePackerdeltaRejected = CntInCasePacker - CntOutCasePacker - CasePackerReject.rejected
                                CasePackerReject.rejected = CntInCasePacker - CntOutCasePacker
                                fs.writeFileSync('CasePackerRejected.json','{"rejected": ' + CasePackerReject.rejected + '}')
                                CasePackerRejectFlag = true
                              }else{
                                CasePackerdeltaRejected = null
                                    }
                            CasePackerflagPrint = 1
                          }
                        }
                        CasePackeractual = CasePackerct
                        if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                          if(CasePackerflagRunning && CasePackerct){
                            CasePackerflagPrint = 1
                            CasePackersecStop = 0
                            CasePackerspeed = CasePackerct - CasePackerspeedTemp
                            CasePackerspeedTemp = CasePackerct
                            CasePackersec = Date.now()
                          }
                        }
                        CasePackerresults = {
                          ST: CasePackerstate,
                          CPQI: CntInCasePacker,
                          CPQO: CntOutCasePacker,
                          CPQR : CasePackerdeltaRejected,
                          SP: CasePackerspeed
                        }
                        if (CasePackerflagPrint == 1) {
                          for (var key in CasePackerresults) {
                            if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                            //NOTE: Cambiar path
                            fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_CasePacker_Versaline.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                          }
                          CasePackerflagPrint = 0
                          CasePackersecStop = 0
                          CasePackertime = Date.now()
                        }
                  //------------------------------------------CasePacker----------------------------------------------
                  //------------------------------------------CaseSealer----------------------------------------------
                        CaseSealerct = CntOutCaseSealer // NOTE: igualar al contador de salida
                        if (!CaseSealerONS && CaseSealerct) {
                          CaseSealerspeedTemp = CaseSealerct
                          CaseSealersec = Date.now()
                          CaseSealerONS = true
                          CaseSealertime = Date.now()
                        }
                        if(CaseSealerct > CaseSealeractual){
                          if(CaseSealerflagStopped){
                            CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
                            CaseSealerspeedTemp = CaseSealerct
                            CaseSealersec = Date.now()
                            CaseSealerdeltaRejected = null
                            CaseSealerRejectFlag = false
                            CaseSealertime = Date.now()
                          }
                          CaseSealersecStop = 0
                          CaseSealerstate = 1
                          CaseSealerflagStopped = false
                          CaseSealerflagRunning = true
                        } else if( CaseSealerct == CaseSealeractual ){
                          if(CaseSealersecStop == 0){
                            CaseSealertime = Date.now()
                            CaseSealersecStop = Date.now()
                          }
                          if( ( Date.now() - ( CaseSealertimeStop * 1000 ) ) >= CaseSealersecStop ){
                            CaseSealerspeed = 0
                            CaseSealerstate = 2
                            CaseSealerspeedTemp = CaseSealerct
                            CaseSealerflagStopped = true
                            CaseSealerflagRunning = false
                            if(CntInCaseSealer - CntOutCaseSealer - CaseSealerReject.rejected != 0 && ! CaseSealerRejectFlag){
                                CaseSealerdeltaRejected = CntInCaseSealer - CntOutCaseSealer - CaseSealerReject.rejected
                                CaseSealerReject.rejected = CntInCaseSealer - CntOutCaseSealer
                                fs.writeFileSync('CaseSealerRejected.json','{"rejected": ' + CaseSealerReject.rejected + '}')
                                CaseSealerRejectFlag = true
                              }else{
                                CaseSealerdeltaRejected = null
                                  }
                            CaseSealerflagPrint = 1
                          }
                        }
                        CaseSealeractual = CaseSealerct
                        if(Date.now() - 60000 * CaseSealerWorktime >= CaseSealersec && CaseSealersecStop == 0){
                          if(CaseSealerflagRunning && CaseSealerct){
                            CaseSealerflagPrint = 1
                            CaseSealersecStop = 0
                            CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
                            CaseSealerspeedTemp = CaseSealerct
                            CaseSealersec = Date.now()
                          }
                        }
                        CaseSealerresults = {
                          ST: CaseSealerstate,
                          CPQI: CntInCaseSealer,
                          CPQO: CntOutCaseSealer,
                          CPQR : CaseSealerdeltaRejected,
                          SP: CaseSealerspeed
                        }
                        if (CaseSealerflagPrint == 1) {
                          for (var key in CaseSealerresults) {
                            if( CaseSealerresults[key] != null && ! isNaN(CaseSealerresults[key]) )
                            //NOTE: Cambiar path
                            fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_CaseSealer_Versaline.log', 'tt=' + CaseSealertime + ',var=' + key + ',val=' + CaseSealerresults[key] + '\n')
                          }
                          CaseSealerflagPrint = 0
                          CaseSealersecStop = 0
                          CaseSealertime = Date.now()
                        }
                  //------------------------------------------CaseSealer----------------------------------------------
                  //------------------------------------------BoxFormer----------------------------------------------
                        BoxFormerct = CntOutBoxFormer // NOTE: igualar al contador de salida
                        if (!BoxFormerONS && BoxFormerct) {
                          BoxFormerspeedTemp = BoxFormerct
                          BoxFormersec = Date.now()
                          BoxFormerONS = true
                          BoxFormertime = Date.now()
                        }
                        if(BoxFormerct > BoxFormeractual){
                          if(BoxFormerflagStopped){
                            BoxFormerspeed = BoxFormerct - BoxFormerspeedTemp
                            BoxFormerspeedTemp = BoxFormerct
                            BoxFormersec = Date.now()
                            BoxFormertime = Date.now()
                          }
                          BoxFormersecStop = 0
                          BoxFormerstate = 1
                          BoxFormerflagStopped = false
                          BoxFormerflagRunning = true
                        } else if( BoxFormerct == BoxFormeractual ){
                          if(BoxFormersecStop == 0){
                            BoxFormertime = Date.now()
                            BoxFormersecStop = Date.now()
                          }
                          if( ( Date.now() - ( BoxFormertimeStop * 1000 ) ) >= BoxFormersecStop ){
                            BoxFormerspeed = 0
                            BoxFormerstate = 2
                            BoxFormerspeedTemp = BoxFormerct
                            BoxFormerflagStopped = true
                            BoxFormerflagRunning = false
                            BoxFormerflagPrint = 1
                          }
                        }
                        BoxFormeractual = BoxFormerct
                        if(Date.now() - 60000 * BoxFormerWorktime >= BoxFormersec && BoxFormersecStop == 0){
                          if(BoxFormerflagRunning && BoxFormerct){
                            BoxFormerflagPrint = 1
                            BoxFormersecStop = 0
                            BoxFormerspeed = BoxFormerct - BoxFormerspeedTemp
                            BoxFormerspeedTemp = BoxFormerct
                            BoxFormersec = Date.now()
                          }
                        }
                        BoxFormerresults = {
                          ST: BoxFormerstate,
                          CPQO: CntOutBoxFormer,
                          SP: BoxFormerspeed
                        }
                        if (BoxFormerflagPrint == 1) {
                          for (var key in BoxFormerresults) {
                            if( BoxFormerresults[key] != null && ! isNaN(BoxFormerresults[key]) )
                            //NOTE: Cambiar path
                            fs.appendFileSync('C:/Pulse/VERSALINE_LOGS/mex_tul_BoxFormer_Versaline.log', 'tt=' + BoxFormertime + ',var=' + key + ',val=' + BoxFormerresults[key] + '\n')
                          }
                          BoxFormerflagPrint = 0
                          BoxFormersecStop = 0
                          BoxFormertime = Date.now()
                        }
                  //------------------------------------------BoxFormer----------------------------------------------
                  /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                       if(secEOL>=60 && CntOutEOL){
                          fs.appendFileSync("C:/Pulse/VERSALINE_LOGS/mex_tul_eol_Versaline.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                          secEOL=0;
                        }else{
                          secEOL++;
                        }
                  /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                });//Cierre de lectura
              },1000);
          });//Cierre de cliente

          client5.on('error', function(err){
            clearInterval(intId5);
          });
          client5.on('close', function() {
              clearInterval(intId5);
          });
}catch(err){
    fs.appendFileSync("error_VERSALINE.log",err + '\n');
}
