using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class FoodValidationPage : Page, INotifyPropertyChanged
    {
        public FoodValidationPage()
        {
            this.InitializeComponent();
        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        public FoodCertificationReport m_Report = new FoodCertificationReport();
        public FoodCertificationReport Report
        {
            get
            {
                return m_Report;
            }
            set
            {
                m_Report = value;
                OnPropertyChanged("Report");
            }
        }

        public string CurrentFoodId;

        private bool m_IsLoading;
        public bool IsLoading
        {
            get
            {
                return m_IsLoading;
            }
            set
            {
                m_IsLoading = value;
                _ = Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { OnPropertyChanged("IsLoading"); });
            }
        }

        public async void Loadfood(string foodId)
        {
            IsLoading = true;
            CurrentFoodId = foodId;
            await FoodPage.Load(foodId, false);
            if (FoodPage.CurrentFood == null)
                HandleLoadingError();
            IsLoading = false;
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (e.Parameter is string foodId)
            {
                Task.Run(() => { Loadfood(foodId); });
            }
            else
            {
                HandleLoadingError();
            }
        }
        public void HandleLoadingError()
        {
            MainPage.NavigateTo("home", null, null);
            App.Sendnotification("Betöltés sikertelen", "");
        }

        private void SendButton_Click(object sender, RoutedEventArgs e)
        {

        }

        private void ReportSource_Changed(object sender, RoutedEventArgs e)
        {
            var report = GetCurrentReportState();
            CommentTextBox.IsEnabled = !report.IsOk;
        }

        private FoodCertificationReport GetCurrentReportState()
        {
            var report = new FoodCertificationReport();
            report.TitleOk = TitleOkCheckBox.IsChecked ?? false;
            report.DescOk = DescOkCheckBox.IsChecked ?? false;
            report.IngredientsOk = IngOkCheckBox.IsChecked ?? false;
            report.DescOk = DoseOkCheckBox.IsChecked ?? false;
            report.ImageOk = ImageOkCheckBox.IsChecked ?? false;
            report.TagsOk = TagsOkCheckBox.IsChecked ?? false;
            return report;
        }
    }
}
