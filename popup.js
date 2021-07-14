
let loginbutton = document.getElementById('loginbutton');
let tmpUser = "";
let tmpPwd = "";
let pwdMin = 10;
let pwdMax = 63;

let countSPCH = 0;
let countNMBR = 0;
let countUC = 0;
let countLC = 0;
let countCollision = 0;

//Arranging the length of the generated password
//password will be between 15 and 30 Characters
var pwdMAXLENGTH = 30;
var pwdLENGTHVAR = 16;




checklogin()
//bind buttons to functions
document.getElementById('loginbuttonEmail').onclick = logMeInEmail;
document.getElementById('loginbuttonPwd').onclick = logMeInPwd;
document.getElementById('logoutBtn').onclick = logout;
document.getElementById('generatePwd').onclick = generatePwdOnAddon;

function logMeInEmail(){
  console.log("Email 1check started...");
  tmpUser = document.getElementById('umail').value;
  //validate input!
  if(validateEmail(tmpUser)){
    //do login check
    document.getElementById('emailCheck').style.display = "none";
    document.getElementById('pwdCheck').style.display = "block";
  }else{
    restoreLogin();
  }
}
function logMeInPwd(){
  console.log("Password check started...");
  tmpPwd = document.getElementById('pwd').value;
  
  if(validatePwd(tmpPwd)){
    document.getElementById('pwdCheck').style.display = "none";
    document.getElementById('logintrue').style.display = "block";

    //calculate User Salt
    calcSalt()

  }else{
    console.log("is null")
    document.getElementById("pwdNotGood").hidden = false;
  }
}
function restoreLogin(){
  document.getElementById('logintrue').style.display = "none";
  document.getElementById('emailCheck').style.display = "block";
}
function validateEmail(mail){
  //regular expression to validate form
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(mail.match(mailformat)){
    console.log("email form accepted...")
    return (true);
  }
  return (false);
}
function validatePwd(pwd){
  if(pwd.length < pwdMin || pwd.length > pwdMax){
    return (false);
  }
  //var letterNumber = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  //if(pwd.match(letterNumber)){
  //  return (true);
  //}
  //return(false);
  return(true);
}
function calcSalt(){
  var value = CryptoJS.SHA512(tmpPwd + tmpUser)
  value = String(value)
  //store data
  chrome.storage.local.set({key: value}, function() {
    console.log('setting...' );
  });

}
function checklogin(){
  let salt = "x";
  //read data
  try{
    chrome.storage.local.get(['key'], function(result) {
      salt = result.key;

      if(salt == undefined){
        return
      }else{
        console.log("already logged in");
        document.getElementById('emailCheck').style.display = "none";
        document.getElementById('logintrue').style.display = "block";
      }
    });
  }catch{
    console.log("Error");
    return
  }
}
function logout(){
  //remove data
  chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if(error){
        console.error(error);
    }
  });
  document.getElementById('resultdiv').innerText = "";
  document.getElementById('resultdiv').style.display = "none";
  document.getElementById('pwdCheck').style.display = "none";
  document.getElementById('logintrue').style.display = "none";
  document.getElementById('emailCheck').style.display = "block";
}

function generatePwdOnAddon(){
  let userWp = document.getElementById('cWebpage').value;
  let userPwd = document.getElementById('cPwd').value;

  /*---------FOR EXPERIMENT----------
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(var i = 0; i < 100000; i++){
    var result = '';
    for(var j = 0; j < Math.floor(Math.random() * 30); j++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    generatePwd(userWp, result);
  }*/
  
  generatePwd(userWp, userPwd);
}

function generatePwd(userWp, userPwd){
  chrome.storage.local.get(['key'], function(result) {
    let userSalt = result.key;
    userWp = fixUrl(userWp);
    var pwd = CryptoJS.SHA512(userSalt + userPwd + userWp);
    var pwdHex = String(pwd);
    pwd = pwd.toString(CryptoJS.enc.Base64);
    pwd = pwd.slice(0,86);

    console.log(userSalt);
    

    saltNmbr = parseInt(userSalt[0], 16);
    pwdNmbr = parseInt(pwdHex[0], 16);
    pwdlength = pwdMAXLENGTH - parseInt((saltNmbr + pwdNmbr) % pwdLENGTHVAR);
    pwdDoubled = pwd + pwd;

    sum = saltNmbr;
    for(i = 0; i < pwd.length; i++){
      sum += pwd[i].charCodeAt(0);
    }
    startPoint = sum % pwd.length;
    let preptPwd = pwdDoubled.slice(startPoint, (startPoint + pwdlength));


    var iteraterJ = 2;
    while(true){
      preptPwd2 = checkCharacters(preptPwd, iteraterJ, pwdHex, userSalt);
      if(preptPwd2 == 'collision'){
        iteraterJ++;
        countCollision++;
        console.log("Collisions: " + countCollision);
        console.log(iteraterJ);
        continue;
      }
      else{
        break;
      }
    }

    document.getElementById('resultdiv').style.display = "block";
    //test = '<div class="test"><br>'+ preptPwd + '</div>';
    //document.getElementById("resultdiv").innerHTML = test;
    document.getElementById("resultdiv").innerHTML = preptPwd2;
    return preptPwd2;
  });
}

function checkCharacters(preptPwd, iteraterJ, pwdHex, userSalt){
  if(iteraterJ > (pwdHex.length-4)){
    alert("Password can not be generated! Collision Exception!");
    return('');
  }

  var specialCharID = iteraterJ++;
  var specialNumberID = iteraterJ++;
  var specialUpperCaseID = iteraterJ++;
  var specialLowerCaseID = iteraterJ++;

  //store indexes for collision detection
  var indexList = [];

  //Special Characters
  specialchars = ['+','/','!',"$","%","&","(",")","=","?"];
  //there can only be '+' and '/' by default in pwd
  specialcharsShort = ['+', '/'];
  let statusSpCh = false;
  specialcharsShort.forEach(element => {
    if(preptPwd.includes(element)){
      statusSpCh = true;
    }
  });
  let tmpPwd = "";
  //no special character in pwd - adding one to fullfill password policies
  if(!statusSpCh){
    let spChSalt = userSalt[specialCharID];
    let spChPwd = pwdHex[specialCharID];
    let spChPosition = (spChSalt.charCodeAt(0) + spChPwd.charCodeAt(0)) % pwdlength;
    indexList.push(spChPosition);
    //console.log("change character -" + preptPwd[spChPosition] + "- to -"+ specialchars[(spChPwd.charCodeAt(0) + spChSalt.charCodeAt(0)) % specialchars.length] + "-");
    //console.log("Inserting Sp.Ch.");
    countSPCH++;
    tmpPwd = preptPwd.slice(0,spChPosition) + specialchars[(spChPwd.charCodeAt(0) + spChSalt.charCodeAt(0)) % specialchars.length] + preptPwd.slice(spChPosition+1, preptPwd.length);
    preptPwd = tmpPwd;
  }


  //Number
  numbers = ['0','1','2','3','4','5','6','7','8','9',];
  let statusNmbr = false;
  numbers.forEach(element => {
    if(preptPwd.includes(element)){
      statusNmbr = true;
    }
  })
  if(!statusNmbr){
    let spNmbrSalt = userSalt[specialNumberID];
    let spNmbrPwd = pwdHex[specialNumberID];
    let spNmbrPosition = (spNmbrSalt.charCodeAt(0) + spNmbrPwd.charCodeAt(0)) % pwdlength;
    indexList.push(spNmbrPosition);

    //console.log("Inserting Number")
    countNMBR++;
    tmpPwd = preptPwd.slice(0,spNmbrPosition) + numbers[(spNmbrPwd.charCodeAt(0) + spNmbrSalt.charCodeAt(0)) % numbers.length] + preptPwd.slice(spNmbrPosition+1, preptPwd.length);
    preptPwd = tmpPwd;
  }

  //Upper Case Letter
  uppercase = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  let statusUC = false;
  uppercase.forEach(element => {
    if(preptPwd.includes(element)){
      statusUC = true;
    }
  })
  if(!statusUC){
    let spUCSalt = userSalt[specialUpperCaseID];
    let spUCPwd = pwdHex[specialUpperCaseID];
    let spUCPosition = (spUCSalt.charCodeAt(0) + spUCPwd.charCodeAt(0)) % pwdlength;
    indexList.push(spUCPosition);

    //console.log("Inserting UC")
    countUC++;
    tmpPwd = preptPwd.slice(0,spUCPosition) + lowercase[(spUCPwd.charCodeAt(0) + spUCSalt.charCodeAt(0)) % lowercase.length] + preptPwd.slice(spUCPosition+1, preptPwd.length);
    preptPwd = tmpPwd;
  }

  //Lower Case Letter
  lowercase = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  let statusLC = false;
  lowercase.forEach(element => {
    if(preptPwd.includes(element)){
      statusLC = true;
    }
  })
  if(!statusLC){
    let spLCSalt = userSalt[specialLowerCaseID];
    let spLCPwd = pwdHex[specialLowerCaseID];
    let spLCPosition = (spLCSalt.charCodeAt(0) + spLCPwd.charCodeAt(0)) % pwdlength;
    indexList.push(spLCPosition);

    //console.log("Inserting LC")
    countLC++;
    tmpPwd = preptPwd.slice(0,spLCPosition) + lowercase[(spLCPwd.charCodeAt(0) + spLCSalt.charCodeAt(0)) % lowercase.length] + preptPwd.slice(spLCPosition+1, preptPwd.length);
    preptPwd = tmpPwd;
  }

  //check if more than 1 character was added
  if(indexList.length > 1){
    //check if duplicate indexes
    if(checkDuplicate(indexList)){
      console.log('collision detected!')
      return('collision');
    }
  }
  /*---------FOR EXPERIMENT----------
  console.log(countSPCH + " " + countNMBR + " " +countUC + " " +countLC +" " + countCollision);
  */
  return(preptPwd);
}

function checkDuplicate(indexList) {
  let result = false;
  const s = new Set(indexList);
  // compare the size of set and array
  if(indexList.length !== s.size){
     result = true;
  }
  return(result);
}

function fixUrl(url){
  //check for url shape
  //Regular Expressions will result false positives or negatives!
  
  //to guarantee a fully working scheme to manipulate the url every public Top-Level-Domain needs to be considered. 
  //implementations of the standard can be found under:
  //https://publicsuffix.org/

  //Prototype only considers the protocols: http/https 
  let testProtocol = url.slice(0, 8);
  if(testProtocol.search('http') !== -1){
    if(testProtocol.search('https') !== -1){
      url = url.slice(8, url.length);
    }else{
      url = url.slice(7, url.length);
    }
  }

  //shorten www. or www1., www2., ...
  let testHostname = url.slice(0,4);

  if(testHostname.search('www\\.') !== -1){
    url = url.slice(4);
  }else if(testHostname.search('www') !== -1 && url[4] == '.'){  //
    if(!testHostname[0] == 'w'){
      url = url.slice(5);
    }
  }

  //check for port
  let testPort = url.search(':');
  if(testPort !== -1){
    url = url.slice(0, testPort);
  }

  //check for path
  let testSlash = url.search('/');
  if(testSlash !== -1){
    url = url.slice(0, testSlash);
  }

  //check for query
  let testQuestion = url.search('\\?');
  if(testQuestion !== -1){
    url = url.slice(0, testQuestion);
  }

  return url;
  //To Implement
}