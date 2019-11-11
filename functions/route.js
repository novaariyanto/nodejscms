const router = require('express').Router();
const admin = require('firebase-admin');

var builder = require('xmlbuilder');
var fs     = require('fs');
var dirPath = __dirname + "/../public/xmlfiles/booksxml.xml";


var serviceAccount = require(__dirname+'/firebasekey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dokterapp-6804c.firebaseio.com"
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
            title:'Hai Tekno',
            data : d,
            slide : false ,
           }) 
    });
   
});
router.get('/blog/:slug',(req,res)=>{
    var slug = req.params.slug;
    var d;
    var field,key;
    var uref = db.child(tb_article).limitToFirst(1); 
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
         view  : view
        }) 
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
    var xml = builder.create('bookstore');
     
    var result = req.models.book.find({
     }, function(error, books){
   
       if(error) throw error;
           for(var i=0; i< books.length; i++){
               xml.ele('book')
               .ele('name', {'lang': books[i]['language']}, books[i]['name']).up()
               .ele('price', books[i]['price']).up()
               .ele('category', books[i]['category']).up()
               .ele('author', books[i]['author']).up()
               .ele('ISBN', books[i]['ISBN']).up()
               .ele('publish_date', books[i]['publish_date']).end();
           }
            
           var xmldoc = xml.toString({ pretty: true }); 
          
           fs.writeFile(dirPath, xmldoc, function(err) {
               if(err) { return console.log(err); } 
               console.log("The file was saved!");
               res.render('index', { title: 'Generate XML using NodeJS' });
         
             }); 
        
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