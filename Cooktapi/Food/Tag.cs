﻿using FileHelpers;
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
        public string ParentID { get; set; }
        public string ID { get; private set; }
        public string Name { get; set; }
        public bool IsChildOnly { get; set; }

        public Tag(string parent, string id, string name, bool isCildOnly)
        {
            ParentID = parent;
            ID = id;
            Name = name;
            IsChildOnly = isCildOnly;
        }

        private static List<Tag> m_Tags;
        public static List<Tag> Tags => m_Tags;

        public static List<Tag> ChildOnlyTags
        {
            get
            {
                var childOnlyTags = new List<Tag>();
                Tags.ForEach(tag =>
                {
                    if (tag.IsChildOnly) childOnlyTags.Add(tag);
                });
                return childOnlyTags;
            }
        }

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
            return ParseTag(jUnit);
        }
        public static Tag ParseTag(JObject jTag)
        {
            string id = jTag.GetValue("guid").Value<string>();
            string parentId = jTag.GetValue("parent")?.Value<string>();
            string name = jTag.GetValue("name")?.Value<string>();
            bool isChildOnly = jTag.Value<bool?>("ischildonly") ?? false;

            Tag tag = new Tag(parentId, id, name, isChildOnly);

            return tag;
        }
        public async Task<Tag> Save()
        {
            string body = SerializeToServer(this);
            var res = await Networking.Networking.PostRequestWithForceAuth("tag", body);
            return this;
        }
        public async Task Delete()
        {
            var query = new Dictionary<string, object>();
            query.Add("guid", this.ID);
            var res = await Networking.Networking.DeleteRequestWithForceAuth("tag", query);
        }
        private static string SerializeToServer(Tag tag)
        {
            JObject jObject = new JObject();
            jObject.Add("guid", JToken.FromObject(tag.ID));
            if (tag.ParentID != null)
                jObject.Add("parent", JToken.FromObject(tag.ParentID));
            jObject.Add("name", JToken.FromObject(tag.Name));
            return jObject.ToString(Formatting.None);
        }
    }
}
