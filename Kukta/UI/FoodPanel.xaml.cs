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
    public sealed partial class FoodPanel : UserControl, INotifyPropertyChanged
    {

        public FoodPanel()
        {
            this.InitializeComponent();
        }
        //Display settings
        private EFoodPanelMode m_PanelMode;
        public EFoodPanelMode PanelMode
        {
            get { return m_PanelMode; }
            set {  m_PanelMode = value; OnPropertyChanged("PanelMode"); }
        }
        private Orientation m_Orientation;
        public Orientation FeedOrientation
        {
            get { return m_Orientation; }
            set { m_Orientation = value; OnPropertyChanged("Orientation"); }
        }
        private IncrementalFoodSource m_Source;
        public IncrementalFoodSource ItemsSource
        {
            get { return m_Source; }
            set {  m_Source = value; OnPropertyChanged("ItemsSource"); PreloadCount = PreloadCount; }
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


        public void OnItemClick()
        {

        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
    public enum EFoodPanelMode
    {
        Compact,
        List,
        VerticalCompactScroll,
        TagStack,
    }
}
