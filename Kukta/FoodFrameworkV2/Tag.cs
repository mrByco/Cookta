using FileHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFrameworkV2
{
    [DelimitedRecord(",")]
    public class Tag
    {
        public string id;

        public string hu_hu;

        [FieldHidden]
        private static List<Tag> m_Tags;
        public static List<Tag> Tags
        {
            get
            {
                if (m_Tags is null)
                {
                    m_Tags = new List<Tag>();
                    var engine = new FileHelperEngine<Tag>();
                    var tags = engine.ReadFile("Assets/tags/tags.csv");
                    foreach (Tag tag in tags)
                    {
                        m_Tags.Add(tag);
                    }
                }
                return m_Tags;
            }
        }
        [FieldHidden]
        public string AsString
        {
            get
            {
                return hu_hu;
            }
        }
        public override string ToString()
        {
            return hu_hu;
        }
        public static List<Tag> GetTagsByTexts(List<string> Texts, string lang)
        {
            List<Tag> list = new List<Tag>();
            foreach(string text in Texts)
            {
                list.Add(Tags.Find((tag) => { return tag.hu_hu == text; }));
            }
            return list;
        }
        public static List<string> GetTagsAsTexts(string lang)
        {
            List<string> list = new List<string>();
            foreach (Tag tag in Tags)
            {
                list.Add(tag.hu_hu);
            }
            return list;
        }

        internal static Tag GetTagByText(string text)
        {
            foreach (Tag tag in Tags)
            {
                if (tag.hu_hu == text)
                    return tag;
            }
            return null;
        }
        internal static Tag GetTagById(string id)
        {
            foreach (Tag tag in Tags)
            {
                if (tag.hu_hu == id)
                    return tag;
            }
            return null;
        }
    }
}
