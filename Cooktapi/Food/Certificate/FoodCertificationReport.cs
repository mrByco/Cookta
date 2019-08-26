using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Cooktapi.Food.Certificate
{
    public class FoodCertificationReport : INotifyPropertyChanged, IFoodCertificationResult
    {
        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        public string GetResultText()
        {
            return IsOk ? "Sikeres" : "Sikertelen";
        }

        public bool? GetResult()
        {
            return IsOk;
        }


        private bool m_TitleOk;
        [JsonProperty("titleOk")]
        public bool TitleOk
        {
            get
            {
                return m_TitleOk;
            }
            set
            {
                m_TitleOk = value;
                OnPropertyChanged("TitleOk");
                OnPropertyChanged("CommentOptionsVisible");
            }
        }

        private bool m_DescOk;
        [JsonProperty("descOk")]
        public bool DescOk
        {
            get
            {
                return m_DescOk;
            }
            set
            {
                m_DescOk = value;
                OnPropertyChanged("DescOk");
                OnPropertyChanged("CommentOptionsVisible");
            }
        }
        private bool m_IngredientsOk;
        [JsonProperty("ingOk")]
        public bool IngredientsOk
        {
            get
            {
                return m_IngredientsOk;
            }
            set
            {
                m_IngredientsOk = value;
                OnPropertyChanged("IngredientsOk");
                OnPropertyChanged("CommentOptionsVisible");
            }
        }
        private bool m_DoseOk;
        [JsonProperty("doseOk")]
        public bool DoseOk
        {
            get
            {
                return m_DoseOk;
            }
            set
            {
                m_DoseOk = value;
                OnPropertyChanged("DoseOk");
                OnPropertyChanged("CommentOptionsVisible");
            }
        }
        private bool m_TagsOk;
        [JsonProperty("tagOk")]
        public bool TagsOk
        {
            get
            {
                return m_TagsOk;
            }
            set
            {
                m_TagsOk = value;
                OnPropertyChanged("TagsOk");
                OnPropertyChanged("CommentOptionsVisible");
            }
        }
        private bool m_ImageOk;
        [JsonProperty("imgOk")]
        public bool ImageOk
        {
            get
            {
                return m_ImageOk;
            }
            set
            {
                m_ImageOk = value;
                OnPropertyChanged("ImageOk");
                OnPropertyChanged("CommentOptionsVisible");
            }
        }
        [JsonIgnore]
        public bool IsOk { get { return TitleOk && DescOk && IngredientsOk && TagsOk && ImageOk && DoseOk; } }
        private string m_Comment;
        [JsonProperty("comment")]
        public string Comment
        {
            get
            {
                return m_Comment;
            }
            set
            {
                m_Comment = value;
                OnPropertyChanged("Comment");
            }
        }

    }
}
