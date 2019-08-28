using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cooktapi.Extensions;

namespace Cooktapi.Networking
{
    public class NotificationManager : INotifyPropertyChanged
    {

        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }


        private bool m_HasNewNotification;
        public bool HasNewNotification
        {
            get => m_HasNewNotification;
            set
            {
                m_HasNewNotification = value;

                Cookta.RunOnUIThread(() => { OnPropertyChanged("HasNewNotification"); });
            }
        }


        public static NotificationManager Instance { get; set; }
        public async static Task Init()
        {
            if (Instance == null) Instance = new NotificationManager();
            await UpdateHasNewNotification();
        }
        public async static Task UpdateHasNewNotification()
        {
            var res = await Networking.GetRequestWithForceAuth("hasnotification", new Dictionary<string, object>());
            bool has;
            if (bool.TryParse(res.Content, out has))
            {
                Instance.HasNewNotification = has;
            }
        }
        public async static Task ArhiveNotification(string ID)
        {
            var body = new JObject();
            body.Add("_id", ID);
            var res = await Networking.PutRequestWithForceAuth("notification", body.ToString());
        } 
        public async static Task<List<Notification>> GetNotifications(uint from, uint to, bool allowArhived)
        {
            var list = new List<Notification>();
            var query = new Dictionary<string, object>();
            query.Add("from", from);
            query.Add("to", to);
            query.Add("allowArhived", allowArhived);
            var res = await Networking.GetRequestWithForceAuth("notification", query);
            try
            {
                var jarray = JArray.Parse(res.Content);
                for (int i = 0; i < jarray.Count; i++)
                {
                    list.Add(jarray.ElementAt(i).ToObject<Notification>());
                }
            }
            catch (JsonReaderException)
            {
                return list;
            }
            _ = Task.Run(async () => { await UpdateHasNewNotification();  });
            return list;
        }
    }
    public class Notification : INotifyPropertyChanged
    {
        [JsonProperty("_id")]
        public string ID { get; set; }
        [JsonIgnore]
        private long m_Added;
        [JsonProperty("added")]
        public long Added
        {
            get => m_Added;
            set
            {
                m_Added = value;
                OnPropertyChanged("Added");
            }
        }
        public DateTime D_Added => DateTimeExtensions.FromTotalMilis(Added);
        [JsonIgnore]
        private long? m_Viewed;
        [JsonProperty("viewed")]
        public long? Viewed
        {
            get => m_Viewed;
            set
            {
                m_Viewed = value;
                OnPropertyChanged("Viewed");
            }
        }
        [JsonIgnore]
        private long? m_Arhived;
        [JsonProperty("arhived")]
        public long? Arhived
        {
            get => m_Arhived;
            set
            {
                m_Arhived = value;
                OnPropertyChanged("Arhived");
                OnPropertyChanged("IsArhived");
            }
        }
        public bool IsArhived => Arhived != null;
        [JsonIgnore]
        private string m_Message;

        [JsonProperty("message")]
        public string Message
        {
            get => m_Message;
            set
            {
                m_Message = value;
                OnPropertyChanged("Message");
            }
        }
        [JsonIgnore]
        private string m_Title;
        [JsonProperty("title")]
        public string Title
        {
            get => m_Title;
            set
            {
                m_Title = value;
                OnPropertyChanged("Title");
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
