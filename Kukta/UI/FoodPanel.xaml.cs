using Cooktapi.Food;
using Kukta.UWPLayer;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    public delegate void ItemClickDelegate(Food food);
    public delegate void PanelClickDelegate();
    public sealed partial class FoodPanel : UserControl, INotifyPropertyChanged
    {
        public event ItemClickDelegate OnItemClick;
        public event PanelClickDelegate OnPanelClick;

        public FoodPanel()
        {
            this.InitializeComponent();
            this.SizeChanged += (sender,args) => {
                if (ItemsSource != null && ((uint)(MaxRows * (args.PreviousSize.Width / 250)) != ((uint)( MaxRows * ItemsPerRow))))
                    ItemsSource.MaxItems = (uint)(MaxRows * ItemsPerRow);
            };
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
        private IncrementalFoodSource m_Source;
        public IncrementalFoodSource ItemsSource
        {
            get { return m_Source; }
            set { m_Source = value; OnPropertyChanged("ItemsSource"); PreloadCount = PreloadCount; if (ItemsSource != null) ItemsSource.MaxItems = (uint)(ItemsPerRow * MaxRows); }
        }
        public int ItemsPerRow
        {
            get
            {
                return (int)(this.ActualWidth / 250);
            }
        }
        private int m_MaxRows = 0;
        public int MaxRows
        {
            get
            {
                return m_MaxRows;
            }
            set
            {
                m_MaxRows = value;
                if (ItemsSource != null)
                    ItemsSource.MaxItems = (uint)(value * ItemsPerRow);
            }
        }

        private int m_PreloadCount;
        public int PreloadCount
        {
            get
            {
                return m_PreloadCount;
            }
            set
            {
                m_PreloadCount = value;
                if (ItemsSource != null && ItemsSource.Count < m_PreloadCount && ItemsSource.HasMoreItems) _ = ItemsSource.LoadMoreItemsAsync((uint)(m_PreloadCount - ItemsSource.Count));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        private void Panel_Click(object sender, RoutedEventArgs e)
        {
            OnPanelClick?.Invoke();
        }

        private void ItemClick(object sender, ItemClickEventArgs e)
        {
            try
            {
                Food food = e.ClickedItem as Food;
                OnItemClick?.Invoke(food);
            }
            catch (InvalidCastException) { return; }

        }
    }
    public enum EFoodPanelMode
    {
        Compact,
        List,
        HorizontalCompactScroll,
        TagStack,
    }
}
