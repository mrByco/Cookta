using FileHelpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Food
{
    public class Tag
    {
        public string ParentID { get; private set; }
        public string ID { get; private set; }
        public string Name { get; private set; }

        public Tag(string parent, string id, string name)
        {
            ParentID = parent;
            ID = id;
            Name = name;
        }

        private static List<Tag> m_Tags;
        public static List<Tag> Tags { get { return m_Tags; } }
        public string AsString
        {
            get
            {
                return Name;
            }
        }
        public override string ToString()
        {
            return Name;
        }
        public static List<Tag> GetTagsByTexts(List<string> Texts, string lang)
        {
            List<Tag> list = new List<Tag>();
            foreach (string text in Texts)
            {
                list.Add(Tags.Find((tag) => { return tag.Name == text; }));
            }
            return list;
        }
        public static List<string> GetTagsAsTexts(string lang)
        {
            List<string> list = new List<string>();
            foreach (Tag tag in Tags)
            {
                list.Add(tag.Name);
            }
            return list;
        }

        public static Tag GetTagByText(string text)
        {
            foreach (Tag tag in Tags)
            {
                if (tag.Name == text)
                    return tag;
            }
            return null;
        }
        public static Tag GetTagById(string id)
        {
            foreach (Tag tag in Tags)
            {
                if (tag.ID == id)
                    return tag;
            }
            return null;
        }
        public static async Task DownloadTags()
        {
            var response = await Networking.Networking.GetRequestSimple("tags", new Dictionary<string, object>());
            if (response.Content != "" && response.Content != null)
                m_Tags = ParseTags(response.Content);
            else
                m_Tags = new List<Tag>();
        }
        private static List<Tag> ParseTags(string str)
        {
            JArray jarray = JArray.Parse(str);
            List<Tag> tags = new List<Tag>();
            for (int i = 0; i < jarray.Count; i++)
            {
                tags.Add(ParseTag(jarray.ElementAt(i).ToString(Formatting.None)));
            }
            return tags;
        }
        public static Tag ParseTag(string json)
        {
            JObject jUnit = JObject.Parse(json);
            return ParseUnit(jUnit);
        }
        public static Tag ParseUnit(JObject jUnit)
        {
            string id = jUnit.GetValue("guid").Value<string>();
            string parentId = jUnit.GetValue("parent")?.Value<string>();
            string name = jUnit.GetValue("name")?.Value<string>();

            Tag tag = new Tag(parentId, id, name);

            return tag;
        }
        private async Task Save()
        {
            string body = SerializeToServer(this);
            var res = await Networking.Networking.PostRequestWithForceAuth("tag", body);
        }
        private static string SerializeToServer(Tag tag)
        {
            JObject jObject = new JObject();
            jObject.Add("guid", JToken.FromObject(tag.ID));
            jObject.Add("parent", JToken.FromObject(tag.ParentID));
            jObject.Add("name", JToken.FromObject(tag.Name));
            return jObject.ToString(Formatting.None);
        }
    }
}
