using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace IngredientUpdater
{
    class Program
    {


        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to Cookta backup creator!");
            Console.WriteLine("----------------------------------");
            Console.WriteLine("Please log in to mongo");
            Console.WriteLine("Username");
            string username = Console.ReadLine();
            Console.WriteLine("Password");
            string password = Console.ReadLine();
            try
            {
                string connectionString =
                    $"mongodb+srv://{username}:{password}@kukta1-nfeff.azure.mongodb.net/";
                

                var client = new MongoClient(connectionString);

                Thread.Sleep(6000);

                Console.WriteLine("Your database name");
                string databaseName = "Kuktadb";

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

            }
            catch (Exception e)
            {
                return;
            }

        }

        
    }
}
