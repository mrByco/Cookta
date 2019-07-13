using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace IngredientUpdater
{
    class Program
    {

        static List<BsonDocument> Parsed = new List<BsonDocument>();

        static void Main(string[] args)
        {
            const string def = "mongodb+srv://IngredientUpdater:lMUFLKHOKLQwHUx3@kukta1-nfeff.azure.mongodb.net/test?retryWrites=true&w=majority";
            Console.WriteLine("Write your Mongodb connection string:");
            string connectionString = Console.ReadLine();

            if (connectionString == "default")
                connectionString = def;

            Console.WriteLine("Write your database name");
            string databaseName = Console.ReadLine();

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);

            Console.WriteLine("Write your collection name");
            string ingredient = Console.ReadLine();


            Console.WriteLine(@"Write your text file name (full name required) at application root. Root: " + Directory.GetCurrentDirectory());
            string filename = Console.ReadLine();
            if (!ReadData(filename))
            {
                Console.WriteLine("Error when reading data!");
                return;
            }
            Console.WriteLine("Data reading succefully");


            var collection = database.GetCollection<BsonDocument>(ingredient);
            collection.DeleteMany(Builders<BsonDocument>.Filter.Empty);
            Console.WriteLine("Documents deleted!");




            collection.InsertMany(Parsed);

            Console.WriteLine("Documents inserted!");


        }
        static bool ReadData(string filename)
        {
            string root = Directory.GetCurrentDirectory();
            FileStream fileStream = new FileStream(root + @"\" + filename, FileMode.Open);

            Parsed = new List<BsonDocument>();
            List<string> HeaderTitles = new List<string>();
            List<string> Types = new List<string>();

            using (StreamReader reader = new StreamReader(fileStream))
            {
                string line = reader.ReadLine();
                int LineIndex = 1;
                if (line == null)
                {
                    return true;
                }
                //Header names:
                string[] Headers = line.Split("\t");
                foreach (string header in Headers)
                {
                    bool isValidType = false;
                    string type = "";
                    while (!isValidType)
                    {
                        Console.WriteLine("What is the type of '" + header + "' field? (string/int/bool/double)");
                        type = Console.ReadLine();
                        isValidType = type == "string" || type == "int" || type == "bool" || type == "double";
                    }
                    Types.Add(type);
                    HeaderTitles.Add(header);
                }

                //Read all data and create BSON
                while (line != null)
                {
                    line = reader.ReadLine();
                    LineIndex++;
                    if (line == null)
                        return true;
                    string[] datas = line.Split("\t");

                    BsonDocument doc = new BsonDocument();
                    for (int i = 0; i < datas.Length; i++)
                    {
                        string typeForData = Types[i];
                        string header = HeaderTitles[i];

                        //parseData
                        try
                        {
                            switch (typeForData)
                            {
                                case "string":
                                    doc.Add(header, datas[i]);
                                    break;
                                case "int":
                                    doc.Add(header, new BsonInt32(Int32.Parse(datas[i])));
                                    break;
                                case "bool":
                                    doc.Add(header, new BsonBoolean(Boolean.Parse(datas[i].ToLower())));
                                    break;
                                case "double":
                                    doc.Add(header, new BsonDouble(Double.Parse(datas[i], CultureInfo.InvariantCulture)));
                                    break;
                            }
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                            Console.WriteLine("Error at index: " + i + " at verb: " + datas[i] + " at line: " + LineIndex);
                            return false;
                        }

                    }
                    Parsed.Add(doc);

                }

            }

            return true;
        }
    }
}
