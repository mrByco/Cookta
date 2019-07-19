using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FrameWork
{
    public static class StringExtensions
    {
        public static UsernameValidResult IsValidUsername(this string username)
        {
            UsernameValidResult result = new UsernameValidResult();
            result.CharacterCount = username.Length > 3 && username.Length < 31;
            return result;
        }
    }
    public struct UsernameValidResult
    {
        public bool CharacterCount;
        public bool IsValid()
        {
            return CharacterCount;
        }
        public bool Available;
    }
}
