using Cooktapi.Food;
using Kukta.UWPLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class FixedSourceFoodPanel : UserControl, INotifyPropertyChanged
    {
        public FixedSourceFoodPanel()
        {
            this.InitializeComponent();
        }
        //Display settings
        private EFoodPanelMode m_PanelMode;
        public EFoodPanelMode PanelMode
        {
            get { return m_PanelMode; }
            set { m_PanelMode = value; OnPropertyChanged("PanelMode"); }
        }
        private string m_Title = "";
        public string TitleText
        {
            get { return m_Title; }
            set { m_Title = value; OnPropertyChanged("TitleText"); }
        }
        private SolidColorBrush m_TitleBackgroundColor = new SolidColorBrush(Colors.LightYellow);
        public SolidColorBrush TitleBackgroundColor
        {
            get { return m_TitleBackgroundColor; }
            set { m_TitleBackgroundColor = value; OnPropertyChanged("TitleBackgroundColor"); }
        }
        private SolidColorBrush m_TitleForegroundcolor = new SolidColorBrush(Colors.LightYellow);
        public SolidColorBrush TitleForegroundColor
        {
            get { return m_TitleForegroundcolor; }
            set { m_TitleForegroundcolor = value; OnPropertyChanged("TitleForegroundColor"); }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private IncrementalFoodSource m_Source;
        private IncrementalFoodSource ItemsSource
        {
            get { return m_Source; }
            set { m_Source = value; OnPropertyChanged("ItemsSource"); }
        }
        private int m_RowCount;

        //Source settings

        public int RowCount
        {
            get
            {
                return m_RowCount;
            }
            set
            {
                m_RowCount = value;
                OnPropertyChanged("RowCount");
            }
        }
        private string m_SearchText;
        public string SearchText
        {
            get
            {
                return m_SearchText;
            }
            set
            {
                m_SearchText = value;
                BuildNewSource();
            }
        }
        private string m_TagString;
        public string TagString
        {
            get
            {
                return m_TagString;
            }
            set
            {
                m_TagString = value;
                BuildNewSource();
            }
        }
        private EFoodSearchType m_Type;
        public EFoodSearchType Type
        {
            get
            {
                return m_Type;
            }
            set
            {
                m_Type = value;
                BuildNewSource();
            }
        }
        private void BuildNewSource()
        {
            var query = new Dictionary<string, object>();
            if (SearchText != null && SearchText != "")
                query.Add("text", SearchText);
            if (TagString != null && TagString != "")
                query.Add("filter", TagString);
            ItemsSource = new IncrementalFoodSource(m_Type, query, Dispatcher, FoodPanel.ItemsPerRow * RowCount);
            ItemsSource.LoadMoreItemsAsync(1);
        }

        private void FoodPanel_OnItemClick(Food food)
        {
            MainPage.NavigateTo("fooddetail", null, food._id);
        }
    }
}
