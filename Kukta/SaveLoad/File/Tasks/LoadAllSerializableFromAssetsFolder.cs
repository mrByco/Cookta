using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.SaveLoad.File.Tasks
{
    class LoadAllSerializableFromAssetsFolder<Original, Data> : IFileTask
        where Original : new()
    {
        private readonly Action<List<Original>> OnDone;
        private readonly string Path;
        public LoadAllSerializableFromAssetsFolder(string path, Action<List<Original>> onDone)
        {
            OnDone = onDone;
            Path = path;
        }

        public string Name()
        {
            return "Loading base objects";
        }
#pragma warning disable 1998
        public async Task OperateAsync()
        {
            List<Original> items = new List<Original>();
            string[] foodFiles;
            try
            {
                foodFiles = Directory.GetFiles(Path);
            }
            catch (DirectoryNotFoundException)
            {
                return;
            }
            foreach (string path in foodFiles)
            {
                Data data = JsonConvert.DeserializeObject<Data>(System.IO.File.ReadAllText(path));
                IStorageable item = new Original() as IStorageable;
                item.FromDataClass(data);
                items.Add((Original)item);
            }
            OnDone(items);
            return;
        }
#pragma warning restore 1998
    }
}
