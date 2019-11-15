const router = require('express').Router();
const admin = require('firebase-admin');

var builder = require('xmlbuilder');
var fs     = require('fs');

var formidable = require('formidable');
var mv = require('mv');
var builder = require('xmlbuilder');

var dirPath = __dirname + "/../public/xmlfiles/booksxml.xml";
var cfg = require(__dirname+'/public/manifest.json');
var namaapplikasi = cfg.name;
var fkey = cfg.firebasekey[0];
var dburl = cfg.databaseurl;
admin.initializeApp({
    credential: admin.credential.cert(fkey),
    databaseURL: dburl
  });

var db = admin.database().ref();
var tb_user = 'users';
var tb_article = 'article';
const userref = db.child(tb_article).limitToLast(9);
router.post('/add',(req,res)=>{
    var title = req.body.title;
    var tag = req.body.tag;
    var thumb = req.body.thumb;
    var content = req.body.content;

    var dc = content.substring(0,100);
    var slg = ToSeoUrl(title);

    let data = {
        title : req.body.title,
        desc : dc,
        slug : slg,
        tag : req.body.tag,
        thumb : req.body.thumb,
        content : req.body.content
    }
    var articleref = db.child(tb_article);
    articleref.push(data);
})
router.get('/',(req,res)=>{
   
    userref.once("value", function(snapshot) {
        var d = snapshot.val();
        res.render('home/beranda',{
            title: namaapplikasi,
            data : d,
            slide : false ,
            na : namaapplikasi
           }) 
    });
   
});
router.post('/upload',(req,res)=>{
 
    var form = new formidable.IncomingForm();
        
  
    // manangani upload file
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = __dirname + "/uploads/" + files.filetoupload.name;

      // pindahakan file yang telah di-upload
      mv(oldpath, newpath, function (err) {
        if (err) { throw err; }
        console.log('file uploaded successfully');
        return res.end("file uploaded successfully");
      });
    });
});
router.get('/upload',(req,res)=>{
        
    // kirim form upload
    
        res.render('page/upload',{
            title: namaapplikasi,
            slide : false ,
            na : namaapplikasi
           }) 
      
});
router.get('/blog/:slug',(req,res)=>{
    var slug = req.params.slug;
    var d;
    var field,key;
    var uref = db.child(tb_article).limitToLast(1); 
    uref.orderByChild('slug').equalTo(slug).once("value", function(snapshot) {
       d = snapshot.val();
       var title = [] ;
       var c,t,view;
       for(i in d){
           title = i;
           c = d[i].content;
           t = d[i].title;
           thumb = d[i].thumb;
           view = d[i].views;
       }
        key = Object.keys(d)[0];
        view = parseInt(view);
        view = view + 1;
       
      
    //   res.send(d);
    var userrf = db.child(tb_article).child(key);
    userrf.update({
        "views":view
        });
       
    //    res.send(data.content);
       res.render('blog/detail',{
         title : t,
         data  : c,
         thumb : thumb,
         slide : false ,
         view  : view,
         na : namaapplikasi
        }); 
    });
})
router.get('/loadmore/:s',(req,res)=>{
    // var queryText = req.params.q
    var start = req.params.s
    var startpage = parseInt(start);
    var uref = db.child(tb_article);
    uref.orderByChild('ongko').startAt(startpage).limitToFirst(5).once("value", function(snapshot) {
       var d = snapshot.val();
       var list = '<li></li>';
       var a = "";
      for(i in d){
        //   a += '<li>'+d[i].title
        //         +
        //         +
        //         '</li>';
        a += '<li data-id="'+d[i].ongko+'">'+
        '<a href="/blog/'+d[i].slug+'" style=" color:inherit;text-decoration: none;">'+
            '<div class="col s12 m4">'+
                '<div class="card" style="padding:10px">'+
                    '<div class="card-image">'+
                    '<img style="height: 20vh;width:100%" src="'+d[i].thumb+'" alt="'+d[i].title+'">'+
                    '<div style="padding-left: 5px;padding-right: 5px;padding-top: 5px;">'+
                    '<span style="font-size: 13pt;text-transform:capitalize;font-weight:bold;">'+d[i].title+'</span>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
                '</div>'+
             '</a>'+
            '</li>';
      }
     
       res.send(a);
        // res.render('home/beranda',{
        //     title:'SSCASN Informasi',
        //     data : d,
        //     slide : false ,
        // }) 
    });
 
})
router.get('/navigasi',(req,res)=>{
    res.sendFile(__dirname+'/views/layouts/navigasi.hbs');
})
router.get('/data',(req,res)=>{
    userref.once("value", function(snapshot) {
    var d = snapshot.val();
    res.send(d);
    });
});
router.get('/error',(req,res)=>{
    // where
    // orderByChild('email').equalTo('jane@doe.com').
   userref.once("value", function(snapshot) {
       var d = snapshot.val();
       res.render('home/beranda',{
        title:'Hai Tekno',
        data : d,
        slide : false 
       }) 
   });

});
router.get('/rajal',(req,res)=>{
    res.render('dokter/list_rajal',{
        slide : false ,
        title : 'Rawat Jalan',
        baseurl : siteurl
    });
});

router.get('/sitemap',(req,res)=>{
    var ureff = db.child(tb_article);
    ureff.once("value", function(snapshot) {
        var d = snapshot.val();
        // res.send(d);
          var root = builder.create('urlset');
        for(i in d){
            var item = root.ele('url');
            item.ele('loc','http://blog.cahkulutan.xyz/blog/'+d[i].slug);
            item.ele('changefreq','daily');
        }
      var xml = root.end({pretty:true});
        res.end(xml);
    
    });

   
})
function ToSeoUrl(url) {
        
    // make the url lowercase         
    var encodedUrl = url.toString().toLowerCase(); 
  
    // replace & with and           
    encodedUrl = encodedUrl.split(/\&+/).join("-and-")
  
    // remove invalid characters 
    encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");       
  
    // remove duplicates 
    encodedUrl = encodedUrl.split(/-+/).join("-");
  
    // trim leading & trailing characters 
    encodedUrl = encodedUrl.trim('-'); 
  
    return encodedUrl; 
  }
module.exports = router;