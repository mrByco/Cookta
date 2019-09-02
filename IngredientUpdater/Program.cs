using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;

namespace IngredientUpdater
{
    class Program
    {

        static List<BsonDocument> Parsed = new List<BsonDocument>();

        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to Cookta backup creator!");
            Console.WriteLine("----------------------------------");
            Console.WriteLine("Please log in to mongo");
            Console.WriteLine("Username");
            string username = Console.ReadLine();
            Console.WriteLine("Password");
            string password = Console.ReadLine();

            string connectionString = 
                $"mongodb+srv://{username}:{password}@kukta1-nfeff.azure.mongodb.net/test?retryWrites=true&w=majority";

            var client = new MongoClient(connectionString);

            Console.WriteLine("Your database name");
            var databaseName = Console.ReadLine();

            var database = client.GetDatabase(databaseName);

            List<string> collectionNames;
            try
            {
                collectionNames = database.ListCollectionNames().ToList();
            }
            catch (MongoAuthenticationException)
            {
                return;
            }
            foreach (var collectionName in collectionNames)
            {
                var list = new List<string>();
                var collection = database.GetCollection<BsonDocument>(collectionName);
                var documents = collection.Find(Builders<BsonDocument>.Filter.Empty).ToList();
                foreach (var doc in documents)
                {
                    var id = doc.GetValue("_id").AsObjectId;

                    var newIdElement = new BsonElement("_id", new BsonDocument(new BsonElement("$oid", new BsonString(id.ToString()))));
                    doc.SetElement(newIdElement);
                    list.Add(doc.ToJson().ToString());
                }
                string root = Directory.GetCurrentDirectory();
                var dir = Directory.CreateDirectory(root + @"\Backup\" + DateTime.Now.ToString("yyyy-MM-dd_hh-mm"));
                File.WriteAllLines( dir.FullName + @"\" + collectionName + ".json", list);
            }

            //collection.DeleteMany(Builders<BsonDocument>.Filter.Empty);
            //Console.WriteLine("Documents deleted!");




            Console.WriteLine("Documents inserted!");

        }

        
    }
}
