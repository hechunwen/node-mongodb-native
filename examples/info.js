require.paths.unshift("../lib");

GLOBAL.DEBUG = true;

sys = require("sys");
test = require("mjsunit");

require("mongodb/db");
require("mongodb/bson/bson");
require("mongodb/gridfs/gridstore");

var host = process.ENV['MONGO_NODE_DRIVER_HOST'] != null ? process.ENV['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.ENV['MONGO_NODE_DRIVER_PORT'] != null ? process.ENV['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

sys.puts("Connecting to " + host + ":" + port);
var db = new Db('node-mongo-examples', new Server(host, port, {}), {});
db.open(function(db) {
  db.collection(function(collection) {
    
    // Remove all existing documents in collection
    collection.remove(function(collection) {
      
      // Insert 3 records
      for(var i = 0; i < 3; i++) {
        collection.insert({'a':i});
      }
      
      // Show collection names in the database
      db.collectionNames(function(names) {
        names.forEach(function(name) {
          sys.puts(sys.inspect(name.unorderedHash()));          
        });
      });
      
      // More information about each collection
      db.collectionsInfo(function(cursor) {
        cursor.toArray(function(items) {
          items.forEach(function(item) {
            sys.puts(sys.inspect(item.unorderedHash()));          
          });        
        });
      })  
      
      // Index information
      db.createIndex(function(indexName) {
        db.indexInformation(function(doc) {
          sys.puts(sys.inspect(doc));                    
          collection.drop(function(result) {
            db.close();
          });
        }, 'test');
      }, 'test', 'a');
    });
  }, 'test');
});