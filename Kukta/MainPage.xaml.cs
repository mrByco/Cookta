using Kukta.Screens;
using System;
using System.Collections.Generic;
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

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace Kukta
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public bool HamburgerOpen;

        public MainPage()
        {
            this.InitializeComponent();
            SetContent(ContentType.CategorieEditor);
        }

        private void HamburgerButton_Click(object sender, RoutedEventArgs e)
        {
            HamburgerSplitView.IsPaneOpen = !HamburgerSplitView.IsPaneOpen;
        }
        

        private void IconsListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ListBox listBox = sender as ListBox;
            int SelectedIndex = listBox.SelectedIndex;
            SetContent((ContentType)SelectedIndex);
        }

        private void SetContent(ContentType type)
        {
            switch (type)
            {
                case ContentType.FoodEditor:
                    ContentFrame.Navigate(typeof(FoodEditor), null);
                    break;
                case ContentType.CategorieEditor:
                    ContentFrame.Navigate(typeof(FoodCategories), null);
                    break;
            }
        }
        internal void ShowWarning(string title, string desc)
        {
            WarningDialog.Title = title;
            WarningDialog.Content = desc;
            WarningDialog.PrimaryButtonText = "OK";
            WarningDialog.ShowAsync();
        }
    }
    public enum ContentType {
        FoodEditor, CategorieEditor
    }
}
