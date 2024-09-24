# chrome-passwort-generator
Prototype to Bachelor Thesis of Maximilian Thurner
---

<!--
This repository implements the passwort generation algorithm as an Google-Chrome Extension.  ![Passwort_Generierungskonzept_v2](https://user-images.githubusercontent.com/59063463/125648051-cc86f44d-a0fd-40eb-a631-cb93414010a7.png)
-->

This software can be used to harden your password by using multiple data sources to generate a strong password.
The goal and the key element of the concept is, that the user does not have to change his behaviour but still eliminate the problem of password-reuse and weak passwords.

The extension automatically extracts the URL and the password out of the webpage and generates and inserts the new password into the page.

<b>Note:</b> The provided extension is only a prototype and will only work on files (Protocol = file://)
      To use it on webpages edit the manifest.json and add http/https. 

## Installation:
1. Download the Source Code as .zip and extract it into a folder
2. Open the Google Chrome Browser
3. go to chrome://extensions/
4. Switch on Developer Mode (up right corner)
5. Click on Load unpacked extension
6. Choose folder from step 1


## Login
Needed login information: Email & Password

<table>
      <tr>
            <td><img src="https://user-images.githubusercontent.com/59063463/125648670-a8188274-1b5f-49d1-bd7a-3362613747d7.PNG"/></td>
            <td><img src="https://user-images.githubusercontent.com/59063463/125648680-ecc1abc4-a38a-41b7-a119-ed0c3708f2f2.PNG"/></td>
      </tr> 
</table>

None of the information is centrally stored and is only used to calculate a personalized value to influence your generated password. 

## Manual Generation
To manually generate a password, the UI of the extension can be used. <br>
![idle](https://user-images.githubusercontent.com/59063463/125648708-8463978c-9a66-4124-afa2-11e95bd49da7.PNG)
![example](https://user-images.githubusercontent.com/59063463/125655405-68e0df32-c0ab-4384-9cb2-a50e383bf811.PNG)











## Testing the Functionality
To test the functionality of the prototype you can use the included file "testpage.html" where you can simulate a login process where the password is switched when logging in.

![testpage](https://user-images.githubusercontent.com/59063463/125655431-7945c609-3191-457c-8fa1-7acf34bfe212.PNG)


## Generation algorithm
The implemented algorithm for password generation is based upon this specially designed concept:

![Passwort_Generierungskonzept_v3](https://github.com/user-attachments/assets/7a7bfbf0-bdd5-4835-a71c-9af4b4cc9b9f)
