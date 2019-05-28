using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.SaveLoad.File
{
    interface IStorageable
    {
        string GetFileName();
        Type GetDataType();
        object GetDataClass();
        void FromDataClass(object DataClass);
    }
}
