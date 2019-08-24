using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Cooktapi.Food
{
    public class FoodCertificationReport : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        private bool m_TitleOk;
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
        public bool IsOk { get { return TitleOk && DescOk && IngredientsOk && TagsOk && ImageOk && DoseOk; } }
        private string m_Comment;
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
