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
  var request = indexedDB.open("myDatabase",2);
  request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
  };
  request.onsuccess = function(event) {
  db = event.target.result;
  const transaction = db.transaction(['user'], 'readwrite');
  const objectStore = transaction.objectStore('user');
  var countuser = objectStore.count();
  countuser.onsuccess =function(){
      var login = countuser.result;
      if(login < 1){
          console.log("belum login");
          var baseurl = window.location.protocol+"//"+window.location.hostname+":"+location.port;
          window.location.href = baseurl+"/login";
      }else{
          console.log('sudah login');
      }
  }

  
}
}
function ambildatauser(){
    $('.progress').show();
    var request = indexedDB.open("myDatabase",2);
    request.onerror = function(event) {
    console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
    db = event.target.result;
    console.log("sukses open");
     const transaction = db.transaction(['user'], 'readwrite');
        const objectStore = transaction.objectStore('user');
        
        objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === 'sukses') {
                result = cursor.value.data;
                console.log("data : "+cursor.value.data);
                $.each(result,function(i,item){
                   
                    var lis = '<div class="card"> <div class="card-content" style="padding: 10px;"><span>'+item.nm_dokter+'</span><br><span>Username : '+item.username+'</span><br><span>Email : '+item.email+'</span></div></div>'
                    $('#listcontent').append(lis);
                })
            }
            cursor.continue();
        }else{
            console.log("selesai mencari");
            $('.progress').hide();
        }
        }
    };
  
  }
function ambillistpasienranapall(){
    $('.progress').show();
    var request = indexedDB.open("myDatabase",2);
    request.onerror = function(event) {
    console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
    db = event.target.result;
    console.log("sukses open");
     const transaction = db.transaction(['user'], 'readwrite');
        const objectStore = transaction.objectStore('user');
        
        objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === 'sukses') {
                result = cursor.value.message;
                console.log("data : "+cursor.value.message);
                var kddokter = cursor.value.data[0].kd_dokter;
                $('#doktere').html(cursor.value.data[0].nm_dokter);
                var url = "/dataranapall";
                $.ajax({
                type: "GET",
                url: url,
                success: function(res){
                    // alert(res.message);
                    var result = res.data_ranap;  
                    var jumlah = res.jumlah;
                    console.log("cari dataranap");
                    $.each(result,function(i,item){
                        var lis = '<div class="card"><div class="card-content" style="padding: 10px;"><span>'+item.dokter+'</span><br><span style="font-weight: bold;">'+item.jumlah+'</span></div></div>'
                        $('#listcontent').append(lis);
                    })
                    $('.jumlah').html("Jumlah Pasien : "+jumlah);
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
    };
  
  }
function ambillistpasienrajalall(tanggal){
    $('.progress').show();
    var request = indexedDB.open("myDatabase",2);
    request.onerror = function(event) {
    console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
    db = event.target.result;
    console.log("sukses open");
     const transaction = db.transaction(['user'], 'readwrite');
        const objectStore = transaction.objectStore('user');
        
        objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.status === 'sukses') {
                result = cursor.value.message;
                console.log("data : "+cursor.value.message);
                var kddokter = cursor.value.data[0].kd_dokter;
                $('#doktere').html(cursor.value.data[0].nm_dokter);
                var url = "/rajalall/"+tanggal;
                $.ajax({
                type: "GET",
                url: url,
                success: function(res){
                    // alert(res.message);
                    var result = res.data_rajal;  
                    var jumlah = res.jumlah;
                    $.each(result,function(i,item){
                        var lis = '<div class="card"><div class="card-content" style="padding: 10px;"><span>'+item.dokter+'</span><br><span style="font-weight: bold;">'+item.jumlah+'</span></div></div>'
                        $('#listcontent').append(lis);
                    })
                    $('.jumlah').html("Jumlah Pasien : "+jumlah);
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
    };
  
  }

function ambillistpasienrajal(tanggal){

  $('.progress').show();
  var request = indexedDB.open("myDatabase",2);
  request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
  };
  request.onsuccess = function(event) {
  db = event.target.result;
  console.log("sukses open");
   const transaction = db.transaction(['user'], 'readwrite');
      const objectStore = transaction.objectStore('user');
      
      objectStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
          if (cursor.value.status === 'sukses') {
              result = cursor.value.message;
              console.log("data : "+cursor.value.message);
              var kddokter = cursor.value.data[0].kd_dokter;
              $('#doktere').html(cursor.value.data[0].nm_dokter);
              var url = "/rajal/"+kddokter+"/"+tanggal;
              $.ajax({
              type: "GET",
              url: url,
              success: function(res){
                  // alert(res.message);
                  var result = res.data;  
                  var jumlah = res.jumlah;
                  $.each(result,function(i,item){
                      var lis = '<div class="card"><div class="card-content" style="padding: 10px;"><span>'+item.NAMA+'</span><br><span style="font-weight: bold;">'+item.NOMR+'</span></div></div>'
                      $('#listcontent').append(lis);
                  })
                  $('.jumlah').html("Jumlah Pasien : "+jumlah);
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
  };

}
function ambillistpasienrajal(tanggal){

  $('.progress').show();
  var request = indexedDB.open("myDatabase",2);
  request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
  };
  request.onsuccess = function(event) {
  db = event.target.result;
  console.log("sukses open");
   const transaction = db.transaction(['user'], 'readwrite');
      const objectStore = transaction.objectStore('user');
      
      objectStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
          if (cursor.value.status === 'sukses') {
              result = cursor.value.message;
              console.log("data : "+cursor.value.message);
              var kddokter = cursor.value.data[0].kd_dokter;
              $('#doktere').html(cursor.value.data[0].nm_dokter);
              var url = "/rajal/"+kddokter+"/"+tanggal;
              $.ajax({
              type: "GET",
              url: url,
              success: function(res){
                  // alert(res.message);
                  var result = res.data;  
                  var jumlah = res.jumlah;
                  $.each(result,function(i,item){
                      var lis = '<div class="card"><div class="card-content" style="padding: 10px;"><span>'+item.NAMA+'</span><br><span style="font-weight: bold;">'+item.NOMR+'</span></div></div>'
                      $('#listcontent').append(lis);
                  })
                  $('.jumlah').html("Jumlah Pasien : "+jumlah);
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
  };

}
function ambillistpasienranap(){
  $('.progress').show();
  var request = indexedDB.open("myDatabase",2);
  request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
  };
  request.onsuccess = function(event) {
  db = event.target.result;
  console.log("sukses open");
   const transaction = db.transaction(['user'], 'readwrite');
      const objectStore = transaction.objectStore('user');
      
      objectStore.openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
          if (cursor.value.status === 'sukses') {
              result = cursor.value.message;
              console.log("data : "+cursor.value.message);
              $('#doktere').html(cursor.value.data[0].nm_dokter);
              var kddokter = cursor.value.data[0].kd_dokter;
              var url = "/ranap/"+kddokter;
              $.ajax({
              type: "GET",
              url: url,
              success: function(res){
                  // alert(res.message);
                  var result = res.data;  
                  var jumlah = res.jumlah;
                  $.each(result,function(i,item){
                      var lis = '<div class="card"><div class="card-content" style="padding: 10px;"><span>'+item.NAMA+'</span><br><span style="font-weight: bold;">'+item.NOMR+'</span></div></div>'
                      $('#listcontent').append(lis);
                  })
                  $('.jumlah').html("Jumlah Pasien : "+jumlah);
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
  };

}
function deleten(){
  
    let dbReq = indexedDB.open('myDatabase',2);
    dbReq.onsuccess = function(event){
        db = event.target.result;
        console.log("berhasil koneksi idb");
    }
    dbReq.onerror = function(event){
        console.log("gagal koneksi idb");
    }

  const transaction = db.transaction(['user'], 'readwrite');
  const objectStore = transaction.objectStore('user');
  
  objectStore.openCursor().onsuccess = function(event){
      var cursor =event.target.result;
      if(cursor){
          if(cursor.value.message === "Login berhasil"){
              var request = cursor.delete();
              request.onsuccess = function(){
                  alert("logout sukses");
                  window.location.href = '/';
              }
          }
      }
  }
}

function getdatauser(){
    let db;
    let dbReq = indexedDB.open('myDatabase',2);
    dbReq.onsuccess = function(event){
        db = event.target.result;
        console.log("berhasil koneksi idb");
    }
    dbReq.onerror = function(event){
        console.log("gagal koneksi idb");
    }
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    var countuser = objectStore.count();
    countuser.onsuccess =function(){
        var login = countuser.result;
        if(login < 1){
            console.log("belum login : ");
        }else{
            console.log("weslogin");
        }
    }
  }
   