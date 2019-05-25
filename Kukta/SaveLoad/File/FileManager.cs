
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.SaveLoad.File
{
    class FileManager
    {
        private static List<IFileTask> fileTasks = new List<IFileTask>();
        public static void AddTask(IFileTask task)
        {
            fileTasks.Add(task);
            if (fileTasks.Count == 1)
            {
                DoNextTask();
            }
        }
        private static async void DoNextTask()
        {
            if (fileTasks.Count > 0)
            {
                await fileTasks[0].OperateAsync();
                fileTasks.RemoveAt(0);
                DoNextTask();
                return;
            }
        }
    }
}
