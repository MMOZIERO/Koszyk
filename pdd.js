
var Produkty = [];
var index=0;
var Koszyki=[];
var razem=0;

function czysc_form(){
document.getElementById('nazwa_produktu_div1').className ="input-control";
document.getElementById("nazwa_produktu1").placeholder = "";
document.getElementById("nazwa_produktu1").style.background="none";
document.getElementById('kod_produktu_div1').className ="input-control";
document.getElementById("kod_produktu1").placeholder = "";
document.getElementById("kod_produktu1").style.background="none";
document.getElementById('cena_netto_produktu_div1').className ="input-control";
document.getElementById("cena_netto_produktu1").placeholder = "";
document.getElementById("cena_netto_produktu1").style.background="none";
document.getElementById('vat_div1').className ="input-control";
document.getElementById("vat1").placeholder = "";
document.getElementById("vat1").style.background="none";
document.getElementById('xx1').innerHTML="";
document.getElementById('ss1').innerHTML="";
}

function ukryj(){
document.getElementById('dodawanie_produktu').style.display = 'none';
document.getElementById('koszyk').style.display = 'none';
document.getElementById('wyswietlanie_produktu').style.display = 'none';
document.getElementById('edycja_produktu').style.display = 'none';
}

function wymienTresc(id){
ukryj();
document.getElementById(id).style.display = 'block';
}
    
function showDialog(id){
var dialog = $(id).data('dialog');
dialog.open();
wymienTresc('wyswietlanie_produktu');
}

function p_exist(nazwa){
if(Produkty.length==0){return 0;}else{
for(i=0;i<Produkty.length;i++){
if(Produkty[i].nazwa_produktu==nazwa){
return i;
}}return 0;}
}

function ustawCookie(nazwa, wartosc, dni) {
if (dni) {
var data = new Date();
data.setTime(data.getTime()+(dni*24*60*60*1000));           
var expires = ";expires="+data.toGMTString();
} else {var expires = "";}
document.cookie = nazwa+"=" + wartosc + expires + "; path=/";
}
 
function usunCookie(nazwa) {document.cookie = nazwa + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';}

function pokazCookie(nazwa) {
    if (document.cookie!="") { //jeżeli document.cookie w ogóle istnieje
        var cookies=document.cookie.split("; ");  //tworzymy z niego tablicę ciastek
        for (i=0; i<cookies.length; i++) { //i robimy po niej pętlę
            var nazwaCookie=cookies[i].split("=")[0]; //nazwa ciastka
            var wartoscCookie=cookies[i].split("=")[1]; //wartość ciastka
            if (nazwaCookie===nazwa) {
                return unescape(wartoscCookie) //jeżeli znaleźliśmy ciastko o danej nazwie, wtedy zwracamy jego wartość
            }
        }
        return 0;
    }else{
      return 0;
    }
}

function produkty_to_cookie() {
var string="";
var tmp=Produkty.length-1;
for(var i=0; i<Produkty.length; i++) {
var str = JSON.stringify(Produkty[i]);
if(i==tmp){
  string=string+str; 
}else{
  string=string+str+'*'; }              
}
ustawCookie('cookie_produkty', string, 365);
}

function koszyki_to_cookie() {
var string="";
var tmp=Koszyki.length-1;
for(var i=0; i<Koszyki.length; i++) {
var str = JSON.stringify(Koszyki[i]);
if(i==tmp){
  string=string+str; 
}else{
  string=string+str+'*'; }              
}
ustawCookie('cookie_koszyki', string, 365);
}

function produkty_from_cookie() {
var string=[];
var tmp=pokazCookie('cookie_produkty');
if(tmp!=0){
var res = tmp.split("*");
Produkty=[];
for(var i=0; i<res.length; i++) {
var zm=JSON.parse(res[i]);
Produkty.push(zm);            
}}}

function koszyki_from_cookie() {
var string=[];
var tmp=pokazCookie('cookie_koszyki');
if(tmp!=0){
var res = tmp.split("*");
Koszyki=[];
for(var i=0; i<res.length; i++) {
var zm=JSON.parse(res[i]);
Koszyki.push(zm);            
}}}

function czytaj_xml(){
var xmlhttp, xmlDoc;
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "pdd.xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
var tab=[];
for (var i=0;i<10;i++){
produkt={};
produkt.nazwa_produktu=xmlDoc.getElementsByTagName("NAZWA_PRODUKTU")[i].childNodes[0].nodeValue;
produkt.kod_produktu=xmlDoc.getElementsByTagName("KOD_PRODUKTU")[i].childNodes[0].nodeValue;
//alert(produkt.kod_produktu);
produkt.vat=xmlDoc.getElementsByTagName("VAT")[i].childNodes[0].nodeValue;
produkt.zdjecie=xmlDoc.getElementsByTagName("OBRAZ")[i].childNodes[0].nodeValue;
produkt.cena_netto_produktu=xmlDoc.getElementsByTagName("CENA_NETTO_PRODUKTU")[i].childNodes[0].nodeValue;
produkt.cena_brutto_produktu=xmlDoc.getElementsByTagName("CENA_BRUTTO_PRODUKTU")[i].childNodes[0].nodeValue;
var tmp=addZeroes(produkt.cena_netto_produktu*(1+((produkt.vat)/100)));
produkt.cena_brutto_produktu=parseFloat(tmp).toFixed(2);
produkt.ocena=xmlDoc.getElementsByTagName("OCENA")[i].childNodes[0].nodeValue;
produkt.kategoria=xmlDoc.getElementsByTagName("KATEGORIA")[i].childNodes[0].nodeValue;
tab=[];
for (var j=5*i;j<(5*i)+5;j++){
  var tmp=xmlDoc.getElementsByTagName("DOSTAWA")[j].childNodes[0].nodeValue;
  if(tmp!='NULL'){
tab.push(xmlDoc.getElementsByTagName("DOSTAWA")[j].childNodes[0].nodeValue); 
  }else{} 
}     
produkt.dostawa=tab;
Produkty.push(produkt);
}
usunCookie('cookie_produkty');
produkty_to_cookie();
produkty_from_cookie();
}

function wczytaj(){
//document.getElementById("wysw").value="Lista";
produkty_from_cookie();
koszyki_from_cookie();
czytaj_xml();
}



function porownajliczby(a, b) {
    return a.cena_netto_produktu - b.cena_netto_produktu;
}
function porownajstring(a, b) {
    return a.nazwa_produktu.localeCompare(b.nazwa_produktu);
}
function porownajocena(a, b) {
    return a.ocena - b.ocena;
}

function edycja(){
if(Produkty.length==0){}else{
 try {
            var table = document.getElementById('produkty_body');
            var rowCount = document.getElementById('produkty').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;;
			var Form = document.getElementById('formularz1');
      document.getElementById("formularz1").reset();
            for(var i=0; i<rowCount; i++) {
                var row = table.rows[i];
                var chkbox = row.cells[0].firstChild.firstChild;
                if(null != chkbox && true == chkbox.checked) {
				index=i;

				Form.nazwa_produktu2.value=Produkty[i].nazwa_produktu;
				Form.kod_produktu2.value=Produkty[i].kod_produktu;
				Form.cena_netto_produktu2.value=Produkty[i].cena_netto_produktu;
				Form.cena_brutto_produktu2.value=Produkty[i].cena_brutto_produktu;
				Form.vat2.value=Produkty[i].vat; 
				Form.ocena2.value=Produkty[i].ocena;
				Form.kategoria2.value=Produkty[i].kategoria;
				//alert(Produkty[i].dostawa.length);
				for (x=0; x<Produkty[i].dostawa.length; x++) {
				if(Produkty[i].dostawa[x]=="Poczta Polska"){
				//alert(Produkty[i].dostawa[x]);
				document.getElementById('Poczta Polska2').checked=true;
				}
				if(Produkty[i].dostawa[x]=="Pocztex"){
				//alert(Produkty[i].dostawa[x]);
				document.getElementById('Pocztex2').checked=true;
				}
				if(Produkty[i].dostawa[x]=="DPD"){
				//alert(Produkty[i].dostawa[x]);
				document.getElementById('DPD2').checked=true;
				}
				if(Produkty[i].dostawa[x]=="UPS"){
				//alert(Produkty[i].dostawa[x]);
				document.getElementById('UPS2').checked=true;
				}
				if(Produkty[i].dostawa[x]=="Siódemka"){
				//alert(Produkty[i].dostawa[x]);
				document.getElementById('Siódemka2').checked=true;
				}
				if(Produkty[i].dostawa[x]=="Osobiście"){
				//alert(Produkty[i].dostawa[x]);
				document.getElementById('Osobiście2').checked=true;
				}
				//alert(Produkty[i].dostawa[x]);
				//break;
                }
 //break;
 wymienTresc('edycja_produktu');
 break;
            }
			
			}
            }catch(e) {
                alert(e);
            }
           
}
}



function wyswietlprodukty(x){
if(x=="Lista" || x==undefined || x==0){
if(Produkty.length==0){}else{
var tmp0='<label>Sposób wyświetlania:&nbsp;</label><div class="input-control select"><select id="wysw" onchange="wyswietlprodukty(this.value)"><option>Lista</option><option>Obrazki</option></select></div></br>';
var tmp1='</br><button type="submit" value="Submit" class="button success" onclick="dodanie();">Dodaj produkt</button>&nbsp;<button type="submit" value="Submit" class="button warning" onclick="edycja();">Edytuj produkt</button>&nbsp;<button type="submit" value="Submit" class="button danger" onclick="deleteRow(produkty_body);wyswietlprodukty();">Usuń produkt</button><div id="przycisk_koszyk" style="float:right;"></div>'
var tmp2='<table class="table border bordered hovered " id="produkty"><thead><tr><th>X</th><th>Zdjęcie</th><th>Nazwa</th><th>Kod</th><th>Cena netto</th><th>VAT</th><th>Cena brutto</th><th>Kategoria</th><th>Ocena</th><th>Dostawa</th></tr></thead><tbody id="produkty_body"></tbody></table><label><b>Sortowanie:</b></label>&nbsp;';
var tmp3='<button type="submit" value="Submit" class="button primary" onclick="Produkty.sort(porownajliczby);wyswietlprodukty();">Cena</button>&nbsp;<button type="submit" value="Submit" class="button primary" onclick="Produkty.sort(porownajstring);wyswietlprodukty();">Nazwa</button>&nbsp;<button type="submit" value="Submit" class="button primary" onclick="Produkty.sort(porownajocena);wyswietlprodukty();">Ocena</button>&nbsp;<button type="submit" value="Submit" class="button warning" onclick="Produkty.reverse();wyswietlprodukty();">Zmień kolejność</button> ';
document.getElementById("wyswietlanie_produktu").innerHTML=tmp0+tmp1+tmp2+tmp3;
var tabelaprodukty=document.getElementById("produkty_body");
while(tabelaprodukty.rows.length>0){tabelaprodukty.deleteRow(0);}
var suma=0;
document.getElementById('przycisk_koszyk').innerHTML='<button class="button info" onclick="dodajkoszyk();">Koszyk</button>';
for(var produkt in Produkty){ 
if(suma>=Produkty.length){break;}
var row=tabelaprodukty.insertRow();
var yy=row.insertCell(0);
var xx='<label class="input-control checkbox"  style=""><input type="checkbox" name="tn"><span class="check"></span></label>';
yy.innerHTML=xx;
yy=row.insertCell(1);
xx='<img src="'+Produkty[produkt].zdjecie+'" height="42" width="42" data-role="fitImage" data-format="square">';
yy.innerHTML=xx;
var nazwa_produktu=row.insertCell(2);
var kod_produktu=row.insertCell(3);
var cena_netto_produktu=row.insertCell(4);
var vat=row.insertCell(5);
var cena_brutto_produktu=row.insertCell(6);
var kategoria=row.insertCell(7);
var ocena=row.insertCell(8);
var dostawa=row.insertCell(9);
nazwa_produktu.innerHTML = Produkty[produkt].nazwa_produktu;
kod_produktu.innerHTML = Produkty[produkt].kod_produktu;
cena_netto_produktu.innerHTML = Produkty[produkt].cena_netto_produktu+'&nbsp;zł';
cena_brutto_produktu.innerHTML = Produkty[produkt].cena_brutto_produktu+'&nbsp;zł';
vat.innerHTML = Produkty[produkt].vat+'&nbsp;%';
kategoria.innerHTML = Produkty[produkt].kategoria;
var tmp='<div class="rating" data-role="rating" data-show-score="false" data-value="';
var tmp1='" data-color-rate="true" data-static="true"></div>';
ocena.innerHTML = tmp+Produkty[produkt].ocena+tmp1;
var tt=0;
var dostawa1="";
for (x=0; x<Produkty[produkt].dostawa.length; x++) {
if(tt==0){dostawa1='-&nbsp;' +Produkty[produkt].dostawa[x];tt=1;}else{
dostawa1=dostawa1+ '</br> -&nbsp;' + Produkty[produkt].dostawa[x];
tt=1;}}
dostawa.innerHTML = dostawa1;
suma++;}}}
if(x=="Obrazki" || x==1){
var tmp0='<label>Sposób wyświetlania:&nbsp;</label><div class="input-control select"><select id="wysw" onchange="wyswietlprodukty(this.value)" ><option>Obrazki</option><option>Lista</option></select></div></br>';
var tmp1='<table class="table" id="plista"><tbody id="plista_body"></tbody></table>';
document.getElementById("wyswietlanie_produktu").innerHTML=tmp0+tmp1;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var tabelaprodukty=document.getElementById("plista_body");
while(tabelaprodukty.rows.length>0){tabelaprodukty.deleteRow(0);}
var suma=0;
var row=0;
var tmp=0;
for(var produkt in Produkty){ 
if(suma>=Produkty.length){break;}
if(suma%4==0){row=tabelaprodukty.insertRow();tmp=0;}
var zm='<div class="cell"><div class="image-container"><div class="frame"><img src="'+Produkty[produkt].zdjecie+'" ></div><div class="image-overlay op-green"><h2>'+Produkty[produkt].nazwa_produktu+'</h2><p>Cena: '+Produkty[produkt].cena_brutto_produktu+' zł</p></div></div></div>';
var uu=row.insertCell(tmp);
uu.innerHTML=zm;
tmp++;
suma++;}
var pdiv=document.getElementById("wyswietlanie_produktu");
var bt='Sortowanie: <button type="submit" value="Submit" class="button primary" onclick="Produkty.sort(porownajliczby);wyswietlprodukty(1)">Cena</button>&nbsp;<button type="submit" value="Submit" class="button primary" onclick="Produkty.sort(porownajstring);wyswietlprodukty(1);">Nazwa</button>&nbsp;<button type="submit" value="Submit" class="button primary" onclick="Produkty.sort(porownajocena);wyswietlprodukty(1);">Ocena</button>&nbsp;<button type="submit" value="Submit" class="button warning" onclick="Produkty.reverse();wyswietlprodukty(1);">Zmień kolejność</button>&nbsp;|&nbsp;<button class="button info" onclick="pokazkoszyk();">Koszyk</button>';
var tpdiv=pdiv.innerHTML;
pdiv.innerHTML=tpdiv+bt;
}}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function deleteRow(){
try {var table = document.getElementById('produkty_body');
var rowCount = document.getElementById('produkty').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;
for(var i=0; i<rowCount; i++){
var row = table.rows[i];
var chkbox = row.cells[0].firstChild.firstChild;
if(null != chkbox && true == chkbox.checked){
table.deleteRow(i);
Produkty.splice(i,1);
rowCount--;i--;}}}catch(e){alert(e);}
usunCookie('cookie_produkty');
produkty_to_cookie();
produkty_from_cookie();
wyswietlprodukty();}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dodajprodukt(nazwa_produktu,kod_produktu,cena_netto_produktu,vat,cena_brutto_produktu,kategoria,ocena,dostawa,baza){
var produkt = {};
produkt.nazwa_produktu=nazwa_produktu;
produkt.kod_produktu=kod_produktu;
produkt.cena_netto_produktu=cena_netto_produktu;
produkt.vat=vat;
produkt.cena_brutto_produktu=cena_brutto_produktu;
produkt.kategoria=kategoria;
produkt.ocena=ocena;
produkt.dostawa=dostawa; 
produkt.zdjecie="obrazy/samochod.png";
produkt.baza=baza;      
Produkty.push(produkt);
usunCookie('cookie_produkty');
produkty_to_cookie();
produkty_from_cookie();}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

function empty(mixed_var) {var undef, key, i, len;var emptyValues = [undef, null, false, 0, '', '0'];
for (i = 0, len = emptyValues.length; i < len; i++) {
if (mixed_var === emptyValues[i]) {return true;}}
if (typeof mixed_var === 'object') {
for (key in mixed_var){return false;}return true;}return false;}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function testinput(re, str){if(re.test(str)){return true;} else {return false;}}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addZeroes( value ) {
    var new_value = value*1; 
    new_value = new_value+''; 

    pos = new_value.indexOf('.');
    if (pos==-1) new_value = new_value + '.00';
    else {
        var integer = new_value.substring(0,pos);
        var decimals = new_value.substring(pos+1);
        while(decimals.length<2) decimals=decimals+'0';
        new_value = integer+'.'+decimals;
    }
    return new_value;
}

function dodanie(){
document.getElementById("formularz").reset();
czysc_form();
wymienTresc('dodawanie_produktu');
}

function walidacjaformularza(Form,zmienna)
{
  var warunek=0;
  var reg_nazwa_produktu=/^[a-zęółśążźćń ]+$/i;
  var reg_kod_produktu=/^\S{2}-\S{2}$/;
  var reg_cena_netto_produktu=/^[0-9]{1,9}(\.|,)[0-9]{2}$/;
  var reg_vat=/^[1-9]([0-9]*)$/;

  if(zmienna==1){
  
    if(empty(Form.nazwa_produktu1.value)){
      document.getElementById('nazwa_produktu_div1').className ="input-control text error";
      document.getElementById("nazwa_produktu1").placeholder = "Nie podano nazwy produktu!";
      document.getElementById("nazwa_produktu1").style.background="#e74c3c";
    }else{
      if(testinput(reg_nazwa_produktu,Form.nazwa_produktu1.value)){
        if(Form.nazwa_produktu1.value.length>10||Form.nazwa_produktu1.value.length<3){
          Form.nazwa_produktu1.value="";
          document.getElementById('nazwa_produktu_div1').className ="input-control text error";
          document.getElementById("nazwa_produktu1").placeholder = "Nazwa produktu jest za długa lub za krótka!";
          document.getElementById("nazwa_produktu1").style.background="#f1c40f";
        }else{
          if(p_exist(Form.nazwa_produktu1.value)==1){
            Form.nazwa_produktu1.value="";
document.getElementById('nazwa_produktu_div1').className ="input-control text error";
      document.getElementById("nazwa_produktu1").placeholder = "Produkt już jest na liscie!";
      document.getElementById("nazwa_produktu1").style.background="#e74c3c";
          }else{
          document.getElementById('nazwa_produktu_div1').className ="input-control";
          document.getElementById("nazwa_produktu1").placeholder = "";
          document.getElementById("nazwa_produktu1").style.background="none";
          warunek++; 
          }
            } 
      }else{
        Form.nazwa_produktu1.value="";
        document.getElementById('nazwa_produktu_div1').className ="input-control text error";
      document.getElementById("nazwa_produktu1").placeholder = "Nazwa produktu nie moze być liczbą!";
      document.getElementById("nazwa_produktu1").style.background="#f1c40f";
 
      }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(empty(Form.kod_produktu1.value)){
      document.getElementById('kod_produktu_div1').className ="input-control text error";
      document.getElementById("kod_produktu1").placeholder = "Nie podano kodu produktu!";
           document.getElementById("kod_produktu1").style.background="#e74c3c";
 
    }else{
      if(testinput(reg_kod_produktu,Form.kod_produktu1.value)){
          document.getElementById('kod_produktu_div1').className ="input-control";
          document.getElementById("kod_produktu1").style.background="none";
          warunek++;
      }else{
        Form.kod_produktu1.value="";
      document.getElementById('kod_produktu_div1').className ="input-control text error";
      document.getElementById("kod_produktu1").placeholder = "Kod produktu musi być formatu XX-XX!";
      document.getElementById("kod_produktu1").style.background="#f1c40f";
    
      }
    }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var x=0;
  var y=0;
  if(empty(Form.cena_netto_produktu1.value)){
      document.getElementById('cena_netto_produktu_div1').className ="input-control text error";
      document.getElementById("cena_netto_produktu1").placeholder = "Nie podano ceny netto produktu!";
      document.getElementById("cena_netto_produktu1").style.background="#e74c3c";
     
    }else{
      Form.cena_netto_produktu1.value=addZeroes(Form.cena_netto_produktu1.value);
      if(testinput(reg_cena_netto_produktu,Form.cena_netto_produktu1.value)){
          document.getElementById('cena_netto_produktu_div1').className ="input-control";
          document.getElementById("cena_netto_produktu1").style.background="none";
          x=1;
          warunek++;
      }else{
      Form.cena_netto_produktu1.value="";
      document.getElementById('cena_netto_produktu_div1').className ="input-control text error";
      document.getElementById("cena_netto_produktu1").placeholder = "Cena netto musi być liczbą!";
      document.getElementById("cena_netto_produktu1").style.background="#f1c40f";
    
      }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if(empty(Form.vat1.value)){
      document.getElementById('vat_div1').className ="input-control text error";
      document.getElementById("vat1").placeholder = "Nie podano stawki podatku VAT!";
      document.getElementById("vat1").style.background="#e74c3c";
     
    }else{
      //alert("1");
      if(testinput(reg_vat,Form.vat1.value)){
        //alert("2");
          document.getElementById('vat_div1').className ="input-control";
          document.getElementById("vat1").style.background="none";
          if(x==1){
            var tmp=addZeroes(Form.cena_netto_produktu1.value*(1+((Form.vat1.value)/100)));
            Form.cena_brutto_produktu1.value=parseFloat(tmp).toFixed(2);}
           // alert("3");
          warunek++;
      }else{
      Form.vat1.value="";
      document.getElementById('vat_div1').className ="input-control text error";
      document.getElementById("vat1").placeholder = "Stawka podatku VAT netto musi być liczbą!";
      document.getElementById("vat1").style.background="#f1c40f";
      // alert("4");
      }
    }

    var dostawa=[];
	var ocena=0;
    var checkboxy = Form.opcja_dostawy1;
    var radiony = Form.ocena1;
    var counter=0;
    var tt=0;
    for (x=0; x<checkboxy.length; x++) {
        if (checkboxy[x].checked) {
          dostawa.push(checkboxy[x].value);
		  counter++;
          }
           // counter++;
    }
    if(counter>=3){
    document.getElementById('ss1').innerHTML="";
      warunek++;}else{
    document.getElementById('ss1').style.color="red";
    document.getElementById('ss1').innerHTML="Wybierz minimum 3 opcje dostawy!";
    }

    var ktory = -1;
    
    for (x=0; x<radiony.length; x++) {
    if (radiony[x].checked) {
        ktory = x; 
     //alert(ktory);
        break;
    }
    }
    if (ktory == -1) {
    document.getElementById('xx1').style.color="red";
    document.getElementById('xx1').innerHTML="Wybierz ocenę produktu!";
    }else{
    document.getElementById('xx1').innerHTML="";
    ocena=ktory;
    warunek++;
    }

}
if (zmienna==2){

if(empty(Form.nazwa_produktu2.value)){
      document.getElementById('nazwa_produktu_div2').className ="input-control text error";
      document.getElementById("nazwa_produktu2").placeholder = "Nie podano nazwy produktu!";
      document.getElementById("nazwa_produktu2").style.background="#e74c3c";
    }else{
      if(testinput(reg_nazwa_produktu,Form.nazwa_produktu2.value)){
        if(Form.nazwa_produktu2.value.length>10||Form.nazwa_produktu2.value.length<3){
          Form.nazwa_produktu2.value="";
          document.getElementById('nazwa_produktu_div2').className ="input-control text error";
          document.getElementById("nazwa_produktu2").placeholder = "Nazwa produktu jest za długa lub za krótka!";
          document.getElementById("nazwa_produktu2").style.background="#f1c40f";
        }else{
          document.getElementById('nazwa_produktu_div2').className ="input-control";
          document.getElementById("nazwa_produktu2").style.background="none";
          warunek++;
            } 
      }else{
        Form.nazwa_produktu2.value="";
        document.getElementById('nazwa_produktu_div2').className ="input-control text error";
      document.getElementById("nazwa_produktu2").placeholder = "Nazwa produktu nie moze być liczbą!";
      document.getElementById("nazwa_produktu2").style.background="#f1c40f";
 
      }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(empty(Form.kod_produktu2.value)){
      document.getElementById('kod_produktu_div2').className ="input-control text error";
      document.getElementById("kod_produktu2").placeholder = "Nie podano kodu produktu!";
           document.getElementById("kod_produktu2").style.background="#e74c3c";
 
    }else{
      if(testinput(reg_kod_produktu,Form.kod_produktu2.value)){
          document.getElementById('kod_produktu_div2').className ="input-control";
          document.getElementById("kod_produktu2").style.background="none";
          warunek++;
      }else{
        Form.kod_produktu.value="";
      document.getElementById('kod_produktu_div2').className ="input-control text error";
      document.getElementById("kod_produktu2").placeholder = "Kod produktu musi być formatu XX-XX!";
      document.getElementById("kod_produktu2").style.background="#f1c40f";
    
      }
    }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var x=0;
  var y=0;
  if(empty(Form.cena_netto_produktu2.value)){
      document.getElementById('cena_netto_produktu_div2').className ="input-control text error";
      document.getElementById("cena_netto_produktu2").placeholder = "Nie podano ceny netto produktu!";
      document.getElementById("cena_netto_produktu2").style.background="#e74c3c";
     
    }else{
      Form.cena_netto_produktu2.value=addZeroes(Form.cena_netto_produktu2.value);
      if(testinput(reg_cena_netto_produktu,Form.cena_netto_produktu2.value)){
          document.getElementById('cena_netto_produktu_div2').className ="input-control";
          document.getElementById("cena_netto_produktu2").style.background="none";
          x=1;
          warunek++;
      }else{
      Form.cena_netto_produktu2.value="";
      document.getElementById('cena_netto_produktu_div2').className ="input-control text error";
      document.getElementById("cena_netto_produktu2").placeholder = "Cena netto musi być liczbą!";
      document.getElementById("cena_netto_produktu2").style.background="#f1c40f";
    
      }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if(empty(Form.vat2.value)){
      document.getElementById('vat_div2').className ="input-control text error";
      document.getElementById("vat2").placeholder = "Nie podano stawki podatku VAT!";
      document.getElementById("vat2").style.background="#e74c3c";
     
    }else{
      //alert("1");
      if(testinput(reg_vat,Form.vat2.value)){
        //alert("2");
          document.getElementById('vat_div2').className ="input-control";
          document.getElementById("vat2").style.background="none";
          if(x==1){
            var tmp=addZeroes(Form.cena_netto_produktu2.value*(1+((Form.vat2.value)/100)));
            Form.cena_brutto_produktu2.value=parseFloat(tmp).toFixed(2);}
           // alert("3");
          warunek++;
      }else{
      Form.vat2.value="";
      document.getElementById('vat_div2').className ="input-control text error";
      document.getElementById("vat2").placeholder = "Stawka podatku VAT netto musi być liczbą!";
      document.getElementById("vat2").style.background="#f1c40f";
      // alert("4");
      }
    }

    var dostawa=[];
    var ocena=0;
    var checkboxy = Form.opcja_dostawy2;
    var radiony = Form.ocena2;
    var counter=0;
    var tt=0;
    for (x=0; x<checkboxy.length; x++) {
        if (checkboxy[x].checked) {
          dostawa.push(checkboxy[x].value);
      counter++;
          }
           // counter++;
    }
    if(counter>=3){
    document.getElementById('ss2').innerHTML="";
      warunek++;}else{
    document.getElementById('ss2').style.color="red";
    document.getElementById('ss2').innerHTML="Wybierz minimum 3 opcje dostawy!";
    }

    var ktory = -1;
    
    for (x=0; x<radiony.length; x++) {
    if (radiony[x].checked) {
        ktory = x; 
     //alert(ktory);
        break;
    }
    }
    if (ktory == -1) {
    document.getElementById('xx2').style.color="red";
    document.getElementById('xx2').innerHTML="Wybierz ocenę produktu!";
    }else{
    document.getElementById('xx2').innerHTML="";
    ocena=ktory;
    warunek++;
    }



}

if(zmienna==1){
if(warunek!=6){return false;}
else{
var baza=0;
dodajprodukt(Form.nazwa_produktu1.value,Form.kod_produktu1.value,Form.cena_netto_produktu1.value,Form.vat1.value,Form.cena_brutto_produktu1.value,Form.kategoria1.value,ocena,dostawa,baza);
var ind=p_exist(Form.nazwa_produktu1.value);
var str = JSON.stringify(Produkty[ind]);
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
Produkty[ind].baza=xmlhttp.responseText;
alert(Produkty[ind].baza);
}};
xmlhttp.open("GET","dodaj_baza.php?p="+str,true);
xmlhttp.send();


return true;}
}
 if(zmienna=2){
 if(warunek!=6){return false;}
else{
Produkty[index].nazwa_produktu=Form.nazwa_produktu2.value;
Produkty[index].kod_produktu=Form.kod_produktu2.value;
Produkty[index].cena_netto_produktu=Form.cena_netto_produktu2.value;
Produkty[index].vat=Form.vat2.value;
Produkty[index].ocena=Form.ocena2.value;
Produkty[index].kategoria=Form.kategoria2.value;
Produkty[index].cena_brutto_produktu=Form.cena_brutto_produktu2.value;
Produkty[index].dostawa=dostawa;
usunCookie('cookie_produkty');
produkty_to_cookie();
produkty_from_cookie();
return true;}
 }
}

function sukces(Form,zmienna){
if(zmienna==1){
$.Notify({
    caption: 'Sukces!',
    content: 'Produkt został dodany poprawnie.',
    type: 'success'
    });
}
if(zmienna==2){
$.Notify({
    caption: 'Sukces!',
    content: 'Produkt został zmieniony poprawnie.',
    type: 'success'
    });
}
    wymienTresc('wyswietlanie_produktu');
    wyswietlprodukty();
}

function zakup(Form){
var cena_koncowa=0; 
var table = document.getElementById('koszyk_body');
var rowCount = document.getElementById('koszyk').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;;
for(var i=0; i<rowCount; i++) {
var row = table.rows[i];
var ilosc = row.cells[3].firstChild.firstChild;
for (x=0; x<Koszyki[i].cena_dostawa.length; x++) {
//if (row.cells[4].children[x].checked) {
//alert(row.cells[4].children[x].value);
//}}

//var radiony = Form.nazwa;
//var dost=
 //alert(row.cells[4].children[x].value);
//cena_koncowa=cena_koncowa+ilosc.value*Koszyki[i].cena;
}
var nazwa='kdostawa'+i;
var tmp=document.getElementById(nazwa);
alert(Form.tmp);
alert(cena_koncowa);

//showDialog('#koszykdialog');
//document.getElementById('koszykdialog').innerHTML='<h1>Gratulacje!</h1></br> Dokonałeś/aś zakup za:&nbsp;'+cena_koncowa+'&nbsp;zł';
}}

function pokazkoszyk(){
  wymienTresc('koszyk');
  if(Koszyki.length==0){
document.getElementById('koszyk').innerHTML = '<h1>Koszyk</h1><div id="ekoszyk">Nie wybrano produktów do koszyka!</div>';
}else{

document.getElementById('koszyk').innerHTML = '<h1>Koszyk</h1><div id="ekoszyk"></div><form id="form_koszyk" action="javascript:zakup(this);"><table class="table border bordered hovered " id="koszyk" ><thead><tr><th>X</th><th>Nazwa</th><th>Cena</th><th>Ilość</th><th>Dostawa</th></tr></thead><tbody id="koszyk_body"></tbody></table><button type="submit" value="Submit" class="button success" >Kup</button></form>';
var tabelakoszyk=document.getElementById("koszyk_body");

while(tabelakoszyk.rows.length>0) {
tabelakoszyk.deleteRow(0);}

var suma=0;

for(var koszyczek in Koszyki){
            //add new row      
            if(suma>=Koszyki.length){break;}
            var row=tabelakoszyk.insertRow();
            var yy=row.insertCell(0);
            yy.innerHTML='TT';
            var nazwa_produktu=row.insertCell(1);
            var cena_produktu=row.insertCell(2);
            yy=row.insertCell(3);
            var tmp1='<input type="number" min="1" name="ilosc" id="ilosc>';
            tmp1='<div class="slider" data-on-change="dropValueToInput" data-role="slider" data-show-hint="true" data-permanent-hint="true" data-max-value="50" data-min-value="1"name="ilosc" id="ilosc';
            var tmp2=suma;
            var tmp3='"></div>';
            xx=tmp1+tmp2+tmp3;
            yy.innerHTML=xx;
            //document.getElementById("ilosc").defaultValue = 1;
            nazwa_produktu.innerHTML = Koszyki[koszyczek].nazwa;
            cena_produktu.innerHTML = Koszyki[koszyczek].cena+'&nbsp;zł';
            razem=razem+parseFloat(Koszyki[koszyczek].cena);
            var op_dost=row.insertCell(4);
            var tt=0;
            var cena=0;
            var uu='dostawa_koszyk'+suma;
            uu=uu+suma;
           // var hh='<label class="input-control checkbox"  style=""><input type="checkbox" name="'+uu+'"><span class="check"></span></label>';
            //var hh1='<label class="input-control checkbox"  style=""><input type="checkbox" name="'+uu+'" checked><span class="check"></span></label>';
            var kk='<label class="input-control radio"><input type="radio"><span class="check"></span><span class="caption">Radio</span></label>';
			var kk1='<label class="input-control radio"><input type="radio"><span class="check"></span><span class="caption">Radio</span></label>';

		   // var kk1='<label class="input-control radio"><input type="radio"><span class="check"></span><span class="caption">Radio</span></label>';

			for (x=0; x<Koszyki[koszyczek].dostawa.length; x++) {
            if(Koszyki[koszyczek].cena_dostawa[x]==undefined){
            cena=(Math.random() * 50) + 1;
            ceaa=cena.toFixed(2);
            Koszyki[koszyczek].cena_dostawa[x]=cena;
            }else{
            cena=Koszyki[koszyczek].cena_dostawa[x];
            }
			  kk='<label class="input-control radio" id="kdostawa' +suma+'"><input type="radio" value="' + Koszyki[koszyczek].dostawa[x]+'" name="kdostawa' +suma+'" ><span class="check"></span><span class="caption">&nbsp;' + Koszyki[koszyczek].dostawa[x]+'</span></label>';
			  kk1='<label class="input-control radio" id="kdostawa' +suma+'"><input type="radio" value="' + Koszyki[koszyczek].dostawa[x]+'" name="kdostawa' +suma+'" checked><span class="check"></span><span class="caption">&nbsp;' + Koszyki[koszyczek].dostawa[x]+'</span></label>';
             // Koszyki[koszyczek].cena_dostawa.push(cena);
            if(tt==0){
              if(Koszyki[koszyczek].dostawa[x]=="Poczta Polska"){
			  kk1='<label class="input-control radio" id="kdostawa"><input type="radio" value="' + Koszyki[koszyczek].dostawa[x]+'" name="kdostawa' +suma+'" checked><span class="check"></span><span class="caption">&nbsp;' + Koszyki[koszyczek].dostawa[x]+'</span></label>';
               // hh1='<label class="input-control checkbox"  style=""><input type="checkbox" name="'+uu+'" value="'+cena+'" checked><span class="check"></span></label>';
                dostawa1=kk1 +'&nbsp;-&nbsp;<b>Cena:</b>&nbsp;'+cena.toFixed(2)+'&nbsp;zł';
              }else{
			  kk='<label class="input-control radio" id="kdostawa"><input type="radio" value="' + Koszyki[koszyczek].dostawa[x]+'" name="kdostawa' +suma+'" checked><span class="check"></span><span class="caption">&nbsp;' + Koszyki[koszyczek].dostawa[x]+'</span></label>';
               // hh1='<label class="input-control checkbox"  style=""><input type="checkbox" name="'+uu+'" value="'+cena+'"><span class="check"></span></label>';
                dostawa1=kk +'&nbsp;-&nbsp;<b>Cena:</b>&nbsp;'+cena.toFixed(2)+'&nbsp;zł';
              }
            tt=1;
            }else{
            dostawa1=dostawa1+ '</br>'+kk +'&nbsp;-&nbsp;<b>Cena:</b>&nbsp;'+cena.toFixed(2)+'&nbsp;zł';
            tt=1;
          }
    }
            
      op_dost.innerHTML = dostawa1;
            suma++;
        }
        //razem=razem.toFixed(2);
}


}

function dodajkoszyk(){
var table = document.getElementById('produkty_body');
var rowCount = document.getElementById('produkty').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length;;
var koszyczek = {};
for(var i=0; i<rowCount; i++) {
var row = table.rows[i];
var chkbox = row.cells[0].firstChild.firstChild;
if(null != chkbox && true == chkbox.checked){
koszyczek = {};  
koszyczek.nazwa=Produkty[i].nazwa_produktu;
koszyczek.cena=Produkty[i].cena_brutto_produktu;
koszyczek.dostawa=Produkty[i].dostawa;
var tab=[];
koszyczek.cena_dostawa=tab;
koszyczek.cena_dostawa=tab;
koszyczek.ilosc=1;
Koszyki.push(koszyczek);
}}

if(Koszyki.length!=0){
usunCookie('cookie_koszyki');
koszyki_to_cookie();
koszyki_from_cookie();
}

pokazkoszyk();


}


