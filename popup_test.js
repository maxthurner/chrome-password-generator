
let loginbutton = document.getElementById('loginbutton');
let tmpUser = "";
let tmpPwd = "";
let pwdMin = 10;
let pwdMax = 63;

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
    console.log(tmpUser);
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
  console.log("Username = " + tmpUser)
  console.log("Password = " + tmpPwd)
  //store data
  chrome.storage.local.set({key: value}, function() {
    console.log('Value is set to ' + value);
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
  generatePwd(userWp, userPwd);
}




function generatePwd(userWp, userPwd){
  chrome.storage.local.get(['key'], function(result) {
    let userSalt = result.key;
    userWp = fixUrl(userWp);

    var pwd = CryptoJS.SHA512(userSalt + userPwd + userWp);
    console.log(pwd);
    var pwdHex = String(pwd);
    console.log(pwdHex);
    pwd = CryptoJS.enc.Utf8.parse(String(pwd));
    pwd = CryptoJS.enc.Base64.stringify(pwd);
    //pwd = pwd.slice(0,86);
    console.log(pwd);
    
    //Arranging the length of the password
    var pwdMAXLENGTH = 30;
    var pwdLENGTHVAR = 16;
    //password will be between 15 and 30 Characters

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
 
    //check for special Characters
    specialchars = ['+','/','!',"$","%","&","(",")","=","?"];
    //there can only be '+' and '/' by default in pwd
    specialcharsShort = ['+', '/'];
    let status = false;
    specialcharsShort.forEach(element => {
      if(preptPwd.includes(element)){
        status = true;
      }
    });
    let tmpPwd = "";
    //no special character in pwd - adding one to fullfill password policies
    if(!status){
      console.log(preptPwd);
      
      spChSalt = userSalt[userSalt.length - 1];
      spChPwd = pwdHex[pwdHex.length -1];
      spChPosition = (spChSalt.charCodeAt(0) + spChPwd.charCodeAt(0)) % pwdlength;
      
      console.log("change character -" + preptPwd[spChPosition] + "- to -"+ specialchars[spChPwd.charCodeAt(0) % specialchars.length] + "-");
      
      tmpPwd = preptPwd.slice(0,spChPosition) + specialchars[spChPwd.charCodeAt(0) % specialchars.length] + preptPwd.slice(spChPosition+1, preptPwd.length);
      preptPwd = tmpPwd;
    }

    //maybe check if Number, LowerCase, UpperCase are in the pwd

    //console.log("-- display pwd --");
    document.getElementById('resultdiv').style.display = "block";
    //test = '<div class="test"><br>'+ preptPwd + '</div>';
    //document.getElementById("resultdiv").innerHTML = test;
    document.getElementById("resultdiv").innerHTML = preptPwd;
    return preptPwd;
  });
}

function fixUrl(url){
  //check for url shape
  return url;
  //To Implement
}