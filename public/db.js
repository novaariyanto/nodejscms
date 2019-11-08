
let db;
let dbReq = indexedDB.open('myDatabase',2);

dbReq.onupgradeneeded = function(event){
   // Set the db variable to our database so we can use it!  
  db = event.target.result;
  // Create an object store named notes. Object stores
  // in databases are where data are stored.
  let notes = db.createObjectStore('notes', {autoIncrement: true});
  let users = db.createObjectStore('user',{autoIncrement:true});
}

dbReq.onsuccess = function(event){
    db = event.target.result;
    // getAndDisplayNotes(db);
    // updateResult();
    // getwhere();
    // addstickynote(db,'slotsh are awesome !');
}
function submitNote() {
    let message = document.getElementById('newmessage');
    addstickynote(db, message.value);
    message.value = '';
  }

dbReq.onerror = function(event){
    alert('error opening database'+ event.target.errorCode);
}

function addstickynote(db,message){
    let tx = db.transaction(['notes'],'readwrite');
    let store = tx.objectStore('notes');

    let note = {text:message,timstamp:Date.now(),authtoken:'token'};
    store.add(note);

    tx.oncomplete = function(){
        console.log('stored note !');
    }
    tx.onerror = function(event){
        alert('error storing note :'+ event.target.errorCode);
    }
}
function savelogin(data){
    // cek data from indexedDB
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    var countuser = objectStore.count();
    countuser.onsuccess =function(){
        console.log(countuser.result);
        if(countuser.result === 0){
            console.log('tambah');
            let tx = db.transaction(['user'],'readwrite');
            let user = tx.objectStore('user');
            user.add(data)
            tx.oncomplete = function(){
                console.log('stored user !');
            }
            tx.onerror = function(event){
                alert('error storing user :'+ event.target.errorCode);
            }
        }else{
            console.log('update');
            objectStore.openCursor()
            .onsuccess = function(event) {
              const cursor = event.target.result;
              if (cursor) {
                if (cursor.value.message === 'Login berhasil') {
                  const updateData = cursor.value;
                  updateData.data = data.data;
                  const request = cursor.update(updateData);
                  request.onsuccess = function() {
                    console.log('A better album year?');
                  };
            
                }
                cursor.continue();        
              } else {
                console.log('Entries displayed.');         
              }
            }
        }
    }
 
 
}



  function getAndDisplayNotes(db){
        let tx = db.transaction(['notes'], 'readonly');
        let store = tx.objectStore('notes');
        
        let req = store.openCursor();
        let allNotes = [];

      req.onsuccess = function(event){
          let cursor = event.target.result;
          if(cursor != null){
              allNotes.push(cursor.value);
              cursor.continue();
          }else{
              displayNotes(allNotes);
          }
      }
      req.onerror = function(event){
          alert('error in cursor '+ event.target.errorCode);
      }
  }
  function displayNotes(notes) {
    let listHTML = '<ul>';

    for (let i = 0; i < notes.length; i++) {
      let note = notes[i];
      listHTML += '<li>' + note.text + ' ' + 
        new Date(note.timestamp).toString() + '</li>';
    }
    document.getElementById('notes').innerHTML = listHTML;
  }

  function updateResult() {
  
    const transaction = db.transaction(['notes'], 'readwrite');
    const objectStore = transaction.objectStore('notes');
  
    objectStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.authtoken === 'token') {
          const updateData = cursor.value;
            
          updateData.text = 'sekolah100%';
          const request = cursor.update(updateData);
          request.onsuccess = function() {
            console.log('A better album year?');
          };
        };

        cursor.continue();        
      } else {
        console.log('Entries displayed.');         
      }
    };
  };
  function updateLogin(data){
        const transaction = db.transaction(['user'], 'readwrite');
        const objectStore = transaction.objectStore('user');
      
        objectStore.openCursor()
        .onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.message === 'Login berhasil') {
              const updateData = cursor.value;
              updateData.data = data.data;
              const request = cursor.update(updateData);
              request.onsuccess = function() {
                console.log('A better album year?');
              };
        
            }
            cursor.continue();        
          } else {
            
            console.log('Entries displayed.');         
          }
        }
  }
  function getwhere(){
    const transaction = db.transaction(['notes'], 'readwrite');
    const objectStore = transaction.objectStore('notes');
  
    objectStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.authtoken === 'token') {
            console.log(cursor.value.text);
        }
        cursor.continue();
      }else{
          console.log("selesai mencari");
      }
    }
  }

  function deleten(){
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    
    objectStore.openCursor().onsuccess = function(event){
        var cursor =event.target.result;
        if(cursor){
            if(cursor.value.message === "Login berhasil"){
                var request = cursor.delete();
                request.onsuccess = function(){
                    alert("logout sukses");
                }
            }
        }
    }
  }
  function ceklogin(){
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    var countuser = objectStore.count();
    countuser.onsuccess =function(){
        var login = countuser.result;
        if(login < 1){
            console.log("belum login : ");
        }else{
            var baseurl = window.location.protocol+"//"+window.location.hostname+":"+location.port;
            window.location.href = baseurl;
        }
    }
  }
  function cekloginn(){
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    var countuser = objectStore.count();
    countuser.onsuccess =function(){
        var login = countuser.result;
        if(login < 1){
            console.log("belum login");
            var baseurl = window.location.protocol+"//"+window.location.hostname+":"+location.port;
            window.location.href = baseurl+"/login.html";
        }else{
            console.log('sudah login');
        }
    }
  }
  function ambildb(){
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    
    objectStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        if (cursor.value.status === 'sukses') {
            result = cursor.value.message;
            console.log("data : "+cursor.value.message);
            var url = "http://onlines.rsud.patikab.go.id:8080/android/service/pasien_rajal/list_pasien_rajal.php?id_dokter=813&tanggal=2019-10-22";
            $.ajax({
              type: "GET",
              url: url,
              success: function(res){
                  M.toast({html: res.message})
                  $('.progress').hide();
              },
              error:function(err){
                  $('.progress').hide();
              }
              });
        }
        cursor.continue();
      }else{
          console.log("selesai mencari");
      }
    }
 

  }
  
 